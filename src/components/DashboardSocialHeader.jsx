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
  supportPhone: '9389119399',
  supportWhatsApp: 'https://wa.me/919389119399?text=Hello%20HandToHand%20Loans%20Support',
};

export default function DashboardSocialHeader({ profile, onSignOut }) {
  const agentName = (profile?.full_name || 'PARTNER').toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', width: '100%' }}>
      {/* ========================================================
          1. TOP WELCOME ANNOUNCEMENT BANNER
          ======================================================== */}
      <div
        style={{
          background: 'var(--color-bg-card, #ffffff)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '14px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
        }}
      >
        <span style={{ fontSize: '20px', flexShrink: 0 }}>🎉</span>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.55, color: 'var(--color-text-secondary, #475569)' }}>
          <strong style={{ color: 'var(--color-text-primary, #0f172a)' }}>Welcome to HandToHand Loans!</strong> Your partner account is now fully active and ready to go. Start submitting leads across 12+ trusted lenders, generate your own personal UTM link to share with customers, track every payout in real time, and grow your DSA business with us — all from one simple dashboard. We&apos;re excited to have you on the team!
        </p>
      </div>

      {/* ========================================================
          2. STAY CONNECTED WITH HANDTOHAND LOANS BANNER
          ======================================================== */}
      <div
        style={{
          background: 'var(--color-bg-card, #ffffff)',
          border: '1px solid var(--border-subtle, rgba(226, 232, 240, 0.8))',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Left Side: Brand & Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '280px', flex: '1 1 320px' }}>
          <div style={{ position: 'relative', width: '56px', height: '48px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '28px' }}>📢</span>
            <div style={{ position: 'absolute', bottom: -2, right: -4, background: '#0b1a3d', borderRadius: '6px', padding: '2px 4px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>🤝</span>
            </div>
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary, #0f172a)', letterSpacing: '-0.01em' }}>
              Stay Connected with <span style={{ color: '#0284c7' }}>HandToHand</span> <span style={{ color: '#059669' }}>Loans</span>
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--color-text-secondary, #64748b)' }}>
              Get latest lender updates, UTM links, policies, payouts &amp; training.
            </p>
          </div>
        </div>

        {/* Right Side: 3 Styled Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap' }}>
          {/* WhatsApp Button with DAILY UPDATES badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span
              style={{
                background: '#15803d',
                color: '#ffffff',
                fontSize: '9.5px',
                fontWeight: 800,
                letterSpacing: '0.5px',
                padding: '2px 10px',
                borderRadius: '10px',
                marginBottom: '-8px',
                zIndex: 2,
                boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)',
              }}
            >
              DAILY UPDATES
            </span>
            <a
              href={SOCIAL_LINKS.whatsappCommunity}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '10px 18px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(34, 197, 94, 0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)'; }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.464L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.086-2.885-6.948C16.572 2.015 14.117 1 11.514 1 6.079 1 1.656 5.37 1.652 10.8c-.001 1.716.467 3.39 1.353 4.887l-1.008 3.684 3.77-.988z" />
                <path d="M17.473 14.382c-.301-.151-1.787-.882-2.063-.982-.277-.1-.478-.151-.68.151-.202.3-.779.982-.955 1.182-.176.2-.352.226-.653.076-1.355-.68-2.61-1.24-3.528-2.82-.24-.41-.04-.548.1-.735.158-.21.3-.408.4-.558.1-.15.05-.282-.025-.432-.075-.15-.68-1.637-.932-2.242-.246-.588-.497-.507-.679-.516-.174-.008-.37-.01-.568-.01-.2 0-.523.074-.797.371-.273.297-1.045 1.016-1.045 2.479 0 1.462 1.067 2.873 1.218 3.071.15.2 2.1 3.2 5.088 4.49.711.307 1.267.49 1.701.628.714.227 1.365.195 1.88.117.573-.086 1.787-.73 2.039-1.436.252-.706.252-1.312.176-1.436-.076-.124-.277-.202-.578-.352z"/>
              </svg>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, lineHeight: 1.2 }}>WhatsApp</div>
                <div style={{ fontSize: '11px', fontWeight: 600, opacity: 0.95 }}>Join Now &rsaquo;</div>
              </div>
            </a>
          </div>

          {/* YouTube Channel Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '10px 18px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                marginTop: '10px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(220, 38, 38, 0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)'; }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, lineHeight: 1.2 }}>YouTube Channel</div>
                <div style={{ fontSize: '11px', fontWeight: 600, opacity: 0.95 }}>Subscribe &rsaquo;</div>
              </div>
            </a>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary, #64748b)', marginTop: '4px', fontWeight: 600 }}>
              🎓 Training &amp; Learning
            </span>
          </div>

          {/* Instagram Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '10px 18px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(220, 39, 67, 0.3)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                marginTop: '10px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(220, 39, 67, 0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 39, 67, 0.3)'; }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, lineHeight: 1.2 }}>Instagram</div>
                <div style={{ fontSize: '11px', fontWeight: 600, opacity: 0.95 }}>Follow &rsaquo;</div>
              </div>
            </a>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary, #64748b)', marginTop: '4px', fontWeight: 600 }}>
              ✨ Latest Updates • Offers • Business Highlights
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. BLUE / GREEN PERSONALIZED WELCOME STRIP
          ======================================================== */}
      <div
        style={{
          background: 'linear-gradient(100deg, #072259 0%, #0c3678 45%, #0284c7 68%, #059669 88%, #10b981 100%)',
          borderRadius: '14px',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 18px rgba(7, 34, 89, 0.25)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ zIndex: 1 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
            Welcome back, <span style={{ color: '#34d399' }}>{agentName}!</span>
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#e2e8f0' }}>
            Track your leads, claim payouts and grow your DSA business with <strong>HandToHand Loans</strong>.
          </p>
        </div>

        {/* Right Brand Badge / Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', zIndex: 1 }}>
          <Link
            href="/check"
            className="btn btn-sm"
            style={{
              background: '#22c55e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontWeight: 700,
              fontSize: '12px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.35)',
            }}
          >
            + Check Client Eligibility
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.12)', padding: '6px 14px', borderRadius: '10px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m11 17 2 2a1 1 0 0 0 1.42 0l4.24-4.24a1 1 0 0 0 0-1.42l-2-2" />
              <path d="m13 15 2 2" />
              <path d="M7 11 4.41 8.41a2 2 0 0 1 0-2.83l.83-.83a2 2 0 0 1 2.83 0L11 7.5" />
              <path d="M13 13 8 8" />
              <path d="m13 7 1.5-1.5a2 2 0 0 1 2.83 0l2.25 2.25a2 2 0 0 1 0 2.83L17.5 13" />
              <path d="m3 21 6-6" />
            </svg>
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.3px' }}>HandToHand</div>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#34d399', letterSpacing: '2.5px', marginTop: '2px' }}>— LOANS —</div>
            </div>
          </div>

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="btn btn-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          4. DEDICATED SUPPORT MANAGER CARD
          ======================================================== */}
      <div
        style={{
          background: 'var(--color-bg-card, #ffffff)',
          border: '1px solid var(--border-subtle, rgba(226, 232, 240, 0.8))',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          alignItems: 'center',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Left Column: Icon & Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
                boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <div>
              <h3 style={{ margin: '0 0 2px', fontSize: '14.5px', fontWeight: 800, color: 'var(--color-text-primary, #0f172a)', letterSpacing: '0.3px' }}>
                YOUR DEDICATED SUPPORT MANAGER
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary, #64748b)' }}>
                Need assistance? Your assigned support executive is here to help you.
              </p>
            </div>
          </div>

          {/* Quick Help Pill Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Loan Login', 'MIS Support', 'Payout Help', 'UTM / Marketplace', 'CRM Assistance'].map((tag) => (
              <span
                key={tag}
                style={{
                  background: 'rgba(2, 132, 199, 0.08)',
                  color: '#0284c7',
                  border: '1px solid rgba(2, 132, 199, 0.2)',
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Middle Details 1: Support Executive, Working Days, Availability */}
        <div style={{ padding: '0 12px', borderLeft: '1px solid var(--border-subtle, #e2e8f0)' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-text-tertiary, #94a3b8)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            SUPPORT EXECUTIVE
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary, #0f172a)', marginTop: '2px' }}>
            HandToHand Loans Support Team
          </div>

          <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-text-tertiary, #94a3b8)', letterSpacing: '0.4px', textTransform: 'uppercase', marginTop: '10px' }}>
            WORKING DAYS
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary, #0f172a)', marginTop: '2px' }}>
            Monday – Saturday
          </div>

          <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-text-tertiary, #94a3b8)', letterSpacing: '0.4px', textTransform: 'uppercase', marginTop: '10px' }}>
            AVAILABILITY
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
            Schedule Not Updated
          </div>
        </div>

        {/* Middle Details 2: Contact Number & Working Hours */}
        <div style={{ padding: '0 12px', borderLeft: '1px solid var(--border-subtle, #e2e8f0)' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-text-tertiary, #94a3b8)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            CONTACT NUMBER
          </div>
          <a
            href={`tel:${SOCIAL_LINKS.supportPhone}`}
            style={{ fontSize: '16px', fontWeight: 800, color: '#0284c7', marginTop: '2px', display: 'block', textDecoration: 'none' }}
          >
            {SOCIAL_LINKS.supportPhone}
          </a>

          <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-text-tertiary, #94a3b8)', letterSpacing: '0.4px', textTransform: 'uppercase', marginTop: '12px' }}>
            WORKING HOURS
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary, #0f172a)', marginTop: '2px' }}>
            9 AM – 7 PM
          </div>
        </div>

        {/* Right Actions: WhatsApp Now & Call Now */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'stretch' }}>
          <a
            href={SOCIAL_LINKS.supportWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#22c55e',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '11px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.25)',
              transition: 'background 0.2s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.464L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.086-2.885-6.948C16.572 2.015 14.117 1 11.514 1 6.079 1 1.656 5.37 1.652 10.8c-.001 1.716.467 3.39 1.353 4.887l-1.008 3.684 3.77-.988z" />
            </svg>
            WhatsApp Now
          </a>

          <a
            href={`tel:${SOCIAL_LINKS.supportPhone}`}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '11px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              transition: 'background 0.2s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call Now
          </a>

          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary, #94a3b8)', textAlign: 'center' }}>
            Your dedicated support manager will be assigned soon.
          </span>
        </div>
      </div>

      {/* ========================================================
          5. SOCIAL MEDIA FOOTER STRIP
          ======================================================== */}
      <div
        style={{
          background: 'var(--color-bg-card, #ffffff)',
          border: '1px solid var(--border-subtle, rgba(226, 232, 240, 0.8))',
          borderRadius: '12px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-primary, #0f172a)' }}>
            Follow <span style={{ color: '#0284c7' }}>HandToHand</span> <span style={{ color: '#059669' }}>Loans</span> on Social Media
          </span>
          <span style={{ color: 'var(--border-subtle, #cbd5e1)', fontWeight: 300 }}>|</span>
        </div>

        {/* Social Badges Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* YouTube */}
          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'var(--color-text-primary, #0f172a)', fontSize: '12.5px', fontWeight: 600 }}
          >
            <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            YouTube
          </a>

          {/* Instagram */}
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'var(--color-text-primary, #0f172a)', fontSize: '12.5px', fontWeight: 600 }}
          >
            <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            Instagram
          </a>

          {/* Facebook */}
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'var(--color-text-primary, #0f172a)', fontSize: '12.5px', fontWeight: 600 }}
          >
            <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            Facebook
          </a>

          {/* LinkedIn */}
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'var(--color-text-primary, #0f172a)', fontSize: '12.5px', fontWeight: 600 }}
          >
            <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: '#0A66C2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            LinkedIn
          </a>

          {/* WhatsApp Channel */}
          <a
            href={SOCIAL_LINKS.whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'var(--color-text-primary, #0f172a)', fontSize: '12.5px', fontWeight: 600 }}
          >
            <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.464L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.086-2.885-6.948C16.572 2.015 14.117 1 11.514 1 6.079 1 1.656 5.37 1.652 10.8c-.001 1.716.467 3.39 1.353 4.887l-1.008 3.684 3.77-.988z" />
              </svg>
            </div>
            WhatsApp Channel
          </a>

          {/* Telegram */}
          <a
            href={SOCIAL_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'var(--color-text-primary, #0f172a)', fontSize: '12.5px', fontWeight: 600 }}
          >
            <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: '#0088cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
