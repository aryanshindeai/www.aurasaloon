'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, MapPin } from 'lucide-react';
import { SALON_CONFIG } from '@/config/salon-config';

export default function LuxuryInteractiveMap({
  mapMode = 'dark'
}: {
  mapMode?: 'dark' | 'satellite';
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const { lat, lng } = SALON_CONFIG.brand.coordinates;

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Tile layer init
      const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      const satTiles = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

      tileLayerRef.current = L.tileLayer(mapMode === 'satellite' ? satTiles : darkTiles, {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom Aura Pin
      const auraGoldIcon = L.divIcon({
        className: 'custom-gold-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(229, 193, 88, 0.3); animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; display: flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 9999px; background: #0E0C0A; border: 2px solid #E5C158; box-shadow: 0 10px 30px rgba(0,0,0,0.9), 0 0 20px rgba(229,193,88,0.5);">
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #E5C158; box-shadow: 0 0 12px #FFF6DF;"></div>
              <span style="color: #FFFFFF; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 700; font-size: 15px; white-space: nowrap; letter-spacing: 0.04em;">Aura The Salon</span>
            </div>
          </div>
        `,
        iconSize: [160, 48],
        iconAnchor: [30, 24],
      });

      L.marker([lat, lng], { icon: auraGoldIcon }).addTo(map);

      // Immediate landmark: State Bank of India
      const sbiIcon = L.divIcon({
        className: 'custom-sbi-pin',
        html: `
          <div style="display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 12px; background: rgba(20, 17, 14, 0.95); color: #E5C158; border: 1px solid rgba(212, 175, 55, 0.4); box-shadow: 0 4px 15px rgba(0,0,0,0.7);">
            <span style="font-size: 11px; font-weight: 600; color: #FFF; white-space: nowrap;">Aside SBI (Nagpur Road)</span>
          </div>
        `,
        iconSize: [140, 28],
        iconAnchor: [10, 10],
      });

      L.marker([lat + 0.0003, lng + 0.0002], { icon: sbiIcon }).addTo(map);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, mapMode]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleReset = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden bg-[#0A0908]">
      <div ref={mapRef} className="w-full h-full min-h-[420px] z-0" />

      {/* Map Floating Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2.5 rounded-xl bg-[#12100E]/90 hover:bg-[#1C1814] text-stone-200 border border-[#D4AF37]/30 shadow-lg transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-[#E5C158]" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 rounded-xl bg-[#12100E]/90 hover:bg-[#1C1814] text-stone-200 border border-[#D4AF37]/30 shadow-lg transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-[#E5C158]" />
        </button>
        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-[#12100E]/90 hover:bg-[#1C1814] text-stone-200 border border-[#D4AF37]/30 shadow-lg transition-all"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4 text-[#E5C158]" />
        </button>
      </div>

      {/* Bottom Information Pill */}
      <div className="absolute bottom-4 left-4 z-10 px-4 py-2 rounded-xl bg-[#070606]/90 border border-[#D4AF37]/30 backdrop-blur-md text-xs font-mono text-stone-300 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-[#E5C158]" />
        <span>Bapat Nagar Sq, Nagpur Rd, Civil Lines, Chandrapur</span>
      </div>
    </div>
  );
}
