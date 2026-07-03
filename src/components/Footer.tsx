"use client";

import styles from "../app/layout.module.css";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}
