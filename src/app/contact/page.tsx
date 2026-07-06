"use client";

import { useLanguage } from "../../context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div style={{ padding: '5rem 1rem', maxWidth: '1200px', margin: '0 auto', minHeight: '70vh' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '3rem', color: 'var(--color-primary)' }}>{t('contact.title')}</h1>
      <div className="responsive-grid-contact">
        
        {/* Contact Info */}
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>{t('contact.info')}</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>🌐</span>
              <div>
                <a href="https://aiolab.ubu.ac.th" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: '500' }}>
                  aiolab.ubu.ac.th
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>✉️</span>
              <div>
                <a href="mailto:aiolabubu@gmail.com" style={{ color: 'var(--color-accent)', fontWeight: '500' }}>
                  aiolabubu@gmail.com
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>📍</span>
              <div>
                <p style={{ marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-secondary)' }}>
                  {t('contact.address.line1')}
                </p>
                <p style={{ color: 'var(--color-secondary)' }}>
                  {t('contact.address.line2')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Google Map Embed */}
        <div style={{ backgroundColor: 'var(--color-gray-50)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-gray-200)' }}>
          <iframe
            src="https://maps.google.com/maps?q=คณะวิศวกรรมศาสตร์%20มหาวิทยาลัยอุบลราชธานี&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '8px', minHeight: '350px' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        
      </div>
    </div>
  );
}
