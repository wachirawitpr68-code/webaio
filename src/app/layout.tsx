import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "AIO LAB - Research Website",
  description: "Welcome to AIO LAB, where we build the future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className={styles.navbar}>
          <div className={styles.navContainer}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoTriangle}>&#9651;</span>
              <span className={styles.logoLine}>|</span>
              <span className={styles.logoCircle}>&#9675;</span>
              <span className={styles.logoText}>LAB</span>
            </Link>
            <div className={styles.navLinks}>
              <Link href="/">Home</Link>
              <Link href="/researchers">Researchers</Link>
              <Link href="/news">News</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </nav>
        <main className={styles.mainContent}>
          {children}
        </main>
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>&copy; {new Date().getFullYear()} AIO LAB. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
