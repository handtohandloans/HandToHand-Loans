'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SERVICES_DATA = {
  'personal-loan': {
    title: 'Personal Loan',
    subtitle: 'Unsecured Instant Personal Loans at Lowest Interest Rates',
    icon: '💼',
    minRate: '10.49% p.a.',
    maxAmount: 'Up to ₹50 Lakhs',
    maxTenure: 'Up to 7 Years',
    disbursalTime: '24 Hours',
    description: 'Get instant collateral-free personal loans for medical emergencies, wedding expenses, home renovation, or debt consolidation from 100+ partner banks.',
    keyFeatures: [
      'No collateral or guarantor required',
      'Instant online approval & paperless processing',
      'Flexible repayment tenure from 12 to 84 months',
      'Special discounted interest rates for salaried employees'
    ],
    eligibility: [
      'Salaried or Self-Employed Individual',
      'Age between 21 to 60 years',
      'Minimum monthly net income of ₹15,000',
      'CIBIL Credit Score of 650 or higher'
    ],
    documents: [
      'PAN Card & Aadhaar Card',
      'Last 3 months salary slips',
      'Last 6 months bank account statement',
      'Current address proof'
    ]
  },
  'business-loan': {
    title: 'Business Loan',
    subtitle: 'Collateral-Free MSME & Commercial Business Expansion Funding',
    icon: '🏢',
    minRate: '13.50% p.a.',
    maxAmount: 'Up to ₹2 Crores',
    maxTenure: 'Up to 5 Years',
    disbursalTime: '48 Hours',
    description: 'Fuel your business growth with collateral-free working capital loans, GST-backed business credit lines, and machinery purchase loans.',
    keyFeatures: [
      'Zero collateral needed for up to ₹50 Lakhs',
      'GST & ITR based quick credit evaluation',
      'Customized flexible EMI options for seasonal businesses',
      'High approval rates for established retailers & manufacturers'
    ],
    eligibility: [
      'Business vintage of minimum 2 years',
      'Minimum annual turnover of ₹20 Lakhs',
      'GST registered business entity',
      'Satisfactory bank account transactions'
    ],
    documents: [
      'Business PAN & Registration Certificate',
      'GST Returns for last 12 months',
      'Last 2 years audited ITR with computation',
      'Bank statement for last 12 months'
    ]
  },
  'instant-loan': {
    title: 'Instant Emergency Loan',
    subtitle: '100% Paperless Cash Loan Disbursed within 30 Minutes',
    icon: '⚡',
    minRate: '1.25% / month',
    maxAmount: 'Up to ₹5 Lakhs',
    maxTenure: 'Up to 36 Months',
    disbursalTime: '30 Minutes',
    description: 'Need urgent cash? Get instant loan approval with zero physical paperwork and direct bank credit within minutes.',
    keyFeatures: [
      '100% digital & video KYC process',
      'Instant approval based on credit score',
      'No physical document submission required',
      'Ideal for urgent bills, medical emergencies & travel'
    ],
    eligibility: [
      'Indian Resident Citizen',
      'Age: 21 to 58 years',
      'Valid Aadhaar linked with mobile number',
      'Active bank account with netbanking access'
    ],
    documents: [
      'PAN Card number',
      'Aadhaar e-KYC verification',
      'Selfie verification',
      'Bank netbanking login for auto-disbursal'
    ]
  },
  'home-loan': {
    title: 'Home Loan',
    subtitle: 'Lowest Interest Home Loans & Balance Transfer Facilities',
    icon: '🏠',
    minRate: '8.35% p.a.',
    maxAmount: 'Up to ₹10 Crores',
    maxTenure: 'Up to 30 Years',
    disbursalTime: '3 - 5 Days',
    description: 'Make your dream home a reality with affordable home loans for flat purchase, plot purchase, home construction, and top-up loans.',
    keyFeatures: [
      'Lowest home loan interest rates starting @ 8.35%',
      'PMAY subsidy benefits for eligible home buyers',
      'Home loan balance transfer with high top-up limits',
      'Minimal processing fees & doorstep legal assistance'
    ],
    eligibility: [
      'Salaried, Professional, or Self-Employed',
      'Age: 21 to 65 years at loan maturity',
      'Stable income source & clean credit track record',
      'Property title documents in order'
    ],
    documents: [
      'KYC documents (PAN, Aadhaar, Passport)',
      'Income proof (ITR / Form 16 / Salary Slips)',
      'Property title deeds & approved floor plan',
      'Bank statements for last 6 months'
    ]
  },
  'loan-against-property': {
    title: 'Loan Against Property (LAP)',
    subtitle: 'Unlock High Value Cash Mortgaging Commercial or Residential Property',
    icon: '🏘️',
    minRate: '9.15% p.a.',
    maxAmount: 'Up to ₹15 Crores',
    maxTenure: 'Up to 15 Years',
    disbursalTime: '5 - 7 Days',
    description: 'Leverage the true market value of your property to get low-interest long-term capital for business expansion or personal goals.',
    keyFeatures: [
      'High LTV (Loan to Value ratio) up to 70%',
      'Lower interest rates compared to personal loans',
      'Acceptance of residential, commercial & industrial property',
      'Flexible end-use (business, education, marriage)'
    ],
    eligibility: [
      'Property owner (Self or Joint)',
      'Stable business or salary income',
      'Property free from legal encumbrance',
      'Age: 23 to 65 years'
    ],
    documents: [
      'Property Ownership Documents & Registered Sale Deed',
      'Property Tax Receipts & Approved Layout Plan',
      'KYC & Income Documents (ITR/Salary)',
      'Bank statement for last 12 months'
    ]
  },
  'education-loan': {
    title: 'Education Loan',
    subtitle: 'Study Abroad & Domestic Top University Education Loans',
    icon: '🎓',
    minRate: '9.50% p.a.',
    maxAmount: 'Up to ₹1.5 Crores',
    maxTenure: 'Up to 15 Years',
    disbursalTime: '3 Days',
    description: 'Fund higher education in India and leading international universities (USA, UK, Canada, Australia, Europe) with flexible moratorium periods.',
    keyFeatures: [
      '100% coverage of tuition fees, travel & living expenses',
      'Moratorium period (No EMI during course + 1 year)',
      'Tax deduction benefits under Section 80E',
      'Collateral-free study loans up to ₹75 Lakhs'
    ],
    eligibility: [
      'Confirmed admission in recognized university/institute',
      'Co-borrower (Parent/Guardian) with stable income',
      'Good academic track record in previous exams'
    ],
    documents: [
      'Admission Offer Letter & Fee Structure',
      'Mark sheets of 10th, 12th & Graduation',
      'KYC & Income Proof of Co-borrower',
      'Passport & Visa copy for overseas studies'
    ]
  },
  'ca-loan': {
    title: 'CA Loan',
    subtitle: 'Exclusive Collateral-Free Loans for Chartered Accountants',
    icon: '📊',
    minRate: '11.25% p.a.',
    maxAmount: 'Up to ₹50 Lakhs',
    maxTenure: 'Up to 7 Years',
    disbursalTime: '24 Hours',
    description: 'Tailored financial solutions for practicing CAs to expand office infrastructure, hire team members, and upgrade technology.',
    keyFeatures: [
      'Collateral-free loan based on CA COP certificate',
      'Pre-approved fast track disbursal in 24 hours',
      'Minimal paperwork & attractive interest rates',
      'No security deposit or equity dilution'
    ],
    eligibility: [
      'Practicing Chartered Accountant with valid COP',
      'Minimum 2 years of active CA practice',
      'Clean credit history with CIBIL > 700'
    ],
    documents: [
      'CA Membership & COP Certificate',
      'PAN Card & Aadhaar Card',
      'Last 2 years audited business financials',
      'Bank statement for last 6 months'
    ]
  },
  'doctor-loan': {
    title: 'Doctor Loan',
    subtitle: 'Specialized Professional Loans for Doctors & Hospital Clinics',
    icon: '🩺',
    minRate: '10.99% p.a.',
    maxAmount: 'Up to ₹75 Lakhs',
    maxTenure: 'Up to 7 Years',
    disbursalTime: '24 Hours',
    description: 'Empowering medical professionals (MBBS, BDS, MD, MS) to set up clinics, purchase medical equipment, and manage medical facility growth.',
    keyFeatures: [
      'Zero collateral needed up to ₹75 Lakhs',
      'Funding for high-tech medical machinery & diagnostic tools',
      'Flexible drop-line overdraft options available',
      'Pre-approved quick approvals for qualified doctors'
    ],
    eligibility: [
      'Qualified Doctor (MBBS / BDS / MD / MS / BHMS / BAMS)',
      'Medical Council Registration Certificate',
      'Minimum 1 year post-qualification experience'
    ],
    documents: [
      'Medical Degree & Medical Council Registration Certificate',
      'PAN Card & Aadhaar Card',
      'Clinic Registration Proof (if applicable)',
      'Bank statement for last 6 months'
    ]
  },
  'vehicle-loan': {
    title: 'All Types Vehicle Loans',
    subtitle: 'Commercial Fleet, Heavy Truck & Private Auto Financing',
    icon: '🚛',
    minRate: '8.99% p.a.',
    maxAmount: '100% On-Road Funding',
    maxTenure: 'Up to 7 Years',
    disbursalTime: '24 - 48 Hours',
    description: 'Comprehensive vehicle loans for commercial trucks, buses, cabs, construction machinery, and personal four-wheelers.',
    keyFeatures: [
      'Up to 100% on-road price funding',
      'Flexible EMIs aligned with fleet revenue cycles',
      'Quick RTO hypothecation assistance',
      'Tie-up with major auto dealerships across India'
    ],
    eligibility: [
      'Salaried, Self-Employed or Transport Business Owner',
      'Age: 21 to 65 years',
      'Valid Driving License or Transport Business Registration'
    ],
    documents: [
      'Proforma Invoice from Authorized Dealer',
      'KYC documents (PAN & Aadhaar)',
      'Income proof / Bank statement for last 6 months',
      'Existing fleet details (for commercial vehicle operators)'
    ]
  },
  'used-car-loan': {
    title: 'Used Car Loan',
    subtitle: 'Pre-Owned Car Financing & Balance Refinancing',
    icon: '🚗',
    minRate: '12.00% p.a.',
    maxAmount: 'Up to 90% Valuation',
    maxTenure: 'Up to 5 Years',
    disbursalTime: '24 Hours',
    description: 'Drive home your preferred pre-owned car with quick used car loans, transparent vehicle valuation, and hassle-free RTO transfer.',
    keyFeatures: [
      'Up to 90% loan against car evaluation value',
      'Free doorstep vehicle inspection & valuation',
      'Refinance existing used car for emergency funds',
      'Hassle-free RTO ownership transfer assistance'
    ],
    eligibility: [
      'Salaried or Self-Employed Individual',
      'Age: 21 to 60 years',
      'Car age should not exceed 10 years at loan maturity'
    ],
    documents: [
      'RC Copy of the pre-owned vehicle',
      'KYC Proof (PAN, Aadhaar)',
      'Income proof (Salary slip / ITR)',
      'Bank statement for last 6 months'
    ]
  },
  'insurance': {
    title: 'Insurance Services',
    subtitle: 'Life, Health, Motor & Commercial Property Insurance Solutions',
    icon: '🛡️',
    minRate: 'From ₹499/mo',
    maxAmount: 'Up to ₹1 Crore Cashless',
    maxTenure: 'Instant Issuance',
    disbursalTime: 'Immediate Policy',
    description: 'Protect your family, health, and business assets with comprehensive insurance coverage from India’s top IRDAI approved insurers.',
    keyFeatures: [
      '10,000+ cashless hospital network for health insurance',
      'Instant policy issuance with zero physical medical checkup',
      'Tax saving under Section 80D & Section 80C',
      '24x7 dedicated claim settlement support'
    ],
    eligibility: [
      'Any Indian Citizen aged 18 to 65 years',
      'No pre-requisite credit score required'
    ],
    documents: [
      'Aadhaar Card / PAN Card',
      'Basic medical background declaration',
      'Vehicle RC copy (for Motor Insurance)'
    ]
  },
  'bank-account-opening': {
    title: 'Bank Account Opening',
    subtitle: 'Zero Balance Digital Savings & Current Account Opening',
    icon: '🏦',
    minRate: 'Up to 7.5% Interest',
    maxAmount: '₹0 Min Balance',
    maxTenure: 'Instant Account',
    disbursalTime: '10 Mins Video KYC',
    description: 'Open premium savings and current bank accounts 100% digitally from home with free debit cards, mobile banking, and high interest rates.',
    keyFeatures: [
      'Zero minimum balance account options',
      'Instant Video-KYC in 10 minutes',
      'Free virtual Visa/Mastercard Debit Card',
      'High savings interest rate up to 7.5% p.a.'
    ],
    eligibility: [
      'Indian Resident Citizen aged 18+',
      'Original PAN Card & Aadhaar linked mobile number'
    ],
    documents: [
      'Original PAN Card for Video KYC',
      'Aadhaar Card',
      'Blank paper for live signature verification'
    ]
  },
  'loan-against-shares': {
    title: 'Loan Against Shares & Securities',
    subtitle: 'Instant Credit Line Against Equity Shares, Mutual Funds & Bonds',
    icon: '🏢',
    minRate: '9.50% p.a.',
    maxAmount: 'Up to ₹5 Crores',
    maxTenure: 'Overdraft Credit Line',
    disbursalTime: '2 Hours',
    description: 'Unlock liquidity from your demat investments without selling equity shares or redeeming mutual fund folios. Pay interest only on withdrawn amount.',
    keyFeatures: [
      '100% digital demat pledge in 2 hours',
      'Zero foreclosure or prepayment penalty',
      'Retain dividend earnings & equity growth',
      'Flexible overdraft facility: pay interest only on used funds'
    ],
    eligibility: [
      'Individual investor / Business entity holding approved securities',
      'Demat account with NSDL / CDSL'
    ],
    documents: [
      'Demat Holding Statement',
      'PAN Card & Aadhaar Card',
      'Bank Account Statement'
    ]
  }
};

export default function ServicePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const service = SERVICES_DATA[slug] || {
    title: 'Financial Service',
    subtitle: 'Customized Loans & Credit Services',
    icon: '💼',
    minRate: 'Competitive Rates',
    maxAmount: 'High Limits',
    maxTenure: 'Flexible Tenure',
    disbursalTime: 'Fast Disbursal',
    description: 'Explore our wide range of loan options tailored to meet your personal and business financial needs.',
    keyFeatures: [
      'Transparent processing',
      'Lowest interest rate guarantee',
      '100+ Bank & NBFC partners',
      'Dedicated manager support'
    ],
    eligibility: ['Indian Resident', 'Minimum 21 years age', 'Valid Proof of Income'],
    documents: ['PAN Card', 'Aadhaar Card', 'Bank Statement']
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    loanAmount: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <Header />

      <main style={{ flex: 1, paddingTop: '30px', paddingBottom: '80px' }}>
        {/* Breadcrumb */}
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto 20px auto', padding: '0 20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{service.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="container" style={{ maxWidth: '1100px', margin: '0 auto 40px auto', padding: '0 20px' }}>
          <div style={{
            padding: '40px clamp(20px, 4vw, 48px)',
            borderRadius: '24px',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
              <div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  marginBottom: '16px'
                }}>
                  <span>{service.icon}</span> Official HandToHand Product
                </span>
                
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.2, margin: '0 0 16px 0', fontFamily: 'var(--font-heading)' }}>
                  {service.title}
                </h1>
                
                <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {service.subtitle}
                </p>

                {/* Key Metrics Pill Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '28px' }}>
                  <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--color-bg-subtle)', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Interest Rate</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>{service.minRate}</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--color-bg-subtle)', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Max Loan Amount</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px' }}>{service.maxAmount}</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--color-bg-subtle)', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Tenure</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px' }}>{service.maxTenure}</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--color-bg-subtle)', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Disbursal</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>{service.disbursalTime}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <Link href="/check" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '15px', fontWeight: 700 }}>
                    Check Instant Eligibility ⚡
                  </Link>
                  <Link href="/emi-calculator" className="btn btn-secondary" style={{ padding: '14px 24px', fontSize: '15px', fontWeight: 700, border: '1px solid var(--border-default)' }}>
                    Calculate EMI 📊
                  </Link>
                </div>
              </div>

              {/* Lead Capture Form */}
              <div style={{
                padding: '32px 24px',
                borderRadius: '20px',
                background: 'var(--color-bg-primary)',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px', textAlign: 'center' }}>Apply for {service.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '20px' }}>
                  Get pre-approved offers from 100+ partner banks instantly.
                </p>

                {submitted ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', background: 'var(--color-primary-light)', borderRadius: '14px', border: '1px solid var(--color-primary)' }}>
                    <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎉</div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>Application Submitted!</h4>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      Our loan expert will call <strong>{formData.phone}</strong> within 15 minutes to process your application.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amit Verma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-default)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        placeholder="10 digit mobile"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-default)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                        Required Loan Amount (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 500000"
                        value={formData.loanAmount}
                        onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-default)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', fontSize: '13px' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700, borderRadius: '10px', marginTop: '6px' }}
                    >
                      Get Pre-Approved Loan 🚀
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Features & Eligibility Grid */}
        <section className="container" style={{ maxWidth: '1100px', margin: '0 auto 40px auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* Key Features */}
            <div style={{ padding: '32px', borderRadius: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✨</span> Key Product Features
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {service.keyFeatures.map((feat, idx) => (
                  <li key={idx} style={{ fontSize: '14px', color: 'var(--color-text-secondary)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eligibility Criteria */}
            <div style={{ padding: '32px', borderRadius: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📋</span> Eligibility Criteria
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {service.eligibility.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '14px', color: 'var(--color-text-secondary)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div style={{ padding: '32px', borderRadius: '20px', background: 'var(--color-bg-surface)', border: '1px solid var(--border-default)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📁</span> Required Documents
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {service.documents.map((doc, idx) => (
                  <li key={idx} style={{ fontSize: '14px', color: 'var(--color-text-secondary)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>📄</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Call To Action Banner */}
        <section className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            padding: '40px',
            borderRadius: '24px',
            background: 'var(--color-primary-light)',
            border: '1px solid var(--color-primary)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '8px' }}>
              Compare {service.title} Across 100+ Top Banks
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto 24px auto' }}>
              Our AI algorithm matches your profile with the lowest interest rate and highest approval bank programs automatically.
            </p>
            <Link href="/check" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '15px', fontWeight: 700 }}>
              Apply for {service.title} Now ➔
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
