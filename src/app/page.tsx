import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            <span className={styles.highlightRed}>นวัตกรรม.</span>{" "}
            <span className={styles.highlightYellow}>วิจัย.</span>{" "}
            <span className={styles.highlightBlue}>ค้นพบ.</span>
          </h1>
          <p className={styles.subtitle}>
            ยินดีต้อนรับสู่กลุ่มวิจัย AIO LAB แห่งมหาวิทยาลัยอุบลราชธานี เรามุ่งมั่นพัฒนางานวิจัยและนวัตกรรมใหม่ๆ 
            เพื่อต่อยอดองค์ความรู้ทางวิทยาศาสตร์และเทคโนโลยีสู่สังคม
          </p>
          <div className={styles.heroActions}>
            <Link href="/researchers" className="btn btn-primary">
              รู้จักกับนักวิจัยของเรา
            </Link>
            <Link href="/news" className="btn btn-warning">
              ข่าวสารและกิจกรรม
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
          <h2 className={styles.sectionTitle}>เกี่ยวกับ AIO LAB</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconRed}>&#9651;</div>
              <h3>งานวิจัยชั้นนำ</h3>
              <p>ผลักดันขีดจำกัดของเทคโนโลยีด้วยระเบียบวิธีวิจัยและนวัตกรรมที่ทันสมัยระดับสากล</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconYellow}>|</div>
              <h3>ทีมผู้เชี่ยวชาญ</h3>
              <p>ศูนย์รวมนักวิจัย คณาจารย์ และนักศึกษาผู้มีวิสัยทัศน์แห่งมหาวิทยาลัยอุบลราชธานี</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconBlue}>&#9675;</div>
              <h3>สร้างผลกระทบต่อสังคม</h3>
              <p>เปลี่ยนการค้นพบทางวิชาการให้เป็นแอปพลิเคชันที่ใช้งานได้จริงและเป็นประโยชน์ต่อสังคม</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
