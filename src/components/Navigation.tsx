"use client";

import Link from "next/link";
import styles from "../app/layout.module.css";
import { useLanguage } from "../context/LanguageContext";

export default function Navigation() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <img src="/ubu-logo.png" alt="Ubon Ratchathani University" className={styles.uniLogo} />
          <img src="/eng-ubu-logo.png" alt="Faculty of Engineering UBU" className={styles.uniLogo} />
          <div className={styles.aioLogo}>
            <span className={styles.logoTriangle}>&#9651;</span>
            <span className={styles.logoLine}>|</span>
            <span className={styles.logoCircle}>&#9675;</span>
            <span className={styles.logoText}>LAB</span>
          </div>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/">{t('nav.home')}</Link>
          <Link href="/researchers">{t('nav.researchers')}</Link>
          <Link href="/news">{t('nav.news')}</Link>
          <Link href="/contact">{t('nav.contact')}</Link>
          <Link href="/admin" className={styles.adminLink}>{t('nav.admin')}</Link>
          
          <button 
            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            style={{ 
              background: 'transparent', 
              color: 'var(--color-primary-yellow)', 
              border: '1px solid var(--color-primary-yellow)', 
              borderRadius: '4px', 
              padding: '2px 8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              marginLeft: '1rem'
            }}
          >
            {language === 'th' ? 'EN' : 'TH'}
          </button>
        </div>
      </div>
    </nav>
  );
}
