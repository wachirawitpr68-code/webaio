"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../app/layout.module.css";
import { useLanguage } from "../context/LanguageContext";

export default function Navigation() {
  const { t, language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <img src="/ubu-logo.png" alt="Ubon Ratchathani University" className={styles.uniLogo} />
          <img src="/eng-ubu-logo.png" alt="Faculty of Engineering UBU" className={styles.uniLogo} />
          <div className={styles.aioLogo}>
            <span className={styles.logoTriangle}>&#9651;</span>
            <span className={styles.logoLine}>|</span>
            <span className={styles.logoCircle}>&#9675;</span>
            <span className={styles.logoText}>LAB</span>
          </div>
        </Link>
        
        {/* Hamburger Icon (visible on mobile) */}
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          <Link href="/" onClick={closeMenu}>{t('nav.home')}</Link>
          <Link href="/researchers" onClick={closeMenu}>{t('nav.researchers')}</Link>
          <Link href="/news" onClick={closeMenu}>{t('nav.news')}</Link>
          <Link href="/contact" onClick={closeMenu}>{t('nav.contact')}</Link>
          <Link href="/admin" className={styles.adminLink} onClick={closeMenu}>{t('nav.admin')}</Link>
          
          <button 
            onClick={() => {
              setLanguage(language === 'th' ? 'en' : 'th');
              closeMenu();
            }}
            className={styles.langToggle}
          >
            {language === 'th' ? 'EN' : 'TH'}
          </button>
        </div>
      </div>
    </nav>
  );
}
