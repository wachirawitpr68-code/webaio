"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useLanguage } from "../../../context/LanguageContext";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NewsDetail() {
  const { t, language } = useLanguage();
  const params = useParams();
  const [newsItem, setNewsItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!params?.id) return;
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", params.id)
        .single();
        
      if (data) {
        setNewsItem(data);
      }
      setLoading(false);
    };

    fetchNewsDetail();
  }, [params]);

  if (loading) {
    return (
      <div style={{ padding: '8rem 1rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-secondary)' }}>{t('news.loading')}</p>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div style={{ padding: '8rem 1rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-secondary)' }}>{t('news.empty')}</p>
        <Link href="/news" style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
          {t('news.back')}
        </Link>
      </div>
    );
  }

  const title = language === 'en' && newsItem.title_en ? newsItem.title_en : (newsItem.title_th || newsItem.title);
  const content = language === 'en' && newsItem.content_en ? newsItem.content_en : (newsItem.content_th || newsItem.content);

  return (
    <div style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
      <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--color-secondary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '1.1rem', fontWeight: '500', transition: 'color 0.2s' }} className="hover:text-primary">
        {t('news.back')}
      </Link>

      <article style={{ background: 'rgba(10, 15, 30, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '3rem', boxShadow: '0 4px 20px rgba(0, 243, 255, 0.1)', border: '1px solid rgba(0, 243, 255, 0.3)' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem', lineHeight: '1.3' }}>
          {title}
        </h1>
        
        <div style={{ color: '#888', marginBottom: '2rem', fontSize: '1.1rem' }}>
          📅 {new Date(newsItem.published_date).toLocaleDateString(language === 'en' ? 'en-US' : 'th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        {newsItem.image_url && (
          <div style={{ marginBottom: '2.5rem', borderRadius: '12px', overflow: 'hidden' }}>
            <img 
              src={newsItem.image_url} 
              alt={title} 
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        <div style={{ 
          fontSize: '1.2rem', 
          lineHeight: '1.8', 
          color: '#e2e8f0',
          whiteSpace: 'pre-wrap'
        }}>
          {content}
        </div>
      </article>
    </div>
  );
}
