"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useLanguage } from "../../context/LanguageContext";

export default function News() {
  const { t, language } = useLanguage();
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_date', { ascending: false });
        
      if (error) throw error;
      if (data) setNewsList(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '5rem 1rem', maxWidth: '1200px', margin: '0 auto', minHeight: '70vh' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-primary)', textAlign: 'center' }}>{t('news.title')}</h1>
      <p style={{ textAlign: 'center', color: 'var(--color-secondary)', fontSize: '1.2rem', marginBottom: '4rem' }}>{t('news.subtitle')}</p>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>{t('news.loading')}</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gap: '2rem', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}>
          {newsList.map((item) => (
            <div key={item.id} style={{ 
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--color-gray-200)', 
              borderRadius: '12px', 
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              {item.image_url && (
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={item.image_url} alt="News" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: 'var(--color-secondary)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>
                  {new Date(item.published_date).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--color-primary)', lineHeight: '1.4' }}>
                  {language === 'en' ? (item.title_en || item.title_th || item.title) : (item.title_th || item.title)}
                </h3>
                <p style={{ color: 'var(--color-gray-800)', lineHeight: '1.6', flex: 1 }}>
                  {language === 'en' ? (item.content_en || item.content_th || item.content) : (item.content_th || item.content)}
                </p>
              </div>
            </div>
          ))}
          {newsList.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-secondary)' }}>
              {t('news.empty')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
