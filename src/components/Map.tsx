"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { PROVINCES } from '../data/provinces';
import { useLanguage } from '../context/LanguageContext';

// Fix for default leaflet icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  researchers: any[];
}

export default function Map({ researchers }: MapProps) {
  const { language } = useLanguage();

  // Center map on Thailand
  const center: [number, number] = [13.7563, 100.5018];
  const zoom = 6;

  // Group researchers by province
  const groupedResearchers = researchers.reduce((acc, researcher) => {
    const province = researcher.province;
    if (province) {
      if (!acc[province]) acc[province] = [];
      acc[province].push(researcher);
    }
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        {/* Brighter map tiles (CartoDB Voyager) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {Object.entries(groupedResearchers).map(([provinceName, resListRaw]) => {
          const resList = resListRaw as any[];
          const provinceData = PROVINCES.find(p => p.name === provinceName);
          if (!provinceData) return null;

          // Create a custom icon showing the first researcher's face or a generic marker
          const firstRes = resList[0];
          const avatarUrl = firstRes.image_url || `https://ui-avatars.com/api/?name=${firstRes.name_en || firstRes.name}&background=00f3ff&color=000`;
          
          const customIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `
              <div style="
                width: 70px; 
                height: 70px; 
                border-radius: 50%; 
                border: 3px solid #00f3ff; 
                box-shadow: 0 0 15px #00f3ff; 
                overflow: hidden;
                background: #000;
              ">
                <img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              ${resList.length > 1 ? `<div style="position: absolute; top: -2px; right: -2px; background: #ff00ff; color: white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; border: 2px solid white;">${resList.length}</div>` : ''}
            `,
            iconSize: [70, 70],
            iconAnchor: [35, 35],
            popupAnchor: [0, -35]
          });

          return (
            <Marker key={provinceName} position={[provinceData.lat, provinceData.lng]} icon={customIcon}>
              <Popup>
                <div style={{ padding: '5px', textAlign: 'center', background: 'transparent' }}>
                  <h3 style={{ color: '#00f3ff', marginBottom: '10px', fontSize: '1.2rem', borderBottom: '1px solid #00f3ff', paddingBottom: '5px' }}>
                    {language === 'en' ? provinceData.name_en : provinceData.name}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {resList.map((r: any) => (
                      <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '8px' }}>
                        <img src={r.image_url || avatarUrl} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ff00ff' }} />
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ color: 'white', fontWeight: 'bold' }}>{language === 'en' ? (r.name_en || r.name) : (r.name_th || r.name)}</div>
                          <div style={{ color: '#aaa', fontSize: '0.8rem' }}>
                            {language === 'en' 
                              ? (r.university_en || r.university || 'AIO LAB') 
                              : (r.university_th || r.university || 'AIO LAB')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
