"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          {/* Subtle Data Visualization / Mesh Pattern */}
          <svg className={styles.meshPattern} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,25 50,50 T100,50" stroke="currentColor" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M0,30 Q30,60 60,30 T100,30" stroke="currentColor" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M0,70 Q40,40 80,70 T100,70" stroke="currentColor" fill="none" vectorEffect="non-scaling-stroke" />
            <circle cx="25" cy="37.5" r="0.5" fill="currentColor" />
            <circle cx="50" cy="50" r="0.5" fill="currentColor" />
            <circle cx="75" cy="62.5" r="0.5" fill="currentColor" />
            <circle cx="30" cy="45" r="0.5" fill="currentColor" />
            <circle cx="60" cy="30" r="0.5" fill="currentColor" />
            <circle cx="80" cy="70" r="0.5" fill="currentColor" />
          </svg>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>AIO LAB @ UBU</div>
          <h1 className={styles.title}>
            {t('hero.title')}
          </h1>
          <p className={styles.subtitle}>
            {t('hero.subtitle')}
          </p>
          <div className={styles.heroActions}>
            <Link href="/researchers" className={`btn ${styles.btnPrimary}`}>
              {t('hero.btn.researchers')}
            </Link>
            <Link href="/news" className={`btn ${styles.btnOutline}`}>
              {t('hero.btn.news')}
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>เกี่ยวกับ AIO LAB</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔬</div>
              <h3>งานวิจัยชั้นนำ</h3>
              <p>ผลักดันขีดจำกัดของเทคโนโลยีด้วยระเบียบวิธีวิจัยและนวัตกรรมที่ทันสมัยระดับสากล</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👥</div>
              <h3>ทีมผู้เชี่ยวชาญ</h3>
              <p>ศูนย์รวมนักวิจัย คณาจารย์ และนักศึกษาผู้มีวิสัยทัศน์แห่งมหาวิทยาลัยอุบลราชธานี</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌍</div>
              <h3>สร้างผลกระทบต่อสังคม</h3>
              <p>เปลี่ยนการค้นพบทางวิชาการให้เป็นแอปพลิเคชันที่ใช้งานได้จริงและเป็นประโยชน์ต่อสังคม</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
