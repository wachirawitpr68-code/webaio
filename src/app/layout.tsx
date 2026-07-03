import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "AIO LAB - มหาวิทยาลัยอุบลราชธานี",
  description: "กลุ่มวิจัย AIO LAB มหาวิทยาลัยอุบลราชธานี นำเสนองานวิจัยและนวัตกรรมใหม่ๆ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
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
              <Link href="/">หน้าแรก</Link>
              <Link href="/researchers">นักวิจัย</Link>
              <Link href="/news">ข่าวสาร</Link>
              <Link href="/contact">ติดต่อเรา</Link>
              <Link href="/admin" className={styles.adminLink}>เข้าสู่ระบบ Admin</Link>
            </div>
          </div>
        </nav>
        <main className={styles.mainContent}>
          {children}
        </main>
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>&copy; {new Date().getFullYear()} AIO LAB มหาวิทยาลัยอุบลราชธานี. สงวนลิขสิทธิ์.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
