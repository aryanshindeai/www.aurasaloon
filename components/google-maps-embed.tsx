'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ExternalLink, RefreshCw } from 'lucide-react';
import { SALON_CONFIG } from '@/config/salon-config';

interface GoogleMapsEmbedProps {
  className?: string;
  onDirectionsClick?: () => void;
}

export default function GoogleMapsEmbed({ className = '', onDirectionsClick }: GoogleMapsEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [embedSrc, setEmbedSrc] = useState<string>('');

  const brand = SALON_CONFIG.brand;
  const placeId = brand.placeId; // ChIJfZdksm_X0jsRkwFrmIZg

  useEffect(() => {
    // Check for Google Maps Embed API key in browser environment
    // Supports both NEXT_PUBLIC_ (Next.js) and VITE_ (if exposed) prefixes
    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY ||
      process.env.VITE_GOOGLE_MAPS_EMBED_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (apiKey && apiKey.trim().length > 5 && !apiKey.includes('YOUR_API_KEY')) {
      // Official Google Maps Embed API in Place Mode
      const officialEmbed = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
        apiKey.trim()
      )}&q=place_id:${encodeURIComponent(placeId)}&zoom=17&language=en&region=IN`;
      setEmbedSrc(officialEmbed);
    } else {
      // Direct Google Maps Search Embed fallback (renders a genuine, real Google Map without requiring a paid key)
      const fallbackEmbed = `https://maps.google.com/maps?q=Aura+The+Salon%2C+Beside+SBI%2C+Nagpur+Road%2C+Bapat+Nagar+Square%2C+Civil+Lines%2C+Chandrapur%2C+Maharashtra+442401&t=&z=17&ie=UTF8&iwloc=&output=embed`;
      setEmbedSrc(fallbackEmbed);
    }
  }, [placeId]);

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-[#E9E0D5] bg-[#FAF8F5] shadow-sm transition-all duration-300 ${className}`}
      style={{ minHeight: '360px' }}
    >
      {/* Neutral Shimmer Loading Placeholder */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F8F5F0] text-[#887D73] p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#E9E0D5] flex items-center justify-center shadow-xs animate-pulse">
            <MapPin className="w-6 h-6 text-[#C5A059] animate-bounce" />
          </div>
          <div className="text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#302C29] font-medium block">
              Loading Google Maps...
            </span>
            <span className="text-[11px] text-[#887D73] font-sans font-light">
              Aura The Salon • Beside SBI, Civil Lines, Chandrapur
            </span>
          </div>
          {/* Subtle Shimmer Bar */}
          <div className="w-48 h-1 bg-[#E9E0D5] rounded-full overflow-hidden relative">
            <div className="w-24 h-full bg-[#C5A059] rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Error Fallback: Never display broken iframe */}
      {hasError ? (
        <div className="w-full h-full min-h-[360px] lg:min-h-[520px] flex flex-col items-center justify-center bg-[#F8F5F0] p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FFFFFF] border border-[#E9E0D5] flex items-center justify-center shadow-xs">
            <MapPin className="w-7 h-7 text-[#C5A059]" />
          </div>
          <div className="space-y-1 max-w-md">
            <h4 className="font-serif-luxury text-2xl text-[#302C29] font-light">
              Aura The Salon
            </h4>
            <p className="text-xs text-[#887D73] font-light leading-relaxed">
              Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={brand.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#302C29] text-[#F8F5F0] text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-xs hover:bg-[#433E3A] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>OPEN IN GOOGLE MAPS</span>
            </a>
            <a
              href={brand.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#FFFFFF] border border-[#E9E0D5] text-[#302C29] text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-2 hover:border-[#302C29] transition-colors shadow-2xs"
            >
              <Navigation className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>GET DIRECTIONS</span>
            </a>
          </div>
        </div>
      ) : (
        embedSrc && (
          <iframe
            src={embedSrc}
            title="Google Maps Location - Aura The Salon Chandrapur"
            width="100%"
            height="100%"
            className="w-full h-[360px] lg:h-[520px] border-0 block"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        )
      )}
    </div>
  );
}
