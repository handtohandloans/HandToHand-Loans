'use client';

import Link from 'next/link';

export const SOCIAL_LINKS = {
  whatsappCommunity: 'https://chat.whatsapp.com/HxAz1nhORjM7oPcS3o3njl',
  whatsappChannel: 'https://whatsapp.com/channel/0029VbBqKqeAojYmvMmkzE3i',
  youtube: 'https://www.youtube.com/@HANDTOHANDLOANS',
  instagram: 'http://instagram.com/handtohandloans/',
  facebook: 'https://www.facebook.com/profile.php?id=61595287053590',
  linkedin: 'https://in.linkedin.com/company/handtohandloans',
  telegram: 'https://web.telegram.org/k/#@handtohandloans',
  supportPhone: '+91 93891 19399',
  supportPhoneRaw: '+919389119399',
  supportWhatsApp: 'https://wa.me/919389119399?text=Hello%20HandToHand%20Loans%20Support',
};

export default function DashboardSocialHeader({ profile, onSignOut, setActiveTab, activeTab, children }) {
  // Exact name formatting matching reference image
  const fullName = profile?.full_name || 'Siddhant Sagar';
  const firstName = fullName.split(' ')[0] || 'Siddhant';
  
  // Initials (e.g., "SS")
  const getInitials = (name) => {
    if (!name) return 'SS';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const initials = getInitials(fullName);

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', width: '100%', margin: 0, padding: 0, fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)' }}>
      {/* ========================================================
          TOP NAVIGATION BAR (EXACT AS REFERENCE IMAGE)
          ======================================================== */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 0',
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Logo on Left */}
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand_logo.png?v=3"
              alt="HandToHand Loans"
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          {/* Right Action Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/check"
              style={{
                backgroundColor: '#15803d',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                padding: '8px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#166534'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#15803d'; }}
            >
              Check Client Eligibility
            </Link>

            {/* User Pill Badge */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '24px',
                padding: '4px 14px 4px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>
                {fullName}
              </span>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                color: '#1e293b',
                fontSize: '13px',
                fontWeight: 500,
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'background-color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN BODY CONTAINER
          ======================================================== */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 24px 32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* ========================================================
            HERO CARD: ROYAL BLUE CARD (EXACT AS REFERENCE IMAGE)
            ======================================================== */}
        <section
          style={{
            backgroundColor: '#08298a',
            borderRadius: '16px',
            padding: '32px 36px',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '32px',
            flexWrap: 'wrap',
            boxShadow: '0 4px 20px rgba(8, 41, 138, 0.15)',
          }}
        >
          {/* Left Side: Welcome & Description */}
          <div style={{ flex: '1 1 440px', minWidth: '300px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.14)',
                padding: '4px 12px',
                borderRadius: '20px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  display: 'inline-block',
                }}
              />
              <span style={{ color: '#ffffff', fontSize: '11.5px', fontWeight: 600 }}>
                Partner account active
              </span>
            </div>

            <h1
              style={{
                margin: '14px 0 12px 0',
                fontSize: '32px',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              Welcome back, <span style={{ color: '#22c55e' }}>{firstName}</span>
            </h1>

            <p
              style={{
                margin: 0,
                color: 'rgba(255, 255, 255, 0.78)',
                fontSize: '13px',
                lineHeight: 1.6,
                maxWidth: '460px',
              }}
            >
              Submit leads across 12+ trusted lenders, share your personal UTM link with customers, and track every payout in real time — all from one dashboard.
            </p>
          </div>

          {/* Right Side: 2x2 Grid Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              width: '100%',
              maxWidth: '450px',
              flexShrink: 0,
            }}
          >
            {/* Card 1: Submit a lead */}
            <Link
              href="/check"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '12px',
                padding: '16px 20px',
                textDecoration: 'none',
                display: 'block',
                transition: 'background-color 0.15s, transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                Submit a lead
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '11.5px' }}>
                Send to 12+ lenders
              </div>
            </Link>

            {/* Card 2: My UTM link */}
            <div
              onClick={() => setActiveTab && setActiveTab('marketing')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '12px',
                padding: '16px 20px',
                cursor: 'pointer',
                transition: 'background-color 0.15s, transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                My UTM link
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '11.5px' }}>
                Generate &amp; share
              </div>
            </div>

            {/* Card 3: Track payouts */}
            <div
              onClick={() => setActiveTab && setActiveTab('earnings')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '12px',
                padding: '16px 20px',
                cursor: 'pointer',
                transition: 'background-color 0.15s, transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                Track payouts
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '11.5px' }}>
                Real-time status
              </div>
            </div>

            {/* Card 4: My leads */}
            <div
              onClick={() => setActiveTab && setActiveTab('applications')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '12px',
                padding: '16px 20px',
                cursor: 'pointer',
                transition: 'background-color 0.15s, transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                My leads
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '11.5px' }}>
                Status &amp; MIS
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            MIDDLE ROW: 2 CARDS (YOUR SUPPORT MANAGER & STAY CONNECTED)
            ======================================================== */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1.65fr 1fr',
            gap: '20px',
            alignItems: 'stretch',
          }}
        >
          {/* --------------------------------------------------------
              LEFT CARD: Your support manager
              -------------------------------------------------------- */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '24px 28px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Header with Title & Pending Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h2
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#092244',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Your support manager
                  </h2>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                    Need help? Your assigned support executive is here for you.
                  </p>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#fef3c7',
                    padding: '4px 12px',
                    borderRadius: '20px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#f59e0b',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ color: '#b45309', fontSize: '11px', fontWeight: 600 }}>
                    Manager assignment pending
                  </span>
                </div>
              </div>

              {/* 3-Column Support Box */}
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  backgroundColor: '#ffffff',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr',
                  gap: '16px',
                  alignItems: 'center',
                  marginTop: '16px',
                }}
              >
                {/* Column 1: Support Executive */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
                    SUPPORT EXECUTIVE
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    HandToHand Loans Support Team
                  </div>
                </div>

                {/* Column 2: Contact Number */}
                <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
                    CONTACT NUMBER
                  </div>
                  <a
                    href={`tel:${SOCIAL_LINKS.supportPhoneRaw}`}
                    style={{ fontSize: '14px', fontWeight: 800, color: '#1d4ed8', textDecoration: 'none' }}
                  >
                    {SOCIAL_LINKS.supportPhone}
                  </a>
                </div>

                {/* Column 3: Working Hours */}
                <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
                    WORKING HOURS
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                    Mon – Sat · 9 AM – 7 PM
                  </div>
                </div>
              </div>

              {/* Two Action Buttons: Chat on WhatsApp & Call now */}
              <div style={{ marginTop: '14px', display: 'flex', gap: '12px' }}>
                <a
                  href={SOCIAL_LINKS.supportWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#15803d',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    padding: '12px 18px',
                    borderRadius: '8px',
                    flex: 1,
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#166534'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#15803d'; }}
                >
                  Chat on WhatsApp
                </a>

                <a
                  href={`tel:${SOCIAL_LINKS.supportPhoneRaw}`}
                  style={{
                    backgroundColor: '#08298a',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    padding: '12px 18px',
                    borderRadius: '8px',
                    flex: 1,
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0b2066'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#08298a'; }}
                >
                  Call now
                </a>
              </div>
            </div>

            {/* "I need help with" Pills */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 500, marginBottom: '8px' }}>
                I need help with
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  'Loan login',
                  'MIS support',
                  'Payout help',
                  'UTM / Marketplace',
                  'CRM assistance',
                ].map((pill) => (
                  <a
                    key={pill}
                    href={`https://wa.me/919389119399?text=Hello%20HandToHand%20Loans%20Support,%20I%20need%20help%20with%20${encodeURIComponent(pill)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      color: '#1e293b',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'background-color 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  >
                    {pill}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------
              RIGHT CARD: Stay connected
              -------------------------------------------------------- */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '24px 28px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h2
                style={{
                  margin: '0 0 4px 0',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#092244',
                  letterSpacing: '-0.01em',
                }}
              >
                Stay connected
              </h2>
              <p style={{ margin: '0 0 16px 0', fontSize: '12.5px', color: '#64748b' }}>
                Lender updates, policies, payouts &amp; training.
              </p>

              {/* 1. WhatsApp Channel */}
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>
                      WhatsApp Channel
                    </span>
                    <span
                      style={{
                        backgroundColor: '#15803d',
                        color: '#ffffff',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      Daily
                    </span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>
                    Lender updates &amp; policy changes
                  </div>
                </div>

                <a
                  href={SOCIAL_LINKS.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#15803d',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    padding: '4px 8px',
                  }}
                >
                  Join
                </a>
              </div>

              {/* 2. YouTube Channel */}
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>
                    YouTube Channel
                  </div>
                  <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>
                    Training &amp; learning videos
                  </div>
                </div>

                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#dc2626',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    padding: '4px 8px',
                  }}
                >
                  Subscribe
                </a>
              </div>

              {/* 3. Instagram */}
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>
                    Instagram
                  </div>
                  <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>
                    Offers &amp; business highlights
                  </div>
                </div>

                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#be185d',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    padding: '4px 8px',
                  }}
                >
                  Follow
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Detail View (if an active tab like Leads or Payouts is opened) */}
        {activeTab && activeTab !== 'overview' && children && (
          <section
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
              marginTop: '4px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#092244', textTransform: 'capitalize' }}>
                {activeTab.replace('_', ' ')} Section
              </div>
              <button
                onClick={() => setActiveTab && setActiveTab('overview')}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  color: '#334155',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  cursor: 'pointer',
                }}
              >
                ✕ Close to Overview
              </button>
            </div>
            {children}
          </section>
        )}

        {/* ========================================================
            FOOTER STRIP: Follow HandToHand Loans & Links (EXACT AS REFERENCE IMAGE)
            ======================================================== */}
        <footer
          style={{
            marginTop: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '14px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ color: '#092244', fontSize: '12.5px', fontWeight: 700 }}>
            Follow HandToHand Loans
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#475569', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
            >
              YouTube
            </a>

            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#475569', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
            >
              Instagram
            </a>

            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#475569', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
            >
              Facebook
            </a>

            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#475569', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
            >
              LinkedIn
            </a>

            <a
              href={SOCIAL_LINKS.whatsappChannel}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#475569', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
            >
              WhatsApp Channel
            </a>

            <a
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#475569', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
            >
              Telegram
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
