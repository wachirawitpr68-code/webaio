"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

interface ImageCropperProps {
  imageSrc: string;
  onCropCompleteAction: (croppedFile: File) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropCompleteAction, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        onCropCompleteAction(croppedFile);
      }
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาดในการตัดรูปภาพ');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '60vh',
        backgroundColor: '#333',
        borderRadius: '12px',
        overflow: 'hidden',
        maxWidth: '800px'
      }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      <div style={{
        marginTop: '2rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        background: 'rgba(10, 15, 30, 0.8)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(0, 243, 255, 0.3)',
        boxShadow: '0 0 20px rgba(0, 243, 255, 0.1)'
      }}>
        <div style={{ color: 'white', marginRight: '1rem' }}>
          ซูมภาพ:
          <input 
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ marginLeft: '10px', width: '150px' }}
          />
        </div>

        <button 
          onClick={onCancel}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'transparent',
            color: 'white',
            border: '1px solid white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
          disabled={isProcessing}
        >
          ยกเลิก
        </button>
        <button 
          onClick={handleSave}
          style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: 'var(--color-primary)',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 0 10px rgba(0, 243, 255, 0.4)'
          }}
          disabled={isProcessing}
        >
          {isProcessing ? 'กำลังประมวลผล...' : 'ยืนยันการตัดรูป'}
        </button>
      </div>
    </div>
  );
}
