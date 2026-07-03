import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            <span className={styles.highlightRed}>Innovate.</span>{" "}
            <span className={styles.highlightYellow}>Research.</span>{" "}
            <span className={styles.highlightBlue}>Discover.</span>
          </h1>
          <p className={styles.subtitle}>
            Welcome to AIO LAB. We are a premier research group dedicated to advancing technology and science. 
            Explore our cutting-edge research, meet our experts, and discover our latest activities.
          </p>
          <div className={styles.heroActions}>
            <Link href="/researchers" className="btn btn-primary">
              Meet Our Researchers
            </Link>
            <Link href="/news" className="btn btn-warning">
              Latest News
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.abstractShape1}></div>
          <div className={styles.abstractShape2}></div>
          <div className={styles.abstractShape3}></div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>About AIO LAB</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconRed}>&#9651;</div>
              <h3>Pioneering Research</h3>
              <p>Pushing the boundaries of what is possible with state-of-the-art technology and methodology.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconYellow}>|</div>
              <h3>Expert Team</h3>
              <p>A diverse group of world-class researchers, engineers, and scientists collaborating together.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconBlue}>&#9675;</div>
              <h3>Global Impact</h3>
              <p>Translating academic discoveries into real-world applications that benefit society.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
