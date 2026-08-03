'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { clearUserCache, cacheUserProfile, getCachedUserTheme, getCachedUserFont, cacheUserPreferences, applyThemeCSS } from '@/lib/cookieCache';

// Security (F11): Strict schema validation for localStorage pending application payload.
// Prevents poisoned data (via XSS or manual injection) from being committed to DB.
const VALID_LOAN_TYPES = ['PL', 'BL', 'CC', 'HL', 'GL', 'AL', 'EL'];
function validatePendingApplication(obj) {
  if (!obj || typeof obj !== 'object') return false;
  if (typeof obj.clientName !== 'string' || obj.clientName.trim().length === 0 || obj.clientName.length > 120) return false;
  if (typeof obj.clientMobile !== 'string' || !/^\d{10}$/.test(obj.clientMobile.trim())) return false;
  if (typeof obj.bankName !== 'string' || obj.bankName.trim().length === 0 || obj.bankName.length > 100) return false;
  if (typeof obj.loanAmount !== 'number' || obj.loanAmount <= 0 || obj.loanAmount > 100000000) return false;
  return true;
}

const OUR_SERVICES_ITEMS = [
  { name: '🏦 Banks & Partner Lenders', href: '/banks' },
  { name: '💼 Personal Loan', href: '/services/personal-loan' },
  { name: '🏢 Business Loan', href: '/services/business-loan' },
  { name: '⚡ Instant Loan', href: '/services/instant-loan' },
  { name: '🏠 Home Loan', href: '/services/home-loan' },
  { name: '🏘️ Loan Against Property (LAP)', href: '/services/loan-against-property' },
  { name: '🎓 Education Loan', href: '/services/education-loan' },
  { name: '💳 Credit Cards', href: '/credit-cards' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [loansDropdownOpen, setLoansDropdownOpen] = useState(false);
  const [mobileLoansOpen, setMobileLoansOpen] = useState(false);
  const [emiDropdownOpen, setEmiDropdownOpen] = useState(false);
  const [mobileEmiOpen, setMobileEmiOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Client Application Redirect Confirmation Modal (Global return popup)
  const [pendingApplication, setPendingApplication] = useState(null);
  const [submittingStatus, setSubmittingStatus] = useState(false);

  useEffect(() => {
    const checkPendingApplication = () => {
      const stored = localStorage.getItem('pending_bank_application');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Security (F11): Validate schema before trusting localStorage data.
          // Prevents injected/poisoned payloads from creating fraudulent applications.
          if (!validatePendingApplication(parsed)) {
            console.warn('Security: Invalid pending_bank_application payload detected — cleared.');
            localStorage.removeItem('pending_bank_application');
            return;
          }
          setPendingApplication(parsed);
        } catch (e) {
          console.error('Error parsing pending bank application:', e);
          localStorage.removeItem('pending_bank_application');
        }
      }
    };

    checkPendingApplication();
    window.addEventListener('focus', checkPendingApplication);
    return () => {
      window.removeEventListener('focus', checkPendingApplication);
    };
  }, []);

  const handleConfirmApplied = async () => {
    if (!pendingApplication || !user) return;
    setSubmittingStatus(true);
    try {
      // Security (F4): Use crypto.randomUUID() — cryptographically secure, collision-resistant.
      const uniqueAppId = `H2H-APP-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`;
      const { error } = await supabase.from('applications').insert({
        agent_id: user.id,
        client_name: pendingApplication.clientName,
        client_mobile: pendingApplication.clientMobile,
        bank_name: pendingApplication.bankName,
        loan_amount: Number(pendingApplication.loanAmount),
        loan_type: pendingApplication.loanType,
        commission_rate: 2.00,
        commission_amount: Number(pendingApplication.loanAmount) * 0.02,
        status: 'applied',
        application_id: uniqueAppId
      });

      if (error) {
        alert('Failed to save lead: ' + error.message);
      } else {
        alert(`Lead generated successfully for ${pendingApplication.clientName}! Application ID: ${uniqueAppId}`);
        localStorage.removeItem('pending_bank_application');
        setPendingApplication(null);
        router.refresh();
      }
    } catch (err) {
      console.error('Error confirming applied:', err);
    } finally {
      setSubmittingStatus(false);
    }
  };

  const handleConfirmNotApplied = () => {
    localStorage.removeItem('pending_bank_application');
    setPendingApplication(null);
  };
  
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [userFont, setUserFont] = useState('Jakarta');

  useEffect(() => {
    const savedTheme = getCachedUserTheme();
    const savedFont = getCachedUserFont();
    setMounted(true);
    setUserFont(savedFont);
    setTheme(savedTheme);
    applyThemeCSS(savedTheme);
    changeFont(savedFont);
  }, [pathname]);

  useEffect(() => {
    const handleSync = () => {
      const savedTheme = getCachedUserTheme();
      const savedFont = getCachedUserFont();
      setUserFont(savedFont);
      setTheme(savedTheme);
      applyThemeCSS(savedTheme);
      changeFont(savedFont);
    };
    window.addEventListener('h2h-theme-change', handleSync);
    return () => window.removeEventListener('h2h-theme-change', handleSync);
  }, []);

  const changeFont = (newFont) => {
    setUserFont(newFont);
    const currentTheme = getCachedUserTheme();
    cacheUserPreferences(currentTheme, newFont);

    let fontBody = '';
    let fontHeading = '';
    if (newFont === 'Inter') { fontBody = 'Inter, sans-serif'; fontHeading = 'Inter, sans-serif'; }
    else if (newFont === 'Poppins') { fontBody = 'Poppins, sans-serif'; fontHeading = 'Poppins, sans-serif'; }
    else if (newFont === 'Outfit') { fontBody = 'Outfit, sans-serif'; fontHeading = 'Outfit, sans-serif'; }
    else if (newFont === 'Lora') { fontBody = 'Lora, serif'; fontHeading = 'Lora, serif'; }
    else if (newFont === 'Playfair') { fontBody = '"Playfair Display", serif'; fontHeading = '"Playfair Display", serif'; }
    else if (newFont === 'JetBrains') { fontBody = '"JetBrains Mono", monospace'; fontHeading = '"JetBrains Mono", monospace'; }
    else if (newFont === 'Roboto') { fontBody = 'Roboto, sans-serif'; fontHeading = 'Roboto, sans-serif'; }
    else if (newFont === 'Raleway') { fontBody = 'Raleway, sans-serif'; fontHeading = 'Raleway, sans-serif'; }
    else if (newFont === 'Montserrat') { fontBody = 'Montserrat, sans-serif'; fontHeading = 'Montserrat, sans-serif'; }
    else if (newFont === 'Merriweather') { fontBody = 'Merriweather, serif'; fontHeading = 'Merriweather, serif'; }
    else if (newFont === 'SpaceMono') { fontBody = '"Space Mono", monospace'; fontHeading = '"Space Mono", monospace'; }
    else { fontBody = 'var(--font-inter), "Plus Jakarta Sans", sans-serif'; fontHeading = 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif'; }
    
    if (fontBody) {
      document.documentElement.style.setProperty('--font-body', fontBody);
      document.documentElement.style.setProperty('--font-heading', fontHeading);
    }
  };

  const cycleFont = () => {
    const fontOrder = ['Jakarta', 'Inter', 'Poppins', 'Outfit', 'Roboto', 'Raleway', 'Montserrat', 'Lora', 'Playfair', 'Merriweather', 'JetBrains', 'SpaceMono'];
    const currentIndex = fontOrder.indexOf(userFont);
    const nextIndex = (currentIndex + 1) % fontOrder.length;
    const nextFont = fontOrder[nextIndex];
    changeFont(nextFont);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('h2h-theme-change'));
  };

  const toggleTheme = () => {
    const themeOrder = ['light', 'dark', 'navy', 'cyber', 'rose', 'slate', 'emerald-gold', 'sunset'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex];
    setTheme(nextTheme);
    cacheUserPreferences(nextTheme, userFont);
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('h2h-theme-change'));
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const getInitials = (profile, userObj) => {
    if (profile?.full_name) {
      const parts = profile.full_name.trim().split(/\s+/);
      if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    const email = profile?.email || userObj?.email;
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const notifDropdown = document.getElementById('notif-dropdown-container');
      const profileDropdown = document.getElementById('profile-dropdown-container');
      
      if (notifDropdown && !notifDropdown.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileDropdown && !profileDropdown.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleSessionCheck = async (session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, role, approved, full_name, email, phone, agent_code, avatar')
          .eq('id', session.user.id)
          .single();

        if (profile && profile.role === 'agent' && !profile.approved) {
          await supabase.auth.signOut();
          clearUserCache();
          setUser(null);
          setUserRole(null);
          setUserProfile(null);
          router.push('/login?error=pending');
          return;
        }
        if (profile) cacheUserProfile(profile);
        setUserRole(profile?.role || null);
        setUserProfile(profile || {
          full_name: session.user.user_metadata?.full_name || 'User',
          email: session.user.email,
          phone: session.user.user_metadata?.phone || '',
          avatar: session.user.user_metadata?.avatar || null,
          role: profile?.role || 'user'
        });
      } else {
        clearUserCache();
        setUser(null);
        setUserRole(null);
        setUserProfile(null);
      }
      setUser(session?.user || null);
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSessionCheck(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.push('/reset-password');
      } else {
        handleSessionCheck(session);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!user || userRole === null) {
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
      }
      return;
    }

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('id, agent_id, title, message, read, created_at, activity_type, reference_id')
          .order('created_at', { ascending: false })
          .limit(20);
        if (!error && data) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.read).length);
        }
      } catch (e) {
        console.warn('Notifications table not configured yet:', e.message);
      }
    };

    fetchNotifications();

    const isAdmin = userRole === 'admin';

    const channel = supabase
      .channel('realtime:notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        ...(isAdmin ? {} : { filter: `agent_id=eq.${user.id}` })
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev].slice(0, 20));
        setUnreadCount(c => c + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userRole]);

  const markAllRead = async () => {
    if (!user || unreadCount === 0) return;
    try {
      const isAdmin = userRole === 'admin';
      const query = supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);
      
      if (!isAdmin) {
        query.eq('agent_id', user.id);
      }

      const { error } = await query;
      if (!error) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (e) {
      console.warn('Failed to mark notifications read:', e);
    }
  };

  const clearReadNotifications = async () => {
    if (!user) return;
    try {
      const isAdmin = userRole === 'admin';
      const query = supabase
        .from('notifications')
        .delete()
        .eq('read', true);
      
      if (!isAdmin) {
        query.eq('agent_id', user.id);
      }

      const { error } = await query;
      if (!error) {
        setNotifications(prev => prev.filter(n => !n.read));
      }
    } catch (e) {
      console.warn('Failed to clear read notifications:', e);
    }
  };

  const handleNotificationClick = async (n) => {
    // 1. Mark as read if not already read
    if (!n.read) {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', n.id);
        if (!error) {
          setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
          setUnreadCount(c => Math.max(0, c - 1));
        }
      } catch (e) {
        console.warn('Failed to mark notification read on click:', e);
      }
    }

    // 2. Determine redirect URL
    const isAdmin = userRole === 'admin';
    let targetUrl = '/dashboard';
    
    if (isAdmin) {
      const type = n.activity_type;
      const refId = n.reference_id;
      if (type === 'registration') {
        targetUrl = `/admin?tab=pending_agents&agentId=${refId}`;
      } else if (type === 'application') {
        targetUrl = `/admin?tab=agent_applications&appId=${refId}`;
      } else if (type === 'payout') {
        targetUrl = `/admin?tab=payouts`;
      } else if (type === 'agreement') {
        targetUrl = `/admin?tab=agreements&agentId=${refId}`;
      } else if (type === 'resign') {
        targetUrl = `/admin?tab=pending_agents&agentId=${refId}`;
      } else if (type === 'profile_complete') {
        targetUrl = `/admin?tab=active_agents&agentId=${refId}`;
      } else {
        targetUrl = `/admin`;
      }
    }

    // Close notifications panel
    setShowNotifications(false);

    // 3. Navigate
    if (typeof window !== 'undefined') {
      router.push(targetUrl);
      if (window.location.pathname === '/admin') {
        // Dispatch custom event to notify admin page of URL change
        const event = new CustomEvent('admin-query-change');
        window.dispatchEvent(event);
      }
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Logout network request failed, proceeding to clear session locally:', err);
    }
    clearUserCache();
    closeMenu();
    router.push('/');
    router.refresh();
  };

  const isLinkActive = (path) => pathname === path;



  return (
    <header className="header">
      <div className="header-inner">
        {/* Extreme Left: Profile Tab Button */}
        <div className="header-left">
          {mounted && user && (
            <div id="profile-dropdown-container" style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="header-profile-badge-btn"
                title={userProfile?.full_name || 'User Profile'}
                aria-label="Toggle profile menu"
              >
                <div className="header-profile-avatar-circle">
                  {userProfile?.avatar ? (
                    <img src={userProfile.avatar} alt="Avatar" />
                  ) : (
                    getInitials(userProfile, user)
                  )}
                </div>
                <span className="header-profile-name-span">
                  {userProfile?.full_name || 'User'}
                </span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7, transition: 'transform 0.2s', transform: profileDropdownOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </button>

              {profileDropdownOpen && (
                <div className="header-profile-dropdown" style={{ left: 0, right: 'auto' }}>
                  <div 
                    className="profile-dropdown-header" 
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      router.push('/dashboard?tab=profile');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="profile-dropdown-avatar">
                      {userProfile?.avatar ? (
                        <img src={userProfile.avatar} alt="Avatar" />
                      ) : (
                        getInitials(userProfile, user)
                      )}
                    </div>
                    <div className="profile-dropdown-info">
                      <div className="profile-dropdown-name">{userProfile?.full_name || 'User'}</div>
                      <div className="profile-dropdown-phone">{userProfile?.phone || user.user_metadata?.phone || 'No Mobile'}</div>
                      <div className="profile-dropdown-role-badge">
                        {userRole === 'agent' ? 'Agent' : userRole === 'admin' ? 'Admin' : 'Client'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="profile-dropdown-divider" />
                  
                  <div className="profile-dropdown-links">
                    <Link 
                      href="/dashboard" 
                      className="profile-dropdown-item-link"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="9" />
                        <rect x="14" y="3" width="7" height="5" />
                        <rect x="14" y="12" width="7" height="9" />
                        <rect x="3" y="16" width="7" height="5" />
                      </svg>
                      Dashboard
                    </Link>
                    
                    {userRole === 'admin' && (
                      <Link 
                        href="/admin" 
                        className="profile-dropdown-item-link admin-link"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                  </div>
                  
                  <div className="profile-dropdown-divider" />
                  
                  <button 
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }} 
                    className="profile-dropdown-logout-btn"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Logo with HandToHand Loans & tagline */}
        <div className="header-center">
          <Link href="/" className="logo" onClick={closeMenu} style={{ textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="HandToHand Loans Logo"
              style={{ display: 'block', height: '34px', width: 'auto', flexShrink: 0, objectFit: 'contain' }}
            />
            <div className="logo-text-group">
              <span className="logo-text">HandToHand Loans</span>
              <span className="logo-tagline">Smart Lending, Fast Approval</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            {/* 1. Home */}
            <li>
              <Link href="/" className={`btn btn-primary btn-sm header-btn-primary ${isLinkActive('/') ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            
            {/* 2. Check Eligibility (Dark Button) */}
            <li>
              <Link href="/check" className={`btn btn-sm header-btn-dark ${isLinkActive('/check') ? 'active' : ''}`}>
                Check Eligibility
              </Link>
            </li>

            {/* 3. Loans Dropdown */}
            <li 
              className="dropdown-container"
              onMouseEnter={() => setLoansDropdownOpen(true)}
              onMouseLeave={() => setLoansDropdownOpen(false)}
              style={{ position: 'relative', display: 'inline-block' }}
            >
              <button 
                className={`btn btn-primary btn-sm header-btn-primary dropdown-toggle ${loansDropdownOpen ? 'active' : ''}`}
                style={{ cursor: 'pointer', gap: '4px' }}
                onClick={() => setLoansDropdownOpen(!loansDropdownOpen)}
              >
                Loans
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: loansDropdownOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </button>
              {loansDropdownOpen && (
                <ul className="dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: 'var(--color-bg-glass-heavy)',
                  backdropFilter: 'blur(20px)',
                  border: 'var(--border-light)',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-md)',
                  padding: '8px 0',
                  margin: '4px 0 0 0',
                  listStyle: 'none',
                  minWidth: '180px',
                  zIndex: 99999
                }}>
                  <li>
                    <Link 
                      href="/banks/instant" 
                      className="dropdown-item" 
                      onClick={() => setLoansDropdownOpen(false)}
                      style={{ display: 'block', padding: '8px 16px', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: '13px', transition: 'background 0.2s' }}
                    >
                      ⚡ Instant Loan
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/banks/business" 
                      className="dropdown-item" 
                      onClick={() => setLoansDropdownOpen(false)}
                      style={{ display: 'block', padding: '8px 16px', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: '13px', transition: 'background 0.2s' }}
                    >
                      🏢 Business Loan
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/banks/salary" 
                      className="dropdown-item" 
                      onClick={() => setLoansDropdownOpen(false)}
                      style={{ display: 'block', padding: '8px 16px', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: '13px', transition: 'background 0.2s' }}
                    >
                      💼 Salary Loan
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* 4. Our Services Dropdown */}
            <li 
              className="dropdown-container"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
              style={{ position: 'relative', display: 'inline-block' }}
            >
              <button 
                className={`btn btn-primary btn-sm header-btn-primary dropdown-toggle ${servicesDropdownOpen ? 'active' : ''}`}
                style={{ 
                  cursor: 'pointer', 
                  gap: '4px'
                }}
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              >
                Our Services
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: servicesDropdownOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </button>
              {servicesDropdownOpen && (
                <ul className="dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: 'var(--color-bg-glass-heavy)',
                  backdropFilter: 'blur(20px)',
                  border: 'var(--border-light)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '10px 0',
                  margin: '4px 0 0 0',
                  listStyle: 'none',
                  minWidth: '280px',
                  maxHeight: '440px',
                  overflowY: 'auto',
                  zIndex: 99999
                }}>
                  {OUR_SERVICES_ITEMS.map((service, idx) => (
                    <li key={idx}>
                      <Link 
                        href={service.href} 
                        className="dropdown-item" 
                        onClick={() => setServicesDropdownOpen(false)}
                        style={{
                          display: 'block',
                          padding: '8px 16px',
                          color: 'var(--color-text-primary)',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: '600',
                          transition: 'background 0.2s'
                        }}
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                  <li style={{ borderTop: '1px solid var(--border-default)', marginTop: '4px', paddingTop: '4px' }}>
                    <Link 
                      href="/services" 
                      className="dropdown-item" 
                      onClick={() => setServicesDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '8px 16px',
                        color: 'var(--color-primary)',
                        fontWeight: '800',
                        textDecoration: 'none',
                        fontSize: '13px',
                        transition: 'background 0.2s'
                      }}
                    >
                      See All 15 Services ➔
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* 5. EMI Calculator Dropdown */}
            <li 
              style={{ position: 'relative' }}
              onMouseEnter={() => setEmiDropdownOpen(true)}
              onMouseLeave={() => setEmiDropdownOpen(false)}
            >
              <button
                className={`btn btn-primary btn-sm header-btn-primary ${isLinkActive('/emi-calculator') || isLinkActive('/personal-loan-emi-calculator') || isLinkActive('/home-loan-emi-calculator') || isLinkActive('/business-loan-emi-calculator') ? 'active' : ''}`}
                style={{
                  gap: '6px',
                  cursor: 'pointer'
                }}
                onClick={() => setEmiDropdownOpen(!emiDropdownOpen)}
              >
                EMI Calculator
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: emiDropdownOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </button>
              {emiDropdownOpen && (
                <ul className="dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: 'var(--color-bg-glass-heavy)',
                  backdropFilter: 'blur(20px)',
                  border: 'var(--border-light)',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-md)',
                  padding: '8px 0',
                  margin: '4px 0 0 0',
                  listStyle: 'none',
                  minWidth: '220px',
                  zIndex: 99999
                }}>
                  <li>
                    <Link 
                      href="/emi-calculator" 
                      className="dropdown-item" 
                      onClick={() => setEmiDropdownOpen(false)}
                      style={{ display: 'block', padding: '8px 16px', color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'none', fontSize: '13px', transition: 'background 0.2s' }}
                    >
                      All Types EMI Calculator
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/personal-loan-emi-calculator" 
                      className="dropdown-item" 
                      onClick={() => setEmiDropdownOpen(false)}
                      style={{ display: 'block', padding: '8px 16px', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: '13px', transition: 'background 0.2s' }}
                    >
                      Personal Loan EMI
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/home-loan-emi-calculator" 
                      className="dropdown-item" 
                      onClick={() => setEmiDropdownOpen(false)}
                      style={{ display: 'block', padding: '8px 16px', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: '13px', transition: 'background 0.2s' }}
                    >
                      Home Loan EMI
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/business-loan-emi-calculator" 
                      className="dropdown-item" 
                      onClick={() => setEmiDropdownOpen(false)}
                      style={{ display: 'block', padding: '8px 16px', color: 'var(--color-text-primary)', textDecoration: 'none', fontSize: '13px', transition: 'background 0.2s' }}
                    >
                      Business Loan EMI
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/calculators" 
                      className="dropdown-item" 
                      onClick={() => setEmiDropdownOpen(false)}
                      style={{ display: 'block', padding: '8px 16px', color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none', fontSize: '13px', transition: 'background 0.2s' }}
                    >
                      More Calculators ➔
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* 6. CIBIL */}
            <li>
              <Link
                href="/cibil"
                className={`btn btn-primary btn-sm header-btn-primary ${isLinkActive('/cibil') ? 'active' : ''}`}
                title="Free CIBIL report check in collaboration with PNB"
              >
                CIBIL
              </Link>
            </li>

            {/* 7. Blogs */}
            <li>
              <Link
                href="/blog"
                className={`btn btn-primary btn-sm header-btn-primary ${isLinkActive('/blog') ? 'active' : ''}`}
              >
                Blogs
              </Link>
            </li>

            {/* 8. Verify Agent */}
            <li>
              <Link
                href="/verify-agreement"
                className={`btn btn-primary btn-sm header-btn-primary ${isLinkActive('/verify-agreement') ? 'active' : ''}`}
              >
                Verify Agent
              </Link>
            </li>

            {/* Become a Partner Button */}
            <li>
              <Link
                href="/become-a-partner"
                className={`btn btn-primary btn-sm header-btn-primary ${isLinkActive('/become-a-partner') ? 'active' : ''}`}
                style={{
                  background: 'var(--color-primary-light)',
                  border: '1px solid var(--color-primary)',
                  color: 'var(--color-primary)',
                  fontWeight: '700'
                }}
              >
                Become a Partner
              </Link>
            </li>

            {/* Sign In Button (only when logged out) */}
            {!user && (
              <li>
                <Link href="/login" className="btn btn-primary btn-sm header-btn-primary">
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Header Actions (Notifications & Hamburger) */}
        <div className="header-actions">

          {mounted && user && (
            <div id="notif-dropdown-container" style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="theme-toggle-btn"
                style={{ margin: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Notifications"
              >
                {/* Bell Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: 800,
                    borderRadius: '50%',
                    width: '14px',
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid var(--color-bg-secondary)',
                    lineHeight: 1
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="header-notification-dropdown">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-default)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Notifications</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
                          Mark all read
                        </button>
                      )}
                      {notifications.some(n => n.read) && (
                        <button onClick={clearReadNotifications} style={{ background: 'none', border: 'none', color: 'var(--color-error)', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
                          Clear Read
                        </button>
                      )}
                    </div>
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px 0', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', textAlign: 'center' }}>
                      No new notifications.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`header-notification-item ${n.read ? 'read' : 'unread'}`}
                          style={{
                            padding: '10px',
                            borderRadius: '8px',
                            borderLeft: n.read ? '3px solid transparent' : '3px solid var(--color-primary)',
                            fontSize: 'var(--text-xs)',
                            lineHeight: 1.4,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{n.title}</span>
                            {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }}></span>}
                          </div>
                          <div style={{ color: 'var(--color-text-secondary)' }}>{n.message}</div>
                          <div style={{ fontSize: '9px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
                            {new Date(n.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}



          <button
            className={`hamburger ${mounted && menuOpen ? 'active' : ''}`}
            onClick={mounted ? toggleMenu : undefined}
            aria-label="Toggle menu"
            style={{ flexShrink: 0, marginLeft: '2px' }}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {mounted && menuOpen && (
        <div className="mobile-menu-backdrop" onClick={closeMenu} />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mounted && menuOpen ? 'open' : ''}`}>
        {user && (
          <Link href="/dashboard?tab=profile" onClick={closeMenu} style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
            <div className="mobile-profile-card" style={{ cursor: 'pointer' }}>
              <div className="mobile-profile-avatar">
                {userProfile?.avatar ? (
                  <img src={userProfile.avatar} alt="Avatar" />
                ) : (
                  getInitials(userProfile, user)
                )}
              </div>
              <div className="mobile-profile-details">
                <div className="mobile-profile-name">{userProfile?.full_name || 'User'}</div>
                <div className="mobile-profile-phone" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {userProfile?.phone || user.user_metadata?.phone || 'No Mobile'}
                </div>
                <span className="mobile-profile-role-badge">
                   {userRole === 'agent' ? 'Agent' : userRole === 'admin' ? 'Admin' : 'Client'}
                </span>
              </div>
            </div>
          </Link>
        )}
        {/* 1. Home */}
        <Link href="/" className={`btn btn-primary btn-sm header-btn-primary nav-link ${isLinkActive('/') ? 'active' : ''}`} onClick={closeMenu}>
          Home
        </Link>
        
        {/* 2. Check Eligibility (Dark Button) */}
        <Link 
          href="/check" 
          className={`btn btn-sm header-btn-dark nav-link ${isLinkActive('/check') ? 'active' : ''}`} 
          style={{ 
            borderRadius: '8px', 
            fontWeight: 700, 
            textAlign: 'center',
            justifyContent: 'center',
            width: '100%'
          }} 
          onClick={closeMenu}
        >
          Check Eligibility
        </Link>

        {/* 3. Mobile Loans Accordion */}
        <div style={{ padding: '2px 0', width: '100%' }}>
          <button
            onClick={() => setMobileLoansOpen(!mobileLoansOpen)}
            className={`btn btn-primary btn-sm header-btn-primary nav-link ${mobileLoansOpen ? 'active' : ''}`}
            style={{ justifyContent: 'space-between', cursor: 'pointer', width: '100%' }}
          >
            <span>Loans</span>
            <svg width="12" height="8" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: mobileLoansOpen ? 'rotate(180deg)' : 'none' }}>
              <path d="M1 1l4 4 4-4" />
            </svg>
          </button>
          
          {mobileLoansOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', background: 'none', padding: '6px 0 6px 10px', gap: '6px' }}>
              <Link href="/banks/instant" className="mobile-dropdown-item btn btn-sm" onClick={closeMenu}>
                ⚡ Instant Loan
              </Link>
              <Link href="/banks/business" className="mobile-dropdown-item btn btn-sm" onClick={closeMenu}>
                🏢 Business Loan
              </Link>
              <Link href="/banks/salary" className="mobile-dropdown-item btn btn-sm" onClick={closeMenu}>
                💼 Salary Loan
              </Link>
            </div>
          )}
        </div>

        {/* 4. Our Services Accordion */}
        <div style={{ padding: '2px 0', width: '100%' }}>
          <button
            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            className={`btn btn-primary btn-sm header-btn-primary nav-link ${mobileServicesOpen ? 'active' : ''}`}
            style={{
              justifyContent: 'space-between',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            <span>Our Services</span>
            <svg width="12" height="8" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: mobileServicesOpen ? 'rotate(180deg)' : 'none' }}>
              <path d="M1 1l4 4 4-4" />
            </svg>
          </button>
          
          {mobileServicesOpen && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              background: 'none',
              padding: '6px 0 6px 10px',
              gap: '6px'
            }}>
              {OUR_SERVICES_ITEMS.map((service, idx) => (
                <Link key={idx} href={service.href} className="mobile-dropdown-item btn btn-sm" onClick={closeMenu}>
                  {service.name}
                </Link>
              ))}
              <Link
                href="/services"
                className="mobile-dropdown-item btn btn-sm"
                onClick={closeMenu}
                style={{ color: 'var(--color-primary)', fontWeight: 800, borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '4px', paddingTop: '6px' }}
              >
                See All 15 Services ➔
              </Link>
            </div>
          )}
        </div>

        {/* 5. Mobile EMI Calculator Dropdown */}
        <div style={{ width: '100%', padding: '2px 0' }}>
          <button
            onClick={() => setMobileEmiOpen(!mobileEmiOpen)}
            className={`btn btn-primary btn-sm header-btn-primary nav-link ${mobileEmiOpen ? 'active' : ''}`}
            style={{
              justifyContent: 'space-between',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            <span>EMI Calculator</span>
            <svg width="12" height="8" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: mobileEmiOpen ? 'rotate(180deg)' : 'none' }}>
              <path d="M1 1l4 4 4-4" />
            </svg>
          </button>
          
          {mobileEmiOpen && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              background: 'none',
              padding: '6px 0 6px 10px',
              gap: '6px'
            }}>
              <Link href="/emi-calculator" className="mobile-dropdown-item btn btn-sm" onClick={closeMenu} style={{ fontWeight: 700 }}>
                All Types EMI Calculator
              </Link>
              <Link href="/personal-loan-emi-calculator" className="mobile-dropdown-item btn btn-sm" onClick={closeMenu}>
                Personal Loan EMI
              </Link>
              <Link href="/home-loan-emi-calculator" className="mobile-dropdown-item btn btn-sm" onClick={closeMenu}>
                Home Loan EMI
              </Link>
              <Link href="/business-loan-emi-calculator" className="mobile-dropdown-item btn btn-sm" onClick={closeMenu}>
                Business Loan EMI
              </Link>
              <Link href="/calculators" className="mobile-dropdown-item btn btn-sm" onClick={closeMenu} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                More Calculators ➔
              </Link>
            </div>
          )}
        </div>

        {/* 6. CIBIL */}
        <Link
          href="/cibil"
          className={`btn btn-primary btn-sm header-btn-primary nav-link ${isLinkActive('/cibil') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          CIBIL
        </Link>

        {/* 7. Blogs */}
        <Link
          href="/blog"
          className={`btn btn-primary btn-sm header-btn-primary nav-link ${isLinkActive('/blog') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Blogs
        </Link>

        {/* 8. Verify Agent */}
        <Link
          href="/verify-agreement"
          className={`btn btn-primary btn-sm header-btn-primary nav-link ${isLinkActive('/verify-agreement') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Verify Agent
        </Link>

        {/* 9. Become a Partner */}
        <Link
          href="/become-a-partner"
          className={`btn btn-primary btn-sm header-btn-primary nav-link ${isLinkActive('/become-a-partner') ? 'active' : ''}`}
          style={{
            background: 'var(--color-primary-light)',
            border: '1px solid var(--color-primary)',
            color: 'var(--color-primary)',
            fontWeight: 700
          }}
          onClick={closeMenu}
        >
          Become a Partner
        </Link>

        {/* 10. Sign In Button (only when logged out) */}
        {!user && (
          <Link href="/login" className="btn btn-primary btn-sm header-btn-primary nav-link nav-cta" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }} onClick={closeMenu}>
            Sign In
          </Link>
        )}


      </div>

      {/* Global Applied/Not Applied Return Popup */}
      {pendingApplication && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px'
        }}>
          <div className="form-card modal-drawer" style={{
            maxWidth: 'min(440px, 96vw)',
            width: '100%',
            margin: '0 auto',
            display: 'grid',
            gap: '20px',
            border: 'var(--border-accent)',
            background: 'var(--color-bg-tertiary)',
            backdropFilter: 'blur(20px)',
            padding: '28px 24px',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', margin: '0 auto', color: 'var(--color-primary)', fontWeight: 'bold' }}>✓</div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
                Update Lead Status
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                You were redirected to apply for <strong>{pendingApplication.clientName}</strong> at <strong>{pendingApplication.bankName}</strong>. 
                Did you complete the application?
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={handleConfirmNotApplied}
                className="btn btn-secondary"
                style={{ justifyContent: 'center', padding: '12px 16px', borderRadius: '10px' }}
                disabled={submittingStatus}
              >
                Not Applied
              </button>
              <button
                onClick={handleConfirmApplied}
                className="btn btn-primary"
                style={{ justifyContent: 'center', padding: '12px 16px', borderRadius: '10px', background: 'var(--gradient-primary)', border: 'none' }}
                disabled={submittingStatus}
              >
                {submittingStatus ? 'Saving Lead...' : 'Applied'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
