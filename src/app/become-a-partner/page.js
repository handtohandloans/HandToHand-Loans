'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BecomeAPartner() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    partnerType: 'Individual DSA',
    experience: '0-2 years',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <Header />

      <main style={{ flex: 1, paddingTop: '40px', paddingBottom: '80px' }}>
        {/* Hero Section */}
        <section style={{ padding: '60px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 18px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              marginBottom: '20px'
            }}>
              🤝 Official DSA Partner Network
            </span>
            
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.2, margin: '0 0 20px 0', fontFamily: 'var(--font-heading)' }}>
              Become a HandToHand <br />
              <span className="gradient-text">Loans Partner</span> & Earn Big
            </h1>
            
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--color-text-secondary)', maxWidth: '680px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
              Join India&apos;s fastest-growing fintech DSA agent network. Access 100+ Banks & NBFCs, get instant commission payouts, and scale your financial business with zero investment.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <a
                href="#partner-form"
                className="btn btn-primary"
                style={{ padding: '14px 32px', fontSize: '15px', fontWeight: 700 }}
              >
                Apply for Partnership 🚀
              </a>
              <Link
                href="/signup"
                className="btn btn-secondary"
                style={{ padding: '14px 32px', fontSize: '15px', fontWeight: 700, border: '1px solid var(--border-default)' }}
              >
                Agent Portal Signup
              </Link>
            </div>
          </div>
        </section>

        {/* Highlight Stats Banner */}
        <section className="container" style={{ maxWidth: '1100px', margin: '0 auto 40px auto', padding: '0 20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            padding: '36px 24px',
            borderRadius: '24px',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>100+</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600, marginTop: '4px' }}>Bank & NBFC Partners</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Up to 3.5%</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600, marginTop: '4px' }}>Loan Payout Commission</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>24-48 Hrs</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600, marginTop: '4px' }}>Fast Commission Payouts</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹0</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600, marginTop: '4px' }}>Joining & Registration Fee</div>
            </div>
          </div>
        </section>

        {/* Why Partner With Us (Features Grid) */}
        <section className="container" style={{ maxWidth: '1100px', margin: '0 auto 60px auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Why Partner With HandToHand Loans?</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px', fontSize: '15px' }}>
              Everything you need to turn client loan inquiries into high-earning commissions.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            <div style={{ padding: '28px', borderRadius: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                ⚡
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-primary)' }}>100+ Lending Partners</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Instant access to leading public, private banks and top NBFCs for Personal, Business, Home, and LAP loans.
              </p>
            </div>

            <div style={{ padding: '28px', borderRadius: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                💸
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-primary)' }}>Highest Payout Structure</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Enjoy industry-best commission rates on every disbursed loan with transparent real-time tracking in your dashboard.
              </p>
            </div>

            <div style={{ padding: '28px', borderRadius: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                🌳
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-primary)' }}>Sub-Agent Referral Tree</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Build your own team of sub-agents. Earn passive income from every application processed by your referral network.
              </p>
            </div>

            <div style={{ padding: '28px', borderRadius: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                📱
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-primary)' }}>Smart Agent Portal</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Submit client leads in 30 seconds, track application stages, download agreement certificates, and manage payouts easily.
              </p>
            </div>

            <div style={{ padding: '28px', borderRadius: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                🎓
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-primary)' }}>Dedicated Relationship Manager</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Get one-on-one support from expert loan managers to help resolve client queries, doc submission, and loan approvals.
              </p>
            </div>

            <div style={{ padding: '28px', borderRadius: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                🛡️
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-primary)' }}>100% Free Onboarding</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                No hidden costs, security deposits, or joining fees. Start submitting leads immediately after document verification.
              </p>
            </div>
          </div>
        </section>

        {/* Partner Categories */}
        <section className="container" style={{ maxWidth: '1100px', margin: '0 auto 60px auto', padding: '0 20px' }}>
          <div style={{
            padding: '40px 24px',
            borderRadius: '24px',
            background: 'var(--color-bg-subtle)',
            border: '1px solid var(--border-default)'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: '32px', fontFamily: 'var(--font-heading)' }}>
              Who Can Become a HandToHand Partner?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              textAlign: 'center'
            }}>
              <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>👔</div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>Financial Consultants / DSAs</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>Expand your portfolio with 100+ lenders under one roof.</p>
              </div>
              <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>CAs & Tax Professionals</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>Monetize client business and personal funding requirements.</p>
              </div>
              <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚗</div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>Auto & Real Estate Dealers</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>Offer instant vehicle and property loans to your buyers.</p>
              </div>
              <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📱</div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>Referral Partners & Freelancers</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>Earn extra income by referring friends, colleagues, and family.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Application Form Section */}
        <section id="partner-form" className="container" style={{ maxWidth: '780px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            padding: '40px clamp(20px, 4vw, 48px)',
            borderRadius: '24px',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>Apply For DSA Partnership</h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
                Fill out the form below. Our Partnership Onboarding Team will contact you within 2 hours.
              </p>
            </div>

            {submitted ? (
              <div style={{ padding: '36px 24px', textAlign: 'center', background: 'var(--color-primary-light)', borderRadius: '20px', border: '1px solid var(--color-primary)' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '8px' }}>Application Submitted Successfully!</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
                  Thank you for registering, <strong>{formData.fullName}</strong>. Our Manager will call you shortly on <strong>{formData.phone}</strong> to activate your partner code.
                </p>
                <div>
                  <Link href="/signup" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '14px', fontWeight: 700 }}>
                    Proceed to Create Agent Account ➔
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--color-bg-primary)',
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="10 digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--color-bg-primary)',
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--color-bg-primary)',
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                      City / Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Delhi, Bengaluru"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--color-bg-primary)',
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                      Partner Category
                    </label>
                    <select
                      value={formData.partnerType}
                      onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--color-bg-primary)',
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="Individual DSA">Individual Loan Agent / DSA</option>
                      <option value="CA / Tax Advisor">CA / Tax Professional</option>
                      <option value="Real Estate / Car Dealer">Real Estate or Car Dealer</option>
                      <option value="Referral Partner">Referral Partner / Student / Freelancer</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                      Financial Experience
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--color-bg-primary)',
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="Fresher">New to Financial Services</option>
                      <option value="0-2 years">0 - 2 Years</option>
                      <option value="2-5 years">2 - 5 Years</option>
                      <option value="5+ years">5+ Years Experience</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your client base or average monthly loan leads..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-default)',
                      background: 'var(--color-bg-primary)',
                      color: 'var(--color-text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '15px',
                    fontWeight: 700,
                    borderRadius: '14px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  {loading ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <span>Submit Partner Application 🚀</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
