"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { supabase } from "../../lib/supabaseClient";

export default function Researchers() {
  const [researchers, setResearchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResearchers();
  }, []);

  const fetchResearchers = async () => {
    try {
      const { data, error } = await supabase
        .from('researchers')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) throw error;
      if (data) setResearchers(data);
    } catch (error) {
      console.error('Error fetching researchers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <h1 className={styles.title}>นักวิจัยของเรา</h1>
        <p className={styles.subtitle}>ทำความรู้จักกับบุคลากรและทีมนักวิจัยแห่ง AIO LAB มหาวิทยาลัยอุบลราชธานี</p>
      </section>

      <section className={styles.researchersList}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>กำลังโหลดข้อมูล...</div>
          ) : (
            <div className={styles.grid}>
              {researchers.map((researcher) => (
                <div key={researcher.id} className={styles.card}>
                  <div className={styles.cardImage}>
                    <img src={researcher.image_url || `https://ui-avatars.com/api/?name=${researcher.name}&background=eee&color=000`} alt={researcher.name} />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.name}>{researcher.name}</h3>
                    <p className={styles.position}>{researcher.position}</p>
                    <p className={styles.bio}>{researcher.bio}</p>
                    
                    <div className={styles.cardFooter}>
                      {researcher.scholar_link && (
                        <a href={researcher.scholar_link} target="_blank" rel="noopener noreferrer" className={styles.scholarLink}>
                          <svg className={styles.scholarIcon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-2.4a4.6 4.6 0 1 0 0-9.2 4.6 4.6 0 0 0 0 9.2zm-.7-7.2h1.4v3.8h-1.4v-3.8zm0-2.2h1.4v1.4h-1.4v-1.4z"/>
                            <path d="M5.5 5.5l6.5-5.5 6.5 5.5v5.5h-13v-5.5zm1.5.7v3.3h10V6.2L12 2.4 7 6.2z"/>
                          </svg>
                          ดูผลงานวิจัยบน Google Scholar
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
