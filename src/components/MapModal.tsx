"use client";

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PROVINCES } from '../data/provinces';
import styles from './MapModal.module.css';

// Dynamic import for Leaflet map component to prevent SSR issues
const Map = dynamic(() => import('./Map'), { 
  ssr: false,
  loading: () => <div className={styles.loading}>กำลังโหลดแผนที่... (Loading Map...)</div>
});

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  researchers: any[];
}

export default function MapModal({ isOpen, onClose, researchers }: MapModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <h2 className={styles.title}>AIO LAB Researchers Map</h2>
        <div className={styles.mapContainer}>
          <Map researchers={researchers} />
        </div>
      </div>
    </div>
  );
}
