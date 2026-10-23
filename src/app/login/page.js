'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PhoneEmailSignInBtn from '@/components/PhoneEmailSignInBtn';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Security: Sanitize redirect path to prevent Open Redirect attacks.
  // Only allow same-origin relative paths (must start with '/').
  const rawRedirect = searchParams.get('redirect') || '/dashboard';
  const redirectPath = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get('error') === 'pending'
      ? 'Your agent account is pending approval by the admin. Contact this number (8171261318) for approval of your agent id.'
      : ''
  );
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'otp'
  const [mobile, setMobile] = useState('');
  const [otpModalOpened, setOtpModalOpened] = useState(false);
  const hasVerifiedRef = useRef(false);

  const handlePhoneEmailSuccess = async (user_json_url) => {
    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/phone-email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_json_url }),
      });

      const result = await res.json();
      if (!res.ok) {
        hasVerifiedRef.current = false;
        setError(result.error || 'Failed to authenticate via Mobile OTP.');
        setLoading(false);
        return;
      }

      if (result.token_hash) {
        // Authenticate into Supabase using the verified token hash
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: result.token_hash,
          type: 'magiclink',
        });

        if (verifyError) {
          hasVerifiedRef.current = false;
          setError(verifyError.message || 'Failed to establish login session. Please try again.');
          setLoading(false);
          return;
        }

        setSuccess(`Welcome back, ${result.fullName || 'User'}! Redirecting...`);
        setTimeout(() => {
          router.push(redirectPath);
          router.refresh();
        }, 1000);
      } else {
        hasVerifiedRef.current = false;
        setError('No authentication token received from server.');
        setLoading(false);
      }
    } catch (err) {
      hasVerifiedRef.current = false;
      console.error('Phone email login error:', err);
      setError('An unexpected error occurred during OTP login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileOtpLogin = (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    if (!mobile.trim() || !/^\d{10}$/.test(mobile.trim())) {
      setError('Please enter your 10-digit registered mobile number to log in via OTP.');
      return;
    }

    const peInput = document.querySelector('.pe_phone_number');
    if (peInput) {
      peInput.value = mobile.trim();
    }

    setLoading(true);
    setOtpModalOpened(true);

    const phBtn = document.getElementById('btn_ph_login');
    if (phBtn) {
      phBtn.click();
    } else {
      const client_id = process.env.NEXT_PUBLIC_PHONE_EMAIL_CLIENT_ID || '15695407177920574360';
      const curr_url = window.location.href;
      const user_phone_no_prefilled = '&user_phone_no=' + encodeURIComponent(mobile.trim());
      window.open(
        'https://auth.phone.email/log-in?client_id=' + client_id + '&auth_type=8&origin=' + encodeURIComponent(curr_url) + user_phone_no_prefilled,
        'peLoginWindow',
        'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=500,height=560,top=' + (screen.height - 600) / 2 + ',left=' + (screen.width - 500) / 2
      );
    }
  };

  // If already logged in, redirect to sanitized path
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Security (F2): redirectPath is already sanitized to start with '/'.
        // Never use window.location.href — dead code and latent open-redirect risk.
        router.push(redirectPath);
      }
    }
    checkUser();

    // Security (FD): Google OAuth approval gate.
    // signInWithOAuth redirects the browser externally and back — the approval
    // check cannot run inside handleGoogleLogin. Instead we listen for the
    // SIGNED_IN event that fires when the OAuth session is established and
    // enforce the same gate as password/magic-link login.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, approved, profile_update_message')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileData && profileData.role === 'agent' && !profileData.approved) {
          // Unapproved agent — sign them out and redirect to error page
          await supabase.auth.signOut();
          const isRejected = profileData.profile_update_message?.startsWith('REJECTED:');
          if (isRejected) {
            router.push('/login?error=rejected');
          } else {
            router.push('/login?error=pending');
          }
        } else if (profileData) {
          router.push(redirectPath);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router, redirectPath]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        const user = data.user;
        
        // Fetch approval status and role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, approved, profile_update_message')
          .eq('id', user.id)
          .single();

        if (profileError) {
          // If profile table hasn't populated yet, sign out and throw error
          await supabase.auth.signOut();
          setError('Could not retrieve profile settings. Please try again.');
          setLoading(false);
          return;
        }

        if (profile.role === 'agent' && !profile.approved) {
          await supabase.auth.signOut();
          
          const isRejected = profile.profile_update_message && profile.profile_update_message.startsWith('REJECTED:');
          if (isRejected) {
            const reason = profile.profile_update_message.replace('REJECTED:', '').trim();
            setError(`Your agent registration request has been rejected by the admin. Reason: ${reason}`);
          } else {
            setError('Your agent account is pending approval by the admin. Contact this number (+91 8171261318) for approval of your agent id.');
          }
          
          setLoading(false);
          return;
        }

        setSuccess('Logged in successfully!');
        setTimeout(() => {
          // Security (F2): Always use router.push() — redirectPath is sanitized to start with '/'
          router.push(redirectPath);
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');
    if (!email.trim()) {
      setError('Please enter your email address first to reset your password.');
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess('Password reset link sent! Check your email to create a new password.');
      }
    } catch (err) {
      setError('Failed to send password reset email. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkLogin = async () => {
    setError('');
    setSuccess('');
    if (!email.trim()) {
      setError('Please enter your email address first to receive a magic link.');
      return;
    }
    setLoading(true);
    try {
      // Security (F5): Check agent approval status before sending magic link.
      // Password login checks this, but magic link previously bypassed it entirely.
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, approved, profile_update_message')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (profileData && profileData.role === 'agent' && !profileData.approved) {
        const isRejected = profileData.profile_update_message?.startsWith('REJECTED:');
        if (isRejected) {
          const reason = profileData.profile_update_message.replace('REJECTED:', '').trim();
          setError(`Your agent registration request has been rejected. Reason: ${reason}`);
        } else {
          setError('Your agent account is pending approval. Magic link login is disabled until your account is approved.');
        }
        setLoading(false);
        return;
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}${redirectPath}`
        }
      });
      if (otpError) {
        setError(otpError.message);
      } else {
        setSuccess('Magic Link sent! Please check your email inbox to log in.');
      }
    } catch (err) {
      setError('Failed to send magic link. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    try {
      const { data, error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectPath}`
        }
      });
      if (googleError) {
        setError(googleError.message);
      }
    } catch (err) {
      setError('Failed to initiate Google sign in. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="form-card text-center" style={{ backdropFilter: 'blur(20px)' }}>
      <h2 className="form-step-title">Welcome Back</h2>
      <p className="form-step-subtitle">Log in to view your eligibility runs and check loans</p>

      {/* Agent Sign-up Warning Notice */}
      <div className="running-ticker-container">
        <div className="running-ticker">
          ⚠️ FIRST TIME AGENT PARTNERS: You must register via MANUAL SIGNUP (Email & Password) first! Do NOT register/signup using Google for your first visit. You can use Google login only after your account has been approved by the admin.
        </div>
      </div>

      {/* Login Method Switcher */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.04)',
        padding: '4px',
        borderRadius: '10px',
        margin: '20px 0 16px 0',
        border: 'var(--border-subtle)'
      }}>
        <button
          type="button"
          onClick={() => { setLoginMethod('email'); setError(''); }}
          style={{
            padding: '10px 12px',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            borderRadius: '8px',
            background: loginMethod === 'email' ? 'var(--color-primary)' : 'transparent',
            color: loginMethod === 'email' ? '#000000' : 'var(--color-text-secondary)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Email & Password
        </button>
        <button
          type="button"
          onClick={() => { setLoginMethod('otp'); setError(''); }}
          style={{
            padding: '10px 12px',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            borderRadius: '8px',
            background: loginMethod === 'otp' ? 'var(--color-primary)' : 'transparent',
            color: loginMethod === 'otp' ? '#000000' : 'var(--color-text-secondary)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
          Mobile OTP
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          margin: '16px 0',
          color: '#ef4444',
          fontSize: 'var(--text-sm)',
          textAlign: 'left',
          lineHeight: '1.5'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ marginTop: '2px' }}></span>
            <div>
              <span>{error}</span>
              {error.includes('sign up first') && (
                <div style={{ marginTop: '8px' }}>
                  <Link
                    href={`/signup?redirect=${encodeURIComponent(redirectPath)}`}
                    style={{
                      display: 'inline-block',
                      background: 'var(--color-primary)',
                      color: '#000',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    Go to Sign Up Page →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {success && <div style={{ color: 'var(--color-success)', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', margin: '16px 0' }}>✓ {success}</div>}

      {loginMethod === 'email' ? (
        <form onSubmit={handleLogin} style={{ textAlign: 'left', marginTop: '16px' }}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '48px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', margin: 0 }}
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
            <button
              type="button"
              onClick={handleMagicLinkLogin}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', margin: 0, border: 'var(--border-accent)', background: 'var(--color-bg-glass)' }}
              disabled={loading}
            >
              Magic Link
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleMobileOtpLogin} style={{ textAlign: 'left', marginTop: '16px' }}>
          <div className="input-group">
            <label className="input-label">Registered Mobile Number</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'var(--border-light)',
                borderRadius: 'var(--border-radius-md)',
                color: 'var(--color-text-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                display: 'flex',
                alignItems: 'center',
              }}>
                🇮🇳 +91
              </div>
              <input
                type="tel"
                className="input-field"
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                required
                style={{ flex: 1 }}
              />
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              We will send a one-time SMS verification code to your registered mobile number via Phone.Email.
            </p>
          </div>

          <button
            type="button"
            onClick={handleMobileOtpLogin}
            className="btn btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '13px 16px',
              fontSize: '14px',
              fontWeight: 700,
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                <span>Verifying with OTP...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <span>Log In with Mobile OTP</span>
              </>
            )}
          </button>

          {/* Hidden PhoneEmail widget container for script loading and message event listener */}
          <div style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <PhoneEmailSignInBtn onSuccess={handlePhoneEmailSuccess} prefillPhone={mobile} />
          </div>

          {otpModalOpened && !success && (
            <div
              style={{
                marginTop: '14px',
                padding: '12px 14px',
                background: 'rgba(28, 178, 57, 0.08)',
                border: '1px solid rgba(28, 178, 57, 0.25)',
                borderRadius: '10px',
                fontSize: '12.5px',
                color: 'var(--color-text-secondary)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                lineHeight: '1.4',
              }}
            >
              <span>
                📱 OTP window opened for <strong>+91 {mobile}</strong>. Enter code in popup to confirm login.
              </span>
              <button
                type="button"
                onClick={handleMobileOtpLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  textDecoration: 'underline',
                  padding: '4px 6px',
                }}
              >
                Re-open
              </button>
            </div>
          )}
        </form>
      )}

      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
        <span style={{ padding: '0 12px', fontWeight: 600 }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="btn btn-secondary"
        style={{
          width: '100%',
          justifyContent: 'center',
          margin: 0,
          background: 'rgba(255, 255, 255, 0.03)',
          border: 'var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          padding: '12px 16px',
          borderRadius: 'var(--border-radius-md)'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div style={{ marginTop: '24px', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
        Don&apos;t have an account?{' '}
        <Link href={`/signup?redirect=${encodeURIComponent(redirectPath)}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          Sign Up Free
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="main-content">
        <section className="form-page">
          <div className="form-container" style={{ maxWidth: '480px' }}>
            <Suspense fallback={
              <div className="form-card text-center" style={{ padding: '64px 32px' }}>
                <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '16px', color: 'var(--color-text-secondary)' }}>Loading Login Form...</p>
              </div>
            }>
              <LoginContent />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
