"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  th: {
    'nav.home': 'หน้าแรก',
    'nav.researchers': 'นักวิจัย',
    'nav.news': 'ข่าวสาร',
    'nav.contact': 'ติดต่อเรา',
    'nav.admin': 'เข้าสู่ระบบ Admin',
    'hero.title': 'นวัตกรรม. วิจัย. ค้นพบ.',
    'hero.subtitle': 'ยินดีต้อนรับสู่กลุ่มวิจัย AIO LAB แห่งมหาวิทยาลัยอุบลราชธานี เรามุ่งมั่นพัฒนางานวิจัยและนวัตกรรมใหม่ๆ เพื่อต่อยอดองค์ความรู้ทางวิทยาศาสตร์และเทคโนโลยีสู่สังคม',
    'hero.btn.researchers': 'รู้จักกับนักวิจัยของเรา',
    'hero.btn.news': 'ข่าวสารและกิจกรรม',
    'researchers.title': 'นักวิจัยของเรา',
    'researchers.subtitle': 'ทำความรู้จักกับบุคลากรและทีมนักวิจัยแห่ง AIO LAB มหาวิทยาลัยอุบลราชธานี',
    'researchers.loading': 'กำลังโหลดข้อมูล...',
    'researchers.empty': 'ยังไม่มีข้อมูลนักวิจัย',
    'researchers.scholar': 'ดูผลงานวิจัยบน Google Scholar',
    'footer.copyright': '© 2026 กลุ่มวิจัย AIO LAB มหาวิทยาลัยอุบลราชธานี สงวนลิขสิทธิ์',
  },
  en: {
    'nav.home': 'Home',
    'nav.researchers': 'Researchers',
    'nav.news': 'News',
    'nav.contact': 'Contact Us',
    'nav.admin': 'Admin Login',
    'hero.title': 'Innovation. Research. Discovery.',
    'hero.subtitle': 'Welcome to the AIO LAB research group at Ubon Ratchathani University. We are committed to developing new research and innovations to advance scientific and technological knowledge for society.',
    'hero.btn.researchers': 'Meet Our Researchers',
    'hero.btn.news': 'News & Events',
    'researchers.title': 'Our Researchers',
    'researchers.subtitle': 'Get to know the personnel and research team of AIO LAB, Ubon Ratchathani University',
    'researchers.loading': 'Loading data...',
    'researchers.empty': 'No researchers found',
    'researchers.scholar': 'View research on Google Scholar',
    'footer.copyright': '© 2026 AIO LAB Research Group, Ubon Ratchathani University. All rights reserved.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('th');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('aio_lang') as Language;
    if (savedLang && (savedLang === 'th' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aio_lang', lang);
  };

  const t = (key: string): string => {
    // Avoid hydration mismatch by using TH default before mount if needed
    // But practically, returning the translation string is fine since it's a client component
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={!mounted ? 'invisible' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
