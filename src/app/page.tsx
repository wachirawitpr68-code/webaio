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
      <section className={styles.sectionLight}>
        <div className="container">
          <div className={styles.grid2Col}>
            <div className={styles.aboutText}>
              <h2 className={styles.sectionTitle}>{t('about.title')}</h2>
              <p>{t('about.desc')}</p>
            </div>
            <div className={`${styles.cardBase} ${styles.cardDirector}`}>
              <div className={styles.directorRole}>{t('director.role')}</div>
              <div className={styles.directorName}>{t('director.name')}</div>
              <div className={styles.directorTitle}>{t('director.title')}</div>
              <div className={styles.expertiseTitle}>{t('director.expertise')}</div>
              <ul className={styles.expertiseList}>
                <li>{t('director.expertise.1')}</li>
                <li>{t('director.expertise.2')}</li>
                <li>{t('director.expertise.3')}</li>
                <li>{t('director.expertise.4')}</li>
                <li>{t('director.expertise.5')}</li>
                <li>{t('director.expertise.6')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid2Col}>
            <div className={`${styles.cardBase} ${styles.cardVision}`}>
              <h3>{t('vision.title')}</h3>
              <p style={{ color: 'var(--color-secondary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                {t('vision.desc')}
              </p>
            </div>
            <div className={`${styles.cardBase} ${styles.cardMission}`}>
              <h3>{t('mission.title')}</h3>
              <ul className={styles.missionList}>
                <li>{t('mission.1')}</li>
                <li>{t('mission.2')}</li>
                <li>{t('mission.3')}</li>
                <li>{t('mission.4')}</li>
                <li>{t('mission.5')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Research Domains */}
      <section className={styles.sectionLight}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{t('domains.title')}</h2>
          <p className={styles.sectionSubtitle}>{t('domains.subtitle')}</p>
          
          <div className={styles.domainsGrid}>
            <div className={`${styles.domainCard} ${styles.domainCardRed} ${styles.domainWide}`}>
              <div className={styles.domainIconTitle}>
                <span className={styles.domainIcon}>🩺</span>
                <span>{t('domain.1.title')}</span>
              </div>
              <p className={styles.domainDesc}>{t('domain.1.desc')}</p>
              <ul className={styles.domainList}>
                <li>{t('domain.1.bullet.1')}</li>
                <li>{t('domain.1.bullet.2')}</li>
                <li>{t('domain.1.bullet.3')}</li>
              </ul>
            </div>

            <div className={`${styles.domainCard} ${styles.domainCardOrange}`}>
              <div className={styles.domainIconTitle}>
                <span className={styles.domainIcon}>🌱</span>
                <span>{t('domain.2.title')}</span>
              </div>
              <p className={styles.domainDesc}>{t('domain.2.desc')}</p>
              <ul className={styles.domainList}>
                <li>{t('domain.2.bullet.1')}</li>
                <li>{t('domain.2.bullet.2')}</li>
                <li>{t('domain.2.bullet.3')}</li>
              </ul>
            </div>

            <div className={`${styles.domainCard} ${styles.domainCardBlue}`}>
              <div className={styles.domainIconTitle}>
                <span className={styles.domainIcon}>🐟</span>
                <span>{t('domain.3.title')}</span>
              </div>
              <p className={styles.domainDesc}>{t('domain.3.desc')}</p>
              <ul className={styles.domainList}>
                <li>{t('domain.3.bullet.1')}</li>
                <li>{t('domain.3.bullet.2')}</li>
                <li>{t('domain.3.bullet.3')}</li>
              </ul>
            </div>

            <div className={`${styles.domainCard} ${styles.domainCardRed} ${styles.domainWide}`}>
              <div className={styles.domainIconTitle}>
                <span className={styles.domainIcon}>🎓</span>
                <span>{t('domain.4.title')}</span>
              </div>
              <p className={styles.domainDesc}>{t('domain.4.desc')}</p>
              <ul className={styles.domainList}>
                <li>{t('domain.4.bullet.1')}</li>
                <li>{t('domain.4.bullet.2')}</li>
                <li>{t('domain.4.bullet.3')}</li>
              </ul>
            </div>

            <div className={`${styles.domainCard} ${styles.domainCardOrange} ${styles.domainFull}`}>
              <div className={styles.domainIconTitle}>
                <span className={styles.domainIcon}>📊</span>
                <span>{t('domain.5.title')}</span>
              </div>
              <p className={styles.domainDesc}>{t('domain.5.desc')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                <ul className={styles.domainList} style={{ flex: 1, minWidth: '200px' }}>
                  <li>{t('domain.5.bullet.1')}</li>
                </ul>
                <ul className={styles.domainList} style={{ flex: 1, minWidth: '200px' }}>
                  <li>{t('domain.5.bullet.2')}</li>
                </ul>
                <ul className={styles.domainList} style={{ flex: 1, minWidth: '200px' }}>
                  <li>{t('domain.5.bullet.3')}</li>
                </ul>
              </div>
            </div>

            <div className={`${styles.domainCard} ${styles.domainCardBlue} ${styles.domainWide}`}>
              <div className={styles.domainIconTitle}>
                <span className={styles.domainIcon}>🚚</span>
                <span>{t('domain.6.title')}</span>
              </div>
              <p className={styles.domainDesc}>{t('domain.6.desc')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                <ul className={styles.domainList} style={{ flex: 1, minWidth: '200px' }}>
                  <li>{t('domain.6.bullet.1')}</li>
                  <li>{t('domain.6.bullet.3')}</li>
                </ul>
                <ul className={styles.domainList} style={{ flex: 1, minWidth: '200px' }}>
                  <li>{t('domain.6.bullet.2')}</li>
                </ul>
              </div>
            </div>

            <div className={`${styles.domainCard} ${styles.domainCardBlue}`}>
              <div className={styles.domainIconTitle}>
                <span className={styles.domainIcon}>🌐</span>
                <span>{t('domain.7.title')}</span>
              </div>
              <p className={styles.domainDesc}>{t('domain.7.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech & Innovations */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid2Col}>
            <div>
              <h2 className={styles.sectionTitle}>{t('tech.title')}</h2>
              <p className={styles.sectionSubtitle}>{t('tech.subtitle')}</p>
              <div className={styles.chipContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div key={i} className={styles.chip}>{t(`tech.${i}`)}</div>
                ))}
              </div>
            </div>
            <div>
              <h2 className={styles.sectionTitle}>{t('innovations.title')}</h2>
              <p className={styles.sectionSubtitle} style={{ visibility: 'hidden' }}>-</p>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.innoCard}>
                  <div className={styles.innoTitle}>{t(`inno.${i}.title`)}</div>
                  <div className={styles.innoDesc}>{t(`inno.${i}.desc`)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Banner */}
      <section className={styles.statsBanner}>
        <div className="container">
          <div className={styles.statsGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statValue}>{t(`stats.${i}.value`)}</div>
                <div className={styles.statLabel}>{t(`stats.${i}.label`)}</div>
                <div className={styles.statDesc}>{t(`stats.${i}.desc`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible AI */}
      <section className={styles.sectionLight}>
        <div className="container">
          <div className={styles.responsibleCard}>
            <h2>{t('responsible.title')}</h2>
            <p>{t('responsible.desc')}</p>
            <div className={styles.respList}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={styles.respItem}>{t(`responsible.${i}`)}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
