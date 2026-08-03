'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { compressFile } from '@/lib/compressFile';

export default function AgentSetupProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingField, setUploadingField] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    dob: '',
    fathers_name: '',
    marital_status: 'Single',
    current_address: '',
    permanent_address: '',
    pincode: '',
    city: '',
    state: '',
    id_type: 'Aadhaar Card',
    id_number: '',
    id_file: '',
    id_file_back: '',
    id_type_2: 'PAN Card',
    id_number_2: '',
    id_file_2: '',
    id_file_2_back: '',
    selfie: '',
    cancelled_cheque: '',
    bank_holder_name: '',
    bank_name: '',
    bank_account_no: '',
    bank_ifsc: ''
  });

  useEffect(() => {
    const initOnboarding = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login?redirect=/agent/setup-profile');
          return;
        }

        setUser(session.user);

        // Fetch agent profile
        const { data: prof, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error || !prof) {
          setErrorMsg('Failed to load profile details.');
          return;
        }

        // If profile is already completed, redirect directly to dashboard
        if (prof.profile_completed) {
          router.push('/dashboard');
          return;
        }

        setProfile(prof);
        setFormData(prev => ({
          ...prev,
          full_name: prof.full_name || session.user.user_metadata?.full_name || '',
          phone: prof.phone || session.user.phone || '',
          email: prof.email || session.user.email || '',
          dob: prof.dob || '',
          fathers_name: prof.fathers_name || '',
          marital_status: prof.marital_status || 'Single',
          current_address: prof.current_address || '',
          permanent_address: prof.permanent_address || '',
          pincode: prof.pincode || '',
          city: prof.city || '',
          state: prof.state || '',
          id_type: prof.id_type || 'Aadhaar Card',
          id_number: prof.id_number || '',
          id_file: prof.id_file || '',
          id_file_back: prof.id_file_back || '',
          id_type_2: prof.id_type_2 || 'PAN Card',
          id_number_2: prof.id_number_2 || '',
          id_file_2: prof.id_file_2 || '',
          id_file_2_back: prof.id_file_2_back || '',
          selfie: prof.selfie || '',
          cancelled_cheque: prof.cancelled_cheque || '',
          bank_holder_name: prof.bank_holder_name || prof.full_name || '',
          bank_name: prof.bank_name || '',
          bank_account_no: prof.bank_account_no || '',
          bank_ifsc: prof.bank_ifsc || ''
        }));
      } catch (err) {
        console.error('Onboarding init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initOnboarding();
  }, [router]);

  // Private storage upload helper
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploadingField(fieldName);
    setErrorMsg('');

    try {
      const compressedFile = await compressFile(file);
      const ext = compressedFile.name.split('.').pop() || (compressedFile.type === 'application/pdf' ? 'pdf' : 'jpg');
      const filePath = `${user.id}/${fieldName}_${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('agent-documents')
        .upload(filePath, compressedFile, { cacheControl: '3600', upsert: true });

      if (uploadErr) {
        throw new Error(`Failed to upload ${fieldName}: ${uploadErr.message}`);
      }

      setFormData(prev => ({ ...prev, [fieldName]: filePath }));
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setUploadingField('');
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Step 1 Validations
    if (currentStep === 1) {
      if (!formData.full_name.trim() || !formData.phone.trim() || !formData.dob || !formData.fathers_name.trim()) {
        setErrorMsg('Please fill in all mandatory personal details.');
        return;
      }
      if (!formData.current_address.trim() || !formData.pincode.trim() || !formData.city.trim() || !formData.state.trim()) {
        setErrorMsg('Please fill in complete address details.');
        return;
      }
    }

    // Step 2 Validations
    if (currentStep === 2) {
      if (!formData.id_number.trim() || !formData.id_file) {
        setErrorMsg('Please provide your Primary Identity Proof Number and document file.');
        return;
      }
      if (!formData.selfie) {
        setErrorMsg('Please upload a clear live selfie.');
        return;
      }
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.bank_holder_name.trim() || !formData.bank_name.trim() || !formData.bank_account_no.trim() || !formData.bank_ifsc.trim()) {
      setErrorMsg('Please fill in complete bank account details.');
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        dob: formData.dob,
        fathers_name: formData.fathers_name.trim(),
        marital_status: formData.marital_status,
        current_address: formData.current_address.trim(),
        permanent_address: formData.permanent_address.trim() || formData.current_address.trim(),
        pincode: formData.pincode.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        id_type: formData.id_type,
        id_number: formData.id_number.trim(),
        id_file: formData.id_file,
        id_file_back: formData.id_file_back,
        id_type_2: formData.id_type_2,
        id_number_2: formData.id_number_2.trim(),
        id_file_2: formData.id_file_2,
        id_file_2_back: formData.id_file_2_back,
        selfie: formData.selfie,
        cancelled_cheque: formData.cancelled_cheque,
        bank_holder_name: formData.bank_holder_name.trim(),
        bank_name: formData.bank_name.trim(),
        bank_account_no: formData.bank_account_no.trim(),
        bank_ifsc: formData.bank_ifsc.trim(),
        profile_completed: true,
        profile_locked: true
      };

      let { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      // Fallback if profile_completed column has not been added to Supabase DB yet
      if (error && error.message?.includes('profile_completed')) {
        delete updateData.profile_completed;
        const { error: retryErr } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);
        if (retryErr) throw retryErr;
      } else if (error) {
        throw error;
      }

      router.push('/dashboard?setup=complete');
    } catch (err) {
      console.error('Registration setup failed:', err);
      setErrorMsg('Failed to save profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-main)' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '85vh', padding: '40px 16px', background: 'var(--color-bg-main)', color: 'var(--color-text-primary)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Header Banner */}
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-primary-alpha)',
            borderRadius: '16px',
            padding: '24px 32px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '24px' }}>📋</span>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>Agent Account Setup</h2>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
              Welcome to HandToHand Loans! Please complete your registration & KYC profile to unlock your Agent Dashboard and begin processing inquiries.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px', textAlign: 'center' }}>
            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: currentStep >= 1 ? 'var(--color-primary-alpha)' : 'rgba(255,255,255,0.03)',
              border: currentStep === 1 ? '1px solid var(--color-primary)' : 'var(--border-light)',
              color: currentStep >= 1 ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
              fontWeight: currentStep === 1 ? 700 : 500,
              fontSize: 'var(--text-xs)'
            }}>
              1. Personal Details
            </div>

            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: currentStep >= 2 ? 'var(--color-primary-alpha)' : 'rgba(255,255,255,0.03)',
              border: currentStep === 2 ? '1px solid var(--color-primary)' : 'var(--border-light)',
              color: currentStep >= 2 ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
              fontWeight: currentStep === 2 ? 700 : 500,
              fontSize: 'var(--text-xs)'
            }}>
              2. KYC & Documents
            </div>

            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: currentStep >= 3 ? 'var(--color-primary-alpha)' : 'rgba(255,255,255,0.03)',
              border: currentStep === 3 ? '1px solid var(--color-primary)' : 'var(--border-light)',
              color: currentStep >= 3 ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
              fontWeight: currentStep === 3 ? 700 : 500,
              fontSize: 'var(--text-xs)'
            }}>
              3. Bank Details
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-error)',
              color: 'var(--color-error)',
              fontSize: 'var(--text-xs)',
              marginBottom: '24px'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Form Card */}
          <div className="form-card" style={{ padding: '32px', borderRadius: '16px', background: 'var(--color-bg-card)', border: 'var(--border-light)' }}>
            
            {/* STEP 1: Personal Details */}
            {currentStep === 1 && (
              <form onSubmit={handleNextStep} style={{ display: 'grid', gap: '20px' }}>
                <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: '0 0 8px 0', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                  Step 1: Personal & Location Details
                </h4>

                <div className="responsive-grid-2" style={{ gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">Full Name <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Phone Number <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="tel"
                      className="input-field"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="responsive-grid-2" style={{ gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">Date of Birth <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="date"
                      className="input-field"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Father&apos;s Name <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.fathers_name}
                      onChange={(e) => setFormData({ ...formData, fathers_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Marital Status</label>
                  <select
                    className="input-field"
                    value={formData.marital_status}
                    onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Current Residential Address <span style={{ color: 'red' }}>*</span></label>
                  <textarea
                    className="input-field"
                    rows={2}
                    value={formData.current_address}
                    onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                    required
                  />
                </div>

                <div className="responsive-grid-3" style={{ gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">City <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">State <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Pincode <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '8px' }}>
                    Next Step: KYC Documents ➔
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: KYC & Identity Documents */}
            {currentStep === 2 && (
              <form onSubmit={handleNextStep} style={{ display: 'grid', gap: '20px' }}>
                <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: '0 0 8px 0', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                  Step 2: Identity Proofs & Verification Uploads
                </h4>

                <div className="responsive-grid-2" style={{ gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">Primary ID Type <span style={{ color: 'red' }}>*</span></label>
                    <select
                      className="input-field"
                      value={formData.id_type}
                      onChange={(e) => setFormData({ ...formData, id_type: e.target.value })}
                    >
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">ID Number <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 1234 5678 9012"
                      value={formData.id_number}
                      onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Primary ID Files */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: 'var(--border-light)' }}>
                  <div className="input-group">
                    <label className="input-label">Upload Front Document <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="file"
                      accept="image/jpeg, image/png, application/pdf"
                      onChange={(e) => handleFileUpload(e, 'id_file')}
                      style={{ fontSize: 'var(--text-xs)' }}
                    />
                    {uploadingField === 'id_file' && <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '4px' }}>Uploading to secure private storage...</div>}
                    {formData.id_file && <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '4px' }}>✓ Document uploaded securely</div>}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Upload Back Document (Optional)</label>
                    <input
                      type="file"
                      accept="image/jpeg, image/png, application/pdf"
                      onChange={(e) => handleFileUpload(e, 'id_file_back')}
                      style={{ fontSize: 'var(--text-xs)' }}
                    />
                    {uploadingField === 'id_file_back' && <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '4px' }}>Uploading to secure private storage...</div>}
                    {formData.id_file_back && <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '4px' }}>✓ Back document uploaded</div>}
                  </div>
                </div>

                {/* Live Selfie */}
                <div className="input-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: 'var(--border-light)' }}>
                  <label className="input-label">Upload Agent Live Selfie <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={(e) => handleFileUpload(e, 'selfie')}
                    style={{ fontSize: 'var(--text-xs)' }}
                  />
                  {uploadingField === 'selfie' && <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '4px' }}>Uploading selfie to private storage...</div>}
                  {formData.selfie && <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '4px' }}>✓ Selfie uploaded</div>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                  <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-secondary">
                    ← Back
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '8px' }}>
                    Next Step: Bank Details ➔
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Bank Account Details */}
            {currentStep === 3 && (
              <form onSubmit={handleSubmitProfile} style={{ display: 'grid', gap: '20px' }}>
                <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: '0 0 8px 0', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                  Step 3: Bank & Commission Payout Details
                </h4>

                <div className="responsive-grid-2" style={{ gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">Account Holder Name <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.bank_holder_name}
                      onChange={(e) => setFormData({ ...formData, bank_holder_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Bank Name <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. HDFC Bank"
                      value={formData.bank_name}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="responsive-grid-2" style={{ gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">Account Number <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.bank_account_no}
                      onChange={(e) => setFormData({ ...formData, bank_account_no: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">IFSC Code <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. HDFC0001234"
                      value={formData.bank_ifsc}
                      onChange={(e) => setFormData({ ...formData, bank_ifsc: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>
                </div>

                <div className="input-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: 'var(--border-light)' }}>
                  <label className="input-label">Cancelled Cheque or Passbook (Optional)</label>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, application/pdf"
                    onChange={(e) => handleFileUpload(e, 'cancelled_cheque')}
                    style={{ fontSize: 'var(--text-xs)' }}
                  />
                  {uploadingField === 'cancelled_cheque' && <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '4px' }}>Uploading to private storage...</div>}
                  {formData.cancelled_cheque && <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '4px' }}>✓ Bank document uploaded</div>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                  <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-secondary" disabled={saving}>
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                    style={{ padding: '12px 36px', borderRadius: '8px', background: 'var(--gradient-primary)', border: 'none' }}
                  >
                    {saving ? 'Completing Setup...' : '✓ Complete Registration & Open Dashboard'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
