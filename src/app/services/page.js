'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ALL_SERVICES_LIST = [
  {
    id: 'banks',
    title: 'Banks & Partner Lenders',
    category: 'Banking & Partners',
    icon: '🏦',
    rate: 'Starts @ 8.35% p.a.',
    maxLimit: '100+ Bank Programs',
    desc: 'Compare loan interest rates, processing fees, and approval criteria across 100+ leading PSU, Private banks and NBFCs.',
    href: '/banks',
    badge: 'Popular'
  },
  {
    id: 'personal-loan',
    title: 'Personal Loan',
    category: 'Personal Loans',
    icon: '💼',
    rate: 'Starts @ 10.49% p.a.',
    maxLimit: 'Up to ₹50 Lakhs',
    desc: 'Collateral-free personal loans for medical emergencies, wedding expenses, home renovation, or debt consolidation.',
    href: '/services/personal-loan',
    badge: 'Fast Disbursal'
  },
  {
    id: 'business-loan',
    title: 'Business Loan',
    category: 'Business & Commercial',
    icon: '🏢',
    rate: 'Starts @ 13.50% p.a.',
    maxLimit: 'Up to ₹2 Crores',
    desc: 'Working capital funding, GST-backed business credit lines, and machinery loans with zero collateral.',
    href: '/services/business-loan',
    badge: 'Zero Collateral'
  },
  {
    id: 'instant-loan',
    title: 'Instant Emergency Loan',
    category: 'Personal Loans',
    icon: '⚡',
    rate: 'Starts @ 1.25% / mo',
    maxLimit: 'Up to ₹5 Lakhs',
    desc: '100% digital cash loans approved and disbursed into your bank account within 30 minutes.',
    href: '/services/instant-loan',
    badge: '30 Mins Disbursal'
  },
  {
    id: 'home-loan',
    title: 'Home Loan',
    category: 'Personal Loans',
    icon: '🏠',
    rate: 'Starts @ 8.35% p.a.',
    maxLimit: 'Up to ₹10 Crores',
    desc: 'Lowest interest rates for purchasing flat, plot purchase, home construction, and home loan balance transfers.',
    href: '/services/home-loan',
    badge: 'Lowest EMI'
  },
  {
    id: 'loan-against-property',
    title: 'Loan Against Property (LAP)',
    category: 'Business & Commercial',
    icon: '🏘️',
    rate: 'Starts @ 9.15% p.a.',
    maxLimit: 'Up to ₹15 Crores',
    desc: 'Unlock high-value liquidity mortgaging residential, commercial, or industrial property with long-term tenure.',
    href: '/services/loan-against-property',
    badge: 'High Value'
  },
  {
    id: 'education-loan',
    title: 'Education Loan',
    category: 'Personal Loans',
    icon: '🎓',
    rate: 'Starts @ 9.50% p.a.',
    maxLimit: 'Up to ₹1.5 Crores',
    desc: 'Study abroad and domestic university education loans covering 100% tuition, travel, and living expenses.',
    href: '/services/education-loan',
    badge: 'Moratorium Period'
  },
  {
    id: 'ca-loan',
    title: 'CA Professional Loan',
    category: 'Professional Loans',
    icon: '📊',
    rate: 'Starts @ 11.25% p.a.',
    maxLimit: 'Up to ₹50 Lakhs',
    desc: 'Collateral-free professional loans tailored for practicing Chartered Accountants to expand office infrastructure.',
    href: '/services/ca-loan',
    badge: 'Special Rate'
  },
  {
    id: 'doctor-loan',
    title: 'Doctor Professional Loan',
    category: 'Professional Loans',
    icon: '🩺',
    rate: 'Starts @ 10.99% p.a.',
    maxLimit: 'Up to ₹75 Lakhs',
    desc: 'Specialized financing for MBBS, BDS, MD doctors for clinic setup, hospital expansion, and medical equipment.',
    href: '/services/doctor-loan',
    badge: 'Quick Approval'
  },
  {
    id: 'credit-cards',
    title: 'Credit Cards',
    category: 'Banking & Insurance',
    icon: '💳',
    rate: 'Up to 5% Cashback',
    maxLimit: 'Lifetime Free Options',
    desc: 'Apply for instant premium rewards, fuel savings, travel lounge access, and cashback credit cards from top banks.',
    href: '/credit-cards',
    badge: 'Instant Rewards'
  },
  {
    id: 'vehicle-loan',
    title: 'All Types Vehicle Loans',
    category: 'Business & Commercial',
    icon: '🚛',
    rate: 'Starts @ 8.99% p.a.',
    maxLimit: '100% On-Road Price',
    desc: 'Auto financing for heavy commercial trucks, transport fleets, buses, construction machinery, and private cars.',
    href: '/services/vehicle-loan',
    badge: '100% Funding'
  },
  {
    id: 'used-car-loan',
    title: 'Used Car Loan',
    category: 'Personal Loans',
    icon: '🚗',
    rate: 'Starts @ 12.00% p.a.',
    maxLimit: 'Up to 90% Valuation',
    desc: 'Quick pre-owned car loans with doorstep vehicle evaluation, flexible EMIs, and hassle-free RTO transfer.',
    href: '/services/used-car-loan',
    badge: 'Fast RTO Transfer'
  },
  {
    id: 'insurance',
    title: 'Insurance Solutions',
    category: 'Banking & Insurance',
    icon: '🛡️',
    rate: 'From ₹499 / mo',
    maxLimit: 'Up to ₹1 Crore Cover',
    desc: 'Comprehensive health, life, term, motor, and business property insurance with 10,000+ cashless hospitals.',
    href: '/services/insurance',
    badge: 'Tax Saver'
  },
  {
    id: 'bank-account-opening',
    title: 'Bank Account Opening',
    category: 'Banking & Insurance',
    icon: '🏦',
    rate: 'Up to 7.5% Interest',
    maxLimit: 'Zero Balance Options',
    desc: '100% video-KYC digital bank account opening with free debit cards, mobile banking, and high savings interest.',
    href: '/services/bank-account-opening',
    badge: '100% Digital'
  },
  {
    id: 'loan-against-shares',
    title: 'Loan Against Shares & Securities',
    category: 'Banking & Insurance',
    icon: '🏢',
    rate: 'Starts @ 9.50% p.a.',
    maxLimit: 'Up to ₹5 Crores',
    desc: 'Instant overdraft credit line against equity shares, mutual fund folios, and bonds without selling investments.',
    href: '/services/loan-against-shares',
    badge: 'Instant Credit Line'
  }
];

const CATEGORIES = [
  'All',
  'Personal Loans',
  'Business & Commercial',
  'Professional Loans',
  'Banking & Insurance'
];

export default function AllServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = ALL_SERVICES_LIST.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <Header />

      <main style={{ flex: 1, paddingTop: '40px', paddingBottom: '80px' }}>
        {/* Hero Header */}
        <section style={{ textAlign: 'center', padding: '40px 20px 30px 20px', position: 'relative' }}>
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
              marginBottom: '16px'
            }}>
              💼 Full Financial Services Portfolio
            </span>

            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.2, margin: '0 0 16px 0', fontFamily: 'var(--font-heading)' }}>
              Explore Our <span className="gradient-text">Complete Services</span>
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--color-text-secondary)', maxWidth: '680px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
              Compare rates, eligibility, and instant pre-approval terms across our 15+ specialized loan, professional financing, banking, and insurance programs.
            </p>

            {/* Search Input Bar */}
            <div style={{ maxWidth: '540px', margin: '0 auto 24px auto', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search services (e.g. Home Loan, CA Loan, Insurance...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '30px',
                  border: '1px solid var(--border-default)',
                  background: 'var(--color-bg-surface)',
                  color: 'var(--color-text-primary)',
                  fontSize: '14px',
                  boxShadow: 'var(--shadow-md)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {CATEGORIES.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                    color: selectedCategory === cat ? 'var(--color-btn-primary-text)' : 'var(--color-text-secondary)',
                    border: selectedCategory === cat ? '1px solid var(--color-primary)' : '1px solid var(--border-default)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Services Cards Grid */}
        <section className="container" style={{ maxWidth: '1200px', margin: '0 auto 60px auto', padding: '0 20px' }}>
          {filteredServices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--color-bg-surface)', borderRadius: '20px', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>No matching services found</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Try searching with a different keyword or select &quot;All&quot; category.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '28px',
                    borderRadius: '20px',
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--border-default)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                        {service.icon}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', background: 'var(--color-primary-light)', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                        {service.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                      {service.title}
                    </h3>

                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                      {service.desc}
                    </p>
                  </div>

                  <div>
                    {/* Rate & Limit Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', borderRadius: '12px', background: 'var(--color-bg-subtle)', marginBottom: '20px', border: '1px solid var(--border-default)' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Rate / Perk</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '2px' }}>{service.rate}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Max Limit</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '2px' }}>{service.maxLimit}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link
                        href={service.href}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 700, textAlign: 'center', borderRadius: '10px', textDecoration: 'none' }}
                      >
                        Explore Service ➔
                      </Link>
                      <Link
                        href="/check"
                        className="btn btn-secondary"
                        style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 700, borderRadius: '10px', textDecoration: 'none', border: '1px solid var(--border-default)' }}
                      >
                        Eligibility ⚡
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Bottom Banner */}
        <section className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            padding: '40px',
            borderRadius: '24px',
            background: 'var(--color-primary-light)',
            border: '1px solid var(--color-primary)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '8px' }}>
              Need Help Choosing the Right Financial Product?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto 24px auto' }}>
              Our financial algorithms automatically evaluate your profile across 100+ Banks & NBFCs to find your lowest interest loan.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/check" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '15px', fontWeight: 700 }}>
                Check Instant Loan Eligibility 🚀
              </Link>
              <Link href="/become-a-partner" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px', fontWeight: 700, border: '1px solid var(--border-default)' }}>
                Become a Partner Agent 🤝
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
