"use client";

import React, { useState, useEffect } from 'react';
import styles from './Preloader.module.css';

export default function Preloader() {
  const [show, setShow] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if we already showed the intro in this session
    const hasSeenIntro = sessionStorage.getItem('aio_seen_intro');
    
    if (!hasSeenIntro) {
      setShow(true);
      sessionStorage.setItem('aio_seen_intro', 'true');
      
      // Typewriter effect for "LOADING SYSTEM . . ."
      const fullText = "LOADING SYSTEM . . .";
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setLoadingText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100);

      // Start fade out at 4.5s
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 4500);

      // Completely remove at 5s
      const removeTimer = setTimeout(() => {
        setShow(false);
      }, 5000);

      return () => {
        clearInterval(typingInterval);
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!show) return null;

  return (
    <div className={`${styles.preloaderContainer} ${fadeOut ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          {/* UBU Logo with Cyberpunk glitch/neon effect */}
          <img src="/ubu-logo.png" alt="UBU Logo" className={styles.logo} />
          <div className={styles.scanline}></div>
        </div>
        <div className={styles.textContainer}>
          <span className={styles.loadingText}>{loadingText}</span>
          <span className={styles.cursor}></span>
        </div>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar}></div>
        </div>
        <div className={styles.aiStatus}>
          AI CORE INITIALIZING...
        </div>
      </div>
    </div>
  );
}
