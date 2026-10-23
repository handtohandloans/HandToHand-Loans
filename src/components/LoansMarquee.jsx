'use client';

import React from 'react';
import Link from 'next/link';
import styles from './LoansMarquee.module.css';

/* 8 Sliding Loan Categories (Personal, Business, Home, Car, Two Wheeler, Gold, LAP, Credit Card) */
const loanCategories = [
  {
    id: 'personal',
    name: 'Personal Loan',
    href: '/services/personal-loan',
    textColor: '#15803d',
    bgColor: '#e8f5e9',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="20" rx="4" fill="#1b8744" />
        <circle cx="16" cy="16" r="5" fill="#ffffff" />
        <text x="16" y="19" fontSize="9" fontWeight="bold" fill="#1b8744" textAnchor="middle">₹</text>
      </svg>
    ),
  },
  {
    id: 'business',
    name: 'Business Loan',
    href: '/services/business-loan',
    textColor: '#1d4ed8',
    bgColor: '#e3f2fd',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path d="M6 26V10L14 6V26H6Z" fill="#1976d2" />
        <path d="M14 26V12L22 8V26H14Z" fill="#2196f3" />
        <path d="M22 26V16L26 14V26H22Z" fill="#64b5f6" />
        <rect x="8" y="13" width="3" height="3" fill="#ffffff" />
        <rect x="8" y="18" width="3" height="3" fill="#ffffff" />
        <rect x="16" y="14" width="3" height="3" fill="#ffffff" />
        <rect x="16" y="19" width="3" height="3" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'home',
    name: 'Home Loan',
    href: '/services/home-loan',
    textColor: '#6d28d9',
    bgColor: '#ede7f6',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path d="M16 5L4 15H8V26H24V15H28L16 5Z" fill="#7e57c2" />
        <path d="M13 26V18H19V26H13Z" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'car',
    name: 'Car Loan',
    href: '/check',
    textColor: '#b91c1c',
    bgColor: '#ffebee',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path d="M6 18L9 9H23L26 18V24H23V22H9V24H6V18Z" fill="#e53935" />
        <circle cx="9.5" cy="18.5" r="2.5" fill="#ffffff" />
        <circle cx="22.5" cy="18.5" r="2.5" fill="#ffffff" />
        <path d="M10 11L8.5 15H23.5L22 11H10Z" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'two-wheeler',
    name: 'Two Wheeler Loan',
    href: '/check',
    textColor: '#0284c7',
    bgColor: '#e1f5fe',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="8" cy="22" r="5" stroke="#0288d1" strokeWidth="2.5" />
        <circle cx="24" cy="22" r="5" stroke="#0288d1" strokeWidth="2.5" />
        <path d="M8 22L14 15L20 15L24 22M14 15L12 9H9M17 11H21" stroke="#0288d1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'gold',
    name: 'Gold Loan',
    href: '/check',
    textColor: '#b45309',
    bgColor: '#fff8e1',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path d="M7 16L12 11H20L17 16H7Z" fill="#fbc02d" />
        <path d="M17 16L20 11H25L22 16H17Z" fill="#f57f17" />
        <path d="M12 21L17 16H25L22 21H12Z" fill="#fbc02d" />
        <path d="M7 21L10 16H15L12 21H7Z" fill="#f57f17" />
      </svg>
    ),
  },
  {
    id: 'lap',
    name: 'Loan Against Property',
    href: '/services/loan-against-property',
    textColor: '#0f766e',
    bgColor: '#e0f2f1',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path d="M6 7H20L26 13V25H6V7Z" fill="#00897b" />
        <path d="M19 7V13H25" fill="#4db6ac" />
        <rect x="10" y="16" width="12" height="2" fill="#ffffff" />
        <rect x="10" y="20" width="8" height="2" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'credit-card',
    name: 'Credit Card',
    href: '/credit-cards',
    textColor: '#be185d',
    bgColor: '#fce4ec',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="16" rx="3" fill="#d81b60" />
        <rect x="4" y="12" width="24" height="4" fill="#880e4f" />
        <rect x="7" y="19" width="5" height="2" fill="#ffffff" />
      </svg>
    ),
  },
];

/* Permanently Fixed "View All Loans" item (NOT duplicated, NOT part of sliding track) */
const viewAllCategory = {
  id: 'view-all',
  name: 'View All Loans',
  href: '/services',
  textColor: '#0068fb',
  bgColor: '#e8f0fe',
  icon: (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect x="6" y="6" width="8" height="8" rx="2.5" fill="#0068fb" />
      <rect x="18" y="6" width="8" height="8" rx="2.5" fill="#0068fb" />
      <rect x="6" y="18" width="8" height="8" rx="2.5" fill="#0068fb" />
      <rect x="18" y="18" width="8" height="8" rx="2.5" fill="#0068fb" />
    </svg>
  ),
};

// Triplicate only the 8 sliding categories for seamless infinite loop (no duplicates of View All)
const marqueeItems = [...loanCategories, ...loanCategories, ...loanCategories];

export default function LoansMarquee() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.carouselContainer}>
        {/* Continuous sliding track within the available space before the fixed button */}
        <div className={styles.scrollArea}>
          <div className={styles.track}>
            {marqueeItems.map((cat, idx) => (
              <Link
                key={`${cat.id}-${idx}`}
                href={cat.href || '/services'}
                className={styles.tile}
              >
                <div
                  className={styles.iconBox}
                  style={{ backgroundColor: cat.bgColor }}
                >
                  {cat.icon}
                </div>
                <span className={styles.tileLabel}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Permanently fixed at extreme right, visible at all times, never moving */}
        <div className={styles.fixedActionWrapper}>
          <Link
            href={viewAllCategory.href}
            className={`${styles.tile} ${styles.fixedTile}`}
            title="View All Loans"
          >
            <div
              className={styles.iconBox}
              style={{ backgroundColor: viewAllCategory.bgColor }}
            >
              {viewAllCategory.icon}
            </div>
            <span className={`${styles.tileLabel} ${styles.fixedTileLabel}`}>
              {viewAllCategory.name}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
