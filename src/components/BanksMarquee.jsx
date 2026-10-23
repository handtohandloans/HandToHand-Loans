'use client';

import Link from 'next/link';
import styles from './BanksMarquee.module.css';

const partnerBanks = [
  {
    id: 'bank-hdfc',
    name: 'HDFC Bank',
    src: '/images/bank_hdfc.png',
    alt: 'HDFC Bank',
  },
  {
    id: 'bank-icici',
    name: 'ICICI Bank',
    src: '/images/bank_icici.png',
    alt: 'ICICI Bank',
  },
  {
    id: 'bank-axis',
    name: 'Axis Bank',
    src: '/images/bank_axis.png',
    alt: 'Axis Bank',
  },
  {
    id: 'bank-sbi',
    name: 'SBI Bank',
    src: '/images/bank_sbi.png',
    alt: 'State Bank of India',
  },
  {
    id: 'bank-kotak',
    name: 'Kotak Bank',
    src: '/images/bank_kotak.png',
    alt: 'Kotak Mahindra Bank',
  },
  {
    id: 'bank-bajaj',
    name: 'Bajaj Finserv',
    src: '/images/bank_bajaj.png',
    alt: 'Bajaj Finserv',
  },
  {
    id: 'bank-tata',
    name: 'Tata Capital',
    src: '/images/bank_tata.png',
    alt: 'Tata Capital',
  },
];

// Triplicate the list for a seamless, unbreakable infinite loop
const marqueeBanks = [...partnerBanks, ...partnerBanks, ...partnerBanks];

export default function BanksMarquee() {
  return (
    <div className={styles.bankBar}>
      <div className={styles.carouselContainer}>
        {/* Continuous sliding track within the available space before the fixed button */}
        <div className={styles.scrollArea}>
          <div className={styles.track}>
            {marqueeBanks.map((bank, index) => (
              <Link
                key={`${bank.id}-${index}`}
                href="/banks"
                className={`${styles.tile} ${styles.bankTile}`}
                title={bank.alt || bank.name}
              >
                <div className={styles.logoBox}>
                  <img
                    src={bank.src}
                    alt={bank.alt}
                    className={styles.bankLogoImg}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Permanently fixed at extreme right, matching the View All Loans button dimensions & alignment */}
        <div className={styles.fixedActionWrapper}>
          <Link
            href="/banks"
            className={`${styles.tile} ${styles.fixedTile}`}
            title="View All 50+ Partner Banks & NBFCs"
          >
            <div className={styles.fixedIconBox}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0068fb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2L2 7h20L12 2z" />
              </svg>
            </div>
            <span className={`${styles.tileLabel} ${styles.fixedTileLabel}`}>
              And Many More...
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
