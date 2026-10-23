'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { clearUserCache } from '@/lib/cookieCache';
import styles from './Header.module.css';

/* Sub-sections for Loans Menu */
const loanSubSections = [
  {
    id: 'personal-loans',
    name: 'Personal Loans',
    tag: 'Popular',
    desc: 'Instant collateral-free funds',
    color: '#1b8744',
    bg: '#e8f5e9',
    href: '/services/personal-loan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b8744" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
  },
  {
    id: 'business-loans',
    name: 'Business Loans',
    tag: 'Collateral Free',
    desc: 'Working capital & growth finance',
    color: '#1976d2',
    bg: '#e3f2fd',
    href: '/services/business-loan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2M9 15h2M13 11h2M13 15h2" />
      </svg>
    ),
  },
  {
    id: 'instant-loans',
    name: 'Instant Loans',
    tag: '10 Mins',
    desc: 'Fast digital disbursal in minutes',
    color: '#ea580c',
    bg: '#fff7ed',
    href: '/services/instant-loan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'home-loan',
    name: 'Home Loan',
    tag: 'From 8.4%',
    desc: 'Affordable rates for your dream home',
    color: '#7e57c2',
    bg: '#ede7f6',
    href: '/services/home-loan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7e57c2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'loan-against-property',
    name: 'Loan Against Property',
    tag: 'High Value',
    desc: 'Unlock funds against residential/commercial property',
    color: '#00897b',
    bg: '#e0f2f1',
    href: '/services/loan-against-property',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 'gold-loans',
    name: 'Gold Loans',
    tag: 'Best Rate',
    desc: 'Instant loan with highest gold valuation',
    color: '#b45309',
    bg: '#fff8e1',
    href: '/check',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M14.8 9A2 2 0 0 0 13 8h-2a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-2a2 2 0 0 1-1.8-1M12 6v2m0 8v2" />
      </svg>
    ),
  },
];

/* Sub-sections for Our Services Menu */
const servicesSubSections = [
  {
    id: 'service-banks',
    name: 'Banks',
    tag: '50+ Partners',
    desc: 'Top nationalized & private banking network',
    color: '#1565c0',
    bg: '#e3f2fd',
    href: '/banks',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2L2 7h20L12 2z" />
      </svg>
    ),
  },
  {
    id: 'service-loans',
    name: 'Loans',
    tag: '6 Categories',
    desc: 'Instant, personal, business, home & vehicle loans',
    color: '#1b8744',
    bg: '#e8f5e9',
    hasDropdown: true,
    href: '/services',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b8744" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
  },
  {
    id: 'service-credit-cards',
    name: 'Credit Cards',
    tag: 'Pre-Approved',
    desc: 'Exclusive rewards, cashback & lounge access',
    color: '#c2185b',
    bg: '#fce4ec',
    href: '/credit-cards',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c2185b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="6" y1="15" x2="10" y2="15" />
      </svg>
    ),
  },
  {
    id: 'service-insurance',
    name: 'Insurance',
    tag: 'Save Tax',
    desc: 'Comprehensive health, life & term protection',
    color: '#7b1fa2',
    bg: '#f3e5f5',
    href: '/services',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7b1fa2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: 'service-investments',
    name: 'Investments',
    tag: 'High Yield',
    desc: 'Mutual funds, fixed deposits & structured bonds',
    color: '#f57c00',
    bg: '#fff3e0',
    href: '/services',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f57c00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
];

/* Nested Loans Sub-sections (Under Our Services -> Loans) */
const ourServicesLoansSubSections = [
  {
    id: 'os-personal-loan-salaried',
    name: 'Personal Loan (Salaried Customers)',
    tag: 'Special ROI',
    desc: 'Exclusive pre-approved rates for corporate & salaried employees',
    color: '#1b8744',
    bg: '#e8f5e9',
    href: '/services/personal-loan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b8744" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
  },
  {
    id: 'os-business-loans',
    name: 'Business Loans',
    tag: 'Collateral Free',
    desc: 'Working capital, MSME & business expansion loans',
    color: '#1976d2',
    bg: '#e3f2fd',
    href: '/services/business-loan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2M9 15h2M13 11h2M13 15h2" />
      </svg>
    ),
  },
  {
    id: 'os-home-loan',
    name: 'Home Loan',
    tag: 'From 8.4%',
    desc: 'Low EMI home purchase, construction & balance transfer',
    color: '#7e57c2',
    bg: '#ede7f6',
    href: '/services/home-loan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7e57c2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'os-lap',
    name: 'Loan Against Property',
    tag: 'High Value',
    desc: 'Mortgage loan against residential or commercial properties',
    color: '#00897b',
    bg: '#e0f2f1',
    href: '/services/loan-against-property',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 'os-vehicle-loans',
    name: 'All Types of Vehicle Loans',
    tag: 'New & Used',
    desc: 'Car, bike, commercial vehicle & electric mobility loans',
    color: '#e53935',
    bg: '#ffebee',
    href: '/check',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
  },
];

/* Sub-sections for Resources */
const resourcesSubSections = [
  {
    id: 'res-verify-agent',
    name: 'Verify Agent',
    tag: 'Official',
    desc: 'Verify authentic HandToHand loan DSA & partner credentials',
    color: '#00897b',
    bg: '#e0f2f1',
    href: '/verify-agreement',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    id: 'res-blogs',
    name: 'Blogs',
    tag: 'Articles',
    desc: 'Expert financial advice, credit score tips & borrowing guides',
    color: '#1565c0',
    bg: '#e3f2fd',
    href: '/blog',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="14" y2="10" />
      </svg>
    ),
  },
  {
    id: 'res-faq',
    name: 'FAQ',
    tag: 'Help',
    desc: 'Answers to frequently asked questions on loan processes & terms',
    color: '#7b1fa2',
    bg: '#f3e5f5',
    href: '/faq',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7b1fa2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    id: 'res-commodity',
    name: 'Commodity',
    tag: 'Live Rates',
    desc: 'Real-time gold, silver & commodity rate tracking',
    color: '#b45309',
    bg: '#fff8e1',
    href: '/commodities',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
        <line x1="2" y1="9" x2="22" y2="9" />
      </svg>
    ),
  },
  {
    id: 'res-marketing-materials',
    name: 'Marketing Materials',
    tag: 'Downloads',
    desc: 'Promotional banners, brochures, brand logos & partner kits',
    color: '#ea580c',
    bg: '#fff7ed',
    href: '/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    ),
  },
];

/* Sub-sections for EMI Calculator Menu */
const emiCalculatorSubSections = [
  {
    id: 'calc-all-emi',
    name: 'All Types EMI Calculator',
    tag: 'Popular',
    desc: 'Reducing balance & flat rate loan EMI tool',
    color: '#0068fb',
    bg: '#e3f2fd',
    href: '/emi-calculator',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0068fb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="16" y1="14" x2="16" y2="18" />
        <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
  {
    id: 'calc-personal-loan-emi',
    name: 'Personal Loan EMI',
    tag: 'Instant',
    desc: 'Monthly installments, interest & eligibility',
    color: '#1b8744',
    bg: '#e8f5e9',
    href: '/personal-loan-emi-calculator',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b8744" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
  },
  {
    id: 'calc-home-loan-emi',
    name: 'Home Loan EMI',
    tag: 'From 8.4%',
    desc: 'Housing loan payments & amortization table',
    color: '#7e57c2',
    bg: '#ede7f6',
    href: '/home-loan-emi-calculator',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7e57c2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'calc-business-loan-emi',
    name: 'Business Loan EMI',
    tag: 'MSME',
    desc: 'Working capital & commercial finance EMI',
    color: '#1976d2',
    bg: '#e3f2fd',
    href: '/business-loan-emi-calculator',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2M9 15h2M13 11h2M13 15h2" />
      </svg>
    ),
  },
  {
    id: 'calc-more-calculators',
    name: 'More Calculators',
    tag: 'Explore',
    desc: 'Explore all financial & loan calculation tools',
    color: '#ea580c',
    bg: '#fff7ed',
    href: '/calculators',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loansDropdownOpen, setLoansDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [servicesLoansSubmenuOpen, setServicesLoansSubmenuOpen] = useState(false);
  const [mobileLoansOpen, setMobileLoansOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileServicesLoansOpen, setMobileServicesLoansOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [emiDropdownOpen, setEmiDropdownOpen] = useState(false);
  const [mobileEmiOpen, setMobileEmiOpen] = useState(false);

  // Authentication & Profile State
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUserSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (isMounted && profile) {
            setUserProfile(profile);
            setUserRole(profile.role || 'client');
          }

          // Fetch notifications count
          const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id)
            .eq('is_read', false);

          if (isMounted && count !== null) {
            setUnreadCount(count);
          }
        } else {
          setUser(null);
          setUserProfile(null);
          setUserRole(null);
        }
      } catch (err) {
        console.error('Header auth error:', err);
      }
    }

    loadUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserSession();
      } else {
        setUser(null);
        setUserProfile(null);
        setUserRole(null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      clearUserCache();
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setUserRole(null);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileLoansOpen(false);
    setMobileServicesOpen(false);
    setMobileServicesLoansOpen(false);
    setMobileResourcesOpen(false);
    setMobileEmiOpen(false);
    setProfileDropdownOpen(false);
  };

  const isEmiActive =
    pathname.startsWith('/emi-calculator') ||
    pathname.startsWith('/personal-loan-emi-calculator') ||
    pathname.startsWith('/home-loan-emi-calculator') ||
    pathname.startsWith('/business-loan-emi-calculator') ||
    pathname.startsWith('/calculators');

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand Logo */}
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logoLink} onClick={closeMobileMenu}>
            <img
              src="/images/brand_logo.png?v=3"
              alt="HandToHand Loans"
              className={styles.brandLogoImg}
            />
          </Link>
        </div>

        {/* Desktop Navigation Links:
            1. Home, 2. Banks, 3. Loans, 4. Credit Cards, 5. Our Services, 
            6. EMI Calculator, 7. CIBIL, 8. Resources, 9. About Us, 10. Contact Us */}
        <nav className={styles.navMenu}>
          {/* 1. Home */}
          <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}>
            Home
          </Link>

          {/* 2. Banks */}
          <Link href="/banks" className={`${styles.navLink} ${pathname.startsWith('/banks') ? styles.navLinkActive : ''}`}>
            Banks
          </Link>

          {/* 3. Loans with Rich Vertical Translucent Dropdown */}
          <div
            className={styles.dropdownWrap}
            onMouseEnter={() => setLoansDropdownOpen(true)}
            onMouseLeave={() => setLoansDropdownOpen(false)}
          >
            <Link
              href="/services"
              className={`${styles.navLink} ${loansDropdownOpen || pathname.startsWith('/loans') ? styles.navLinkHovered : ''}`}
            >
              Loans
              <svg className={`${styles.chevron} ${loansDropdownOpen ? styles.chevronRotated : ''}`} width="9" height="5" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* Vertical Translucent Loans Dropdown Menu */}
            {loansDropdownOpen && (
              <div className={styles.loansDropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownHeaderTitle}>Loan Categories</span>
                  <span className={styles.dropdownHeaderSubtitle}>Explore all collateral-free and mortgage loan offerings</span>
                </div>
                <div className={styles.loanItemsGrid}>
                  {loanSubSections.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={styles.loanDropdownCard}
                      onClick={() => setLoansDropdownOpen(false)}
                    >
                      <div
                        className={styles.loanCardIcon}
                        style={{ backgroundColor: item.bg }}
                      >
                        {item.icon}
                      </div>
                      <div className={styles.loanCardDetails}>
                        <div className={styles.loanCardNameRow}>
                          <span className={styles.loanCardName}>{item.name}</span>
                          <span className={styles.loanCardTag} style={{ color: item.color, backgroundColor: item.bg }}>
                            {item.tag}
                          </span>
                        </div>
                        <span className={styles.loanCardDesc}>{item.desc}</span>
                      </div>
                      <svg className={styles.arrowIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
                <div className={styles.dropdownFooter}>
                  <Link href="/services" className={styles.viewAllLoansLink} onClick={() => setLoansDropdownOpen(false)}>
                    View All 6 Loan Products &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 4. Credit Cards */}
          <Link href="/credit-cards" className={`${styles.navLink} ${pathname.startsWith('/credit-cards') ? styles.navLinkActive : ''}`}>
            Credit Cards
          </Link>

          {/* 5. Our Services with Rich Vertical Translucent Dropdown */}
          <div
            className={styles.dropdownWrap}
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => {
              setServicesDropdownOpen(false);
              setServicesLoansSubmenuOpen(false);
            }}
          >
            <Link
              href="/services"
              className={`${styles.navLink} ${servicesDropdownOpen || pathname.startsWith('/services') ? styles.navLinkHovered : ''}`}
            >
              Our Services
              <svg className={`${styles.chevron} ${servicesDropdownOpen ? styles.chevronRotated : ''}`} width="9" height="5" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* Vertical Translucent Services Dropdown */}
            {servicesDropdownOpen && (
              <div className={styles.servicesDropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownHeaderTitle}>All Services</span>
                  <span className={styles.dropdownHeaderSubtitle}>Comprehensive suite of financial products and solutions</span>
                </div>
                <div className={styles.loanItemsGrid}>
                  {servicesSubSections.map((item) => {
                    if (item.hasDropdown) {
                      return (
                        <div
                          key={item.id}
                          className={styles.nestedDropdownItemWrap}
                          onMouseEnter={() => setServicesLoansSubmenuOpen(true)}
                          onMouseLeave={() => setServicesLoansSubmenuOpen(false)}
                        >
                          <div
                            className={`${styles.loanDropdownCard} ${servicesLoansSubmenuOpen ? styles.submenuActiveCard : ''}`}
                            onClick={() => setServicesLoansSubmenuOpen(!servicesLoansSubmenuOpen)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div
                              className={styles.loanCardIcon}
                              style={{ backgroundColor: item.bg }}
                            >
                              {item.icon}
                            </div>
                            <div className={styles.loanCardDetails}>
                              <div className={styles.loanCardNameRow}>
                                <span className={styles.loanCardName}>{item.name}</span>
                                <span className={styles.loanCardTag} style={{ color: item.color, backgroundColor: item.bg }}>
                                  {item.tag}
                                </span>
                              </div>
                              <span className={styles.loanCardDesc}>{item.desc}</span>
                            </div>
                            <svg className={`${styles.nestedChevron} ${servicesLoansSubmenuOpen ? styles.nestedChevronActive : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </div>

                          {/* Secondary Nested Loans Dropdown Menu */}
                          {servicesLoansSubmenuOpen && (
                            <div className={styles.nestedLoansFlyout}>
                              <div className={styles.dropdownHeader}>
                                <span className={styles.dropdownHeaderTitle}>Loans &amp; Financing</span>
                                <span className={styles.dropdownHeaderSubtitle}>Available under Our Services</span>
                              </div>
                              <div className={styles.loanItemsGrid}>
                                {ourServicesLoansSubSections.map((loanSub) => (
                                  <Link
                                    key={loanSub.id}
                                    href={loanSub.href}
                                    className={styles.loanDropdownCard}
                                    onClick={() => {
                                      setServicesLoansSubmenuOpen(false);
                                      setServicesDropdownOpen(false);
                                    }}
                                  >
                                    <div
                                      className={styles.loanCardIcon}
                                      style={{ backgroundColor: loanSub.bg }}
                                    >
                                      {loanSub.icon}
                                    </div>
                                    <div className={styles.loanCardDetails}>
                                      <div className={styles.loanCardNameRow}>
                                        <span className={styles.loanCardName}>{loanSub.name}</span>
                                        <span className={styles.loanCardTag} style={{ color: loanSub.color, backgroundColor: loanSub.bg }}>
                                          {loanSub.tag}
                                        </span>
                                      </div>
                                      <span className={styles.loanCardDesc}>{loanSub.desc}</span>
                                    </div>
                                    <svg className={styles.arrowIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                  </Link>
                                ))}
                              </div>
                              <div className={styles.dropdownFooter}>
                                <Link href="/services" className={styles.viewAllLoansLink} onClick={() => { setServicesLoansSubmenuOpen(false); setServicesDropdownOpen(false); }}>
                                  View All 6 Loan Products &rarr;
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={styles.loanDropdownCard}
                        onClick={() => setServicesDropdownOpen(false)}
                      >
                        <div
                          className={styles.loanCardIcon}
                          style={{ backgroundColor: item.bg }}
                        >
                          {item.icon}
                        </div>
                        <div className={styles.loanCardDetails}>
                          <div className={styles.loanCardNameRow}>
                            <span className={styles.loanCardName}>{item.name}</span>
                            <span className={styles.loanCardTag} style={{ color: item.color, backgroundColor: item.bg }}>
                              {item.tag}
                            </span>
                          </div>
                          <span className={styles.loanCardDesc}>{item.desc}</span>
                        </div>
                        <svg className={styles.arrowIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    );
                  })}
                </div>
                <div className={styles.dropdownFooter}>
                  <Link href="/services" className={styles.viewAllLoansLink} onClick={() => setServicesDropdownOpen(false)}>
                    See all 15 services &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 6. EMI Calculator with Dropdown */}
          <div
            className={styles.dropdownWrap}
            onMouseEnter={() => setEmiDropdownOpen(true)}
            onMouseLeave={() => setEmiDropdownOpen(false)}
          >
            <Link
              href="/emi-calculator"
              className={`${styles.navLink} ${emiDropdownOpen || isEmiActive ? styles.navLinkHovered : ''} ${isEmiActive ? styles.navLinkActive : ''}`}
            >
              EMI Calculator
              <svg className={`${styles.chevron} ${emiDropdownOpen ? styles.chevronRotated : ''}`} width="9" height="5" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* Vertical Translucent EMI Calculator Dropdown */}
            {emiDropdownOpen && (
              <div className={styles.emiDropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownHeaderTitle}>EMI &amp; Loan Calculators</span>
                  <span className={styles.dropdownHeaderSubtitle}>Estimate EMIs, amortization &amp; eligibility instantly</span>
                </div>
                <div className={styles.loanItemsGrid}>
                  {emiCalculatorSubSections.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={styles.loanDropdownCard}
                      onClick={() => setEmiDropdownOpen(false)}
                    >
                      <div
                        className={styles.loanCardIcon}
                        style={{ backgroundColor: item.bg }}
                      >
                        {item.icon}
                      </div>
                      <div className={styles.loanCardDetails}>
                        <div className={styles.loanCardNameRow}>
                          <span className={styles.loanCardName}>{item.name}</span>
                          <span className={styles.loanCardTag} style={{ color: item.color, backgroundColor: item.bg }}>
                            {item.tag}
                          </span>
                        </div>
                        <span className={styles.loanCardDesc}>{item.desc}</span>
                      </div>
                      <svg className={styles.arrowIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
                <div className={styles.dropdownFooter}>
                  <Link href="/calculators" className={styles.viewAllLoansLink} onClick={() => setEmiDropdownOpen(false)}>
                    View All Financial Calculators &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 7. CIBIL */}
          <Link href="/cibil" className={`${styles.navLink} ${pathname.startsWith('/cibil') ? styles.navLinkActive : ''}`}>
            CIBIL
          </Link>

          {/* 8. Resources with Sub-sections Dropdown */}
          <div
            className={styles.dropdownWrap}
            onMouseEnter={() => setResourcesDropdownOpen(true)}
            onMouseLeave={() => setResourcesDropdownOpen(false)}
          >
            <Link
              href="/blog"
              className={`${styles.navLink} ${resourcesDropdownOpen ? styles.navLinkHovered : ''}`}
            >
              Resources
              <svg className={`${styles.chevron} ${resourcesDropdownOpen ? styles.chevronRotated : ''}`} width="9" height="5" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* Vertical Translucent Resources Dropdown */}
            {resourcesDropdownOpen && (
              <div className={styles.resourcesDropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownHeaderTitle}>Resources &amp; Tools</span>
                  <span className={styles.dropdownHeaderSubtitle}>Official knowledge base &amp; partner materials</span>
                </div>
                <div className={styles.loanItemsGrid}>
                  {resourcesSubSections.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={styles.loanDropdownCard}
                      onClick={() => setResourcesDropdownOpen(false)}
                    >
                      <div
                        className={styles.loanCardIcon}
                        style={{ backgroundColor: item.bg }}
                      >
                        {item.icon}
                      </div>
                      <div className={styles.loanCardDetails}>
                        <div className={styles.loanCardNameRow}>
                          <span className={styles.loanCardName}>{item.name}</span>
                          <span className={styles.loanCardTag} style={{ color: item.color, backgroundColor: item.bg }}>
                            {item.tag}
                          </span>
                        </div>
                        <span className={styles.loanCardDesc}>{item.desc}</span>
                      </div>
                      <svg className={styles.arrowIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
                <div className={styles.dropdownFooter}>
                  <Link href="/blog" className={styles.viewAllLoansLink} onClick={() => setResourcesDropdownOpen(false)}>
                    Explore All Knowledge Resources &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 9. About Us */}
          <Link href="/about" className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`}>
            About Us
          </Link>

          {/* 10. Contact Us */}
          <Link href="/contact" className={`${styles.navLink} ${pathname === '/contact' ? styles.navLinkActive : ''}`}>
            Contact Us
          </Link>
        </nav>

        {/* Right Action Items:
            11. Support, 12. Login/Profile, 13. Check Eligibility, 14. Become a Partner */}
        <div className={styles.rightActions}>
          {/* 11. Support */}
          <a href="tel:+91 9389119399" className={styles.supportBox} title="Call Support">
            <div className={styles.supportIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b1668" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            </div>
            <div className={styles.supportText}>
              <span className={styles.supportLabel}>Support</span>
              <span className={styles.supportNumber}>+91 9389119399</span>
            </div>
          </a>

          {/* 12. Authentication / Profile */}
          {user ? (
            <div className={styles.authContainer} ref={profileRef}>
              {/* Notification Bell */}
              <Link href="/dashboard" className={styles.notifBtn} title="Notifications">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount}</span>}
              </Link>

              {/* Profile Avatar & Dropdown */}
              <div className={styles.profileWrap}>
                <button
                  className={styles.profileAvatarBtn}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className={styles.avatarCircle}>
                    {userProfile?.avatar ? (
                      <img src={userProfile.avatar} alt="Avatar" />
                    ) : (
                      (userProfile?.full_name || user?.email || 'U').charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className={styles.profileName}>
                    {userProfile?.full_name || 'My Account'}
                  </span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {profileDropdownOpen && (
                  <div className={styles.profileDropdown}>
                    <div className={styles.profileDropdownHeader}>
                      <div className={styles.profileDropdownName}>{userProfile?.full_name || user?.email}</div>
                      <div className={styles.profileDropdownRole}>{userRole || 'Partner'}</div>
                    </div>
                    <Link
                      href="/dashboard"
                      className={styles.profileDropdownItem}
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                        className={styles.profileDropdownItem}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      className={`${styles.profileDropdownItem} ${styles.logoutBtn}`}
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link href="/login" className={styles.loginLink}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0b1668" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Login</span>
            </Link>
          )}

          {/* 13. Check Eligibility Button */}
          <Link href="/check" className={styles.btnBlue}>
            Check Eligibility
          </Link>

          {/* 14. Become a Partner Button */}
          <Link href="/signup?role=agent" className={styles.btnGreen}>
            Become a Partner
          </Link>

          {/* Mobile Hamburger toggle */}
          <button
            className={`${styles.hamburgerBtn} ${mobileMenuOpen ? styles.hamburgerActive : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.mobileDrawerOpen : ''}`}>
        <div className={styles.mobileNavLinks}>
          {/* 1. Home */}
          <Link href="/" className={`${styles.mobileNavLink} ${pathname === '/' ? styles.mobileNavActive : ''}`} onClick={closeMobileMenu}>
            Home
          </Link>

          {/* 2. Banks */}
          <Link href="/banks" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            Banks
          </Link>

          {/* 3. Loans with Accordion Sub-sections */}
          <div className={styles.mobileAccordionWrap}>
            <div
              className={styles.mobileAccordionHeader}
              onClick={() => setMobileLoansOpen(!mobileLoansOpen)}
            >
              <span className={styles.mobileNavLinkInner}>Loans</span>
              <svg
                className={`${styles.mobileChevron} ${mobileLoansOpen ? styles.mobileChevronOpen : ''}`}
                width="12"
                height="8"
                viewBox="0 0 10 6"
                fill="none"
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Mobile Loans Sub-sections Dropdown List */}
            {mobileLoansOpen && (
              <div className={styles.mobileSubList}>
                {loanSubSections.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={styles.mobileSubItem}
                    onClick={closeMobileMenu}
                  >
                    <div className={styles.mobileSubIcon} style={{ backgroundColor: item.bg }}>
                      {item.icon}
                    </div>
                    <div className={styles.mobileSubItemInfo}>
                      <span className={styles.mobileSubItemName}>{item.name}</span>
                      <span className={styles.mobileSubItemDesc}>{item.desc}</span>
                    </div>
                    <span className={styles.mobileSubItemTag} style={{ color: item.color, backgroundColor: item.bg }}>
                      {item.tag}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/services"
                  className={styles.mobileSeeAllLink}
                  onClick={closeMobileMenu}
                >
                  View All 6 Loan Products &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* 4. Credit Cards */}
          <Link href="/credit-cards" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            Credit Cards
          </Link>

          {/* 5. Our Services with Accordion Sub-sections */}
          <div className={styles.mobileAccordionWrap}>
            <div
              className={styles.mobileAccordionHeader}
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            >
              <span className={styles.mobileNavLinkInner}>Our Services</span>
              <svg
                className={`${styles.mobileChevron} ${mobileServicesOpen ? styles.mobileChevronOpen : ''}`}
                width="12"
                height="8"
                viewBox="0 0 10 6"
                fill="none"
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Mobile Services Sub-sections Dropdown List */}
            {mobileServicesOpen && (
              <div className={styles.mobileSubList}>
                {servicesSubSections.map((item) => {
                  if (item.hasDropdown) {
                    return (
                      <div key={item.id} className={styles.mobileDeepAccordionWrap}>
                        <div
                          className={styles.mobileDeepAccordionHeader}
                          onClick={() => setMobileServicesLoansOpen(!mobileServicesLoansOpen)}
                        >
                          <div className={styles.mobileDeepHeaderLeft}>
                            <div className={styles.mobileSubIcon} style={{ backgroundColor: item.bg }}>
                              {item.icon}
                            </div>
                            <span className={styles.mobileSubItemName}>{item.name}</span>
                          </div>
                          <svg
                            className={`${styles.mobileChevron} ${mobileServicesLoansOpen ? styles.mobileChevronOpen : ''}`}
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                          >
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>

                        {/* Mobile Loans Sub-list under Our Services */}
                        {mobileServicesLoansOpen && (
                          <div className={styles.mobileDeepSubList}>
                            {ourServicesLoansSubSections.map((loanSub) => (
                              <Link
                                key={loanSub.id}
                                href={loanSub.href}
                                className={styles.mobileDeepSubItem}
                                onClick={closeMobileMenu}
                              >
                                <div className={styles.mobileSubIcon} style={{ backgroundColor: loanSub.bg }}>
                                  {loanSub.icon}
                                </div>
                                <div className={styles.mobileSubItemInfo}>
                                  <span className={styles.mobileSubItemName}>{loanSub.name}</span>
                                  <span className={styles.mobileSubItemDesc}>{loanSub.desc}</span>
                                </div>
                                <span className={styles.mobileSubItemTag} style={{ color: loanSub.color, backgroundColor: loanSub.bg }}>
                                  {loanSub.tag}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={styles.mobileSubItem}
                      onClick={closeMobileMenu}
                    >
                      <div className={styles.mobileSubIcon} style={{ backgroundColor: item.bg }}>
                        {item.icon}
                      </div>
                      <div className={styles.mobileSubItemInfo}>
                        <span className={styles.mobileSubItemName}>{item.name}</span>
                        <span className={styles.mobileSubItemDesc}>{item.desc}</span>
                      </div>
                      <span className={styles.mobileSubItemTag} style={{ color: item.color, backgroundColor: item.bg }}>
                        {item.tag}
                      </span>
                    </Link>
                  );
                })}
                <Link
                  href="/services"
                  className={styles.mobileSeeAllLink}
                  onClick={closeMobileMenu}
                >
                  See all 15 services &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* 6. EMI Calculator with Accordion Sub-sections */}
          <div className={styles.mobileAccordionWrap}>
            <div
              className={styles.mobileAccordionHeader}
              onClick={() => setMobileEmiOpen(!mobileEmiOpen)}
            >
              <span className={`${styles.mobileNavLinkInner} ${isEmiActive ? styles.mobileNavActive : ''}`}>EMI Calculator</span>
              <svg
                className={`${styles.mobileChevron} ${mobileEmiOpen ? styles.mobileChevronOpen : ''}`}
                width="12"
                height="8"
                viewBox="0 0 10 6"
                fill="none"
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Mobile EMI Calculator Sub-sections Dropdown List */}
            {mobileEmiOpen && (
              <div className={styles.mobileSubList}>
                {emiCalculatorSubSections.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={styles.mobileSubItem}
                    onClick={closeMobileMenu}
                  >
                    <div className={styles.mobileSubIcon} style={{ backgroundColor: item.bg }}>
                      {item.icon}
                    </div>
                    <div className={styles.mobileSubItemInfo}>
                      <span className={styles.mobileSubItemName}>{item.name}</span>
                      <span className={styles.mobileSubItemDesc}>{item.desc}</span>
                    </div>
                    <span className={styles.mobileSubItemTag} style={{ color: item.color, backgroundColor: item.bg }}>
                      {item.tag}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/calculators"
                  className={styles.mobileSeeAllLink}
                  onClick={closeMobileMenu}
                >
                  View All Financial Calculators &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* 7. CIBIL */}
          <Link href="/cibil" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            CIBIL
          </Link>

          {/* 8. Resources with Accordion Sub-sections */}
          <div className={styles.mobileAccordionWrap}>
            <div
              className={styles.mobileAccordionHeader}
              onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
            >
              <span className={styles.mobileNavLinkInner}>Resources</span>
              <svg
                className={`${styles.mobileChevron} ${mobileResourcesOpen ? styles.mobileChevronOpen : ''}`}
                width="12"
                height="8"
                viewBox="0 0 10 6"
                fill="none"
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Mobile Resources Sub-sections Dropdown List */}
            {mobileResourcesOpen && (
              <div className={styles.mobileSubList}>
                {resourcesSubSections.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={styles.mobileSubItem}
                    onClick={closeMobileMenu}
                  >
                    <div className={styles.mobileSubIcon} style={{ backgroundColor: item.bg }}>
                      {item.icon}
                    </div>
                    <div className={styles.mobileSubItemInfo}>
                      <span className={styles.mobileSubItemName}>{item.name}</span>
                      <span className={styles.mobileSubItemDesc}>{item.desc}</span>
                    </div>
                    <span className={styles.mobileSubItemTag} style={{ color: item.color, backgroundColor: item.bg }}>
                      {item.tag}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/blog"
                  className={styles.mobileSeeAllLink}
                  onClick={closeMobileMenu}
                >
                  See all resources &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* 9. About Us */}
          <Link href="/about" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            About Us
          </Link>

          {/* 10. Contact Us */}
          <Link href="/contact" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            Contact Us
          </Link>
        </div>

        {/* Mobile Footer Actions (11. Support, 12. Login/Profile, 13. Check Eligibility, 14. Become a Partner) */}
        <div className={styles.mobileFooterActions}>
          {/* 11. Support */}
          <a href="tel:+91 9389119399" className={styles.mobileSupportBox} onClick={closeMobileMenu}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0068fb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
            </svg>
            <div className={styles.mobileSupportText}>
              <span className={styles.mobileSupportLabel}>Support</span>
              <span className={styles.mobileSupportPhone}>+91 9389119399</span>
            </div>
          </a>

          {/* 12. Login / Dashboard */}
          {user ? (
            <Link href="/dashboard" className={styles.mobileLoginRow} onClick={closeMobileMenu}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b1668" strokeWidth="2.2">
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
              <span>Go to Partner Dashboard ({userProfile?.full_name || 'My Account'})</span>
            </Link>
          ) : (
            <Link href="/login" className={styles.mobileLoginRow} onClick={closeMobileMenu}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b1668" strokeWidth="2.2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Login to Customer Portal</span>
            </Link>
          )}

          {/* 13. Check Eligibility & 14. Become a Partner */}
          <div className={styles.mobileButtonsRow}>
            <Link href="/check" className={styles.mobileBtnBlue} onClick={closeMobileMenu}>
              Check Eligibility
            </Link>
            <Link href="/signup?role=agent" className={styles.mobileBtnGreen} onClick={closeMobileMenu}>
              Become a Partner
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
