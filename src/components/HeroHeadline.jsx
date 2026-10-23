import React from 'react';
import styles from './HeroHeadline.module.css';

export default function HeroHeadline() {
  return (
    <div className={styles.headlineContainer}>
      <h1 className={styles.mainTitle}>
        <span className={styles.titleHandToHand}>HandToHand</span>{' '}
        <span className={styles.titleLoans}>Loans</span>
      </h1>
      <p className={styles.subTitle}>
        India&apos;s First Smart AI Based Loans &amp; Financial Services Digital Platform
      </p>
    </div>
  );
}
