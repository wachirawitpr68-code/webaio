import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";
import NetworkBackground from "../components/NetworkBackground";
import { LanguageProvider } from "../context/LanguageContext";

const prompt = Prompt({ 
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: '--font-prompt',
});

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
    <html lang="th" className={prompt.variable}>
      <body className={prompt.className}>
        <LanguageProvider>
          <Preloader />
          <NetworkBackground />
          <Navigation />
          <main className={styles.mainContent}>
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
