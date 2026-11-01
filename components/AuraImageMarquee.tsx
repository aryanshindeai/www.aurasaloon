'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  getUniqueVerifiedMarqueeImages, 
  MarqueeImageSlot, 
  AURA_16_IMAGE_MANIFEST 
} from '@/config/aura-marquee-manifest';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  ShieldCheck, 
  MessageSquare, 
  Phone,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createQuickWhatsAppUrl, CALL_HREF, CALL_NUMBER } from '@/lib/whatsapp';
import { SALON_CONFIG } from '@/config/salon-config';

interface AuraImageMarqueeProps {
  onOpenBooking?: (serviceName?: string) => void;
}

export default function AuraImageMarquee({ onOpenBooking }: AuraImageMarqueeProps) {
  const [images, setImages] = useState<MarqueeImageSlot[]>(() => getUniqueVerifiedMarqueeImages());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Animation and Drag physics refs
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const isSectionVisibleRef = useRef<boolean>(true);

  const offsetRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const halfWidthRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startOffsetRef = useRef<number>(0);
  const previousXRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const isReducedMotionRef = useRef<boolean>(false);

  // AUTO-SCROLL SPEED: 0.8 pixels per frame, direction left
  const AUTO_SCROLL_SPEED = 0.8;

  // 1. Fetch any fresh Google Places verified photos dynamically
  useEffect(() => {
    let isMounted = true;
    async function loadPlacesPhotos() {
      try {
        const res = await fetch('/api/places/details');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data?.place?.photos?.length > 0) {
          const placesPhotos: MarqueeImageSlot[] = data.place.photos.slice(0, 4).map((p: any, idx: number) => ({
            slotId: `places-photo-${idx}`,
            slotNumber: String(idx + 1).padStart(2, '0'),
            name: `Aura Salon Verified Perspective ${idx + 1}`,
            description: 'Genuine Google Places Profile photograph retrieved for Place ID: ChIJfZdksm_X0jsRkwFrmIZg.',
            category: 'Interior' as const,
            status: 'verified-active' as const,
            imageUrl: p.proxyUrl,
            originalWidth: p.widthPx,
            originalHeight: p.heightPx,
            attribution: p.authorAttributions?.[0]?.displayName || 'Google Maps Contributor',
            sourceType: 'google-places' as const,
            authorUri: p.authorAttributions?.[0]?.uri,
            googleMapsUri: data.place.googleMapsUri,
            license: 'Google Maps Terms & Attribution',
            altText: `Aura The Salon Chandrapur perspective ${idx + 1}`
          }));

          // Merge without duplicate URLs
          setImages((prev) => {
            const existingUrls = new Set(prev.map((img) => img.imageUrl));
            const freshUnique = placesPhotos.filter((p) => p.imageUrl && !existingUrls.has(p.imageUrl));
            return [...prev, ...freshUnique];
          });
        }
      } catch (err) {
        console.warn('Could not fetch external Places photos for marquee:', err);
      }
    }

    loadPlacesPhotos();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Measure Track Half-Width via ResizeObserver
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateDimensions = () => {
      if (track) {
        // Since we render [...images, ...images], halfWidth is track.scrollWidth / 2
        halfWidthRef.current = track.scrollWidth / 2;
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(track);

    return () => {
      resizeObserver.disconnect();
    };
  }, [images]);

  // 3. Infinite Animation Engine using requestAnimationFrame
  useEffect(() => {
    // Check reduced motion preference
    isReducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      if (!isPointerDownRef.current && !isReducedMotionRef.current && isSectionVisibleRef.current && !document.hidden) {
        // Apply momentum inertia if released with velocity
        if (Math.abs(velocityRef.current) > 0.08) {
          offsetRef.current += velocityRef.current;
          velocityRef.current *= 0.95; // Inertial decay
        } else {
          // Normal auto-scroll: 0.8px/frame to the left
          velocityRef.current = 0;
          offsetRef.current -= AUTO_SCROLL_SPEED;
        }

        // Loop math:
        // When offset <= -halfWidth: offset += halfWidth
        // When offset > 0: offset -= halfWidth
        const halfWidth = halfWidthRef.current;
        if (halfWidth > 0) {
          if (offsetRef.current <= -halfWidth) {
            offsetRef.current += halfWidth;
          } else if (offsetRef.current > 0) {
            offsetRef.current -= halfWidth;
          }
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }

      if (isSectionVisibleRef.current && !document.hidden) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameIdRef.current = null;
      }
    };

    const startAnimation = () => {
      if (animationFrameIdRef.current === null && isSectionVisibleRef.current && !document.hidden) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    // Viewport IntersectionObserver to pause when marquee leaves the screen
    const targetElement = sectionRef.current || containerRef.current;
    let observer: IntersectionObserver | null = null;
    if (targetElement) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isSectionVisibleRef.current = entry?.isIntersecting ?? true;
          if (isSectionVisibleRef.current) {
            startAnimation();
          } else if (animationFrameIdRef.current !== null) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(targetElement);
    }

    // Visibility change handler to pause when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameIdRef.current !== null) {
          cancelAnimationFrame(animationFrameIdRef.current);
          animationFrameIdRef.current = null;
        }
      } else {
        startAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startAnimation();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer) observer.disconnect();
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // 4. Pointer Drag Physics Implementation
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary button
    if (e.button !== 0) return;

    const target = e.currentTarget;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {}

    isPointerDownRef.current = true;
    setIsDragging(true);

    startXRef.current = e.clientX;
    startOffsetRef.current = offsetRef.current;
    previousXRef.current = e.clientX;
    previousTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const now = performance.now();
    const dt = Math.max(now - previousTimeRef.current, 1);
    const dx = e.clientX - previousXRef.current;

    // Calculate instantaneous velocity: (dx / dt) * 16 (per frame rate)
    velocityRef.current = (dx / dt) * 16;

    previousXRef.current = e.clientX;
    previousTimeRef.current = now;

    // Calculate new offset
    const deltaX = e.clientX - startXRef.current;
    offsetRef.current = startOffsetRef.current + deltaX;

    // Maintain loop boundaries while dragging
    const halfWidth = halfWidthRef.current;
    if (halfWidth > 0) {
      if (offsetRef.current <= -halfWidth) {
        offsetRef.current += halfWidth;
        startOffsetRef.current += halfWidth;
      } else if (offsetRef.current > 0) {
        offsetRef.current -= halfWidth;
        startOffsetRef.current -= halfWidth;
      }
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const target = e.currentTarget;
    try {
      target.releasePointerCapture(e.pointerId);
    } catch {}

    isPointerDownRef.current = false;
    setIsDragging(false);

    // Limit max release velocity to prevent uncontrolled spinning
    const MAX_VELOCITY = 24;
    if (Math.abs(velocityRef.current) > MAX_VELOCITY) {
      velocityRef.current = Math.sign(velocityRef.current) * MAX_VELOCITY;
    }
  };

  // 5. Lightbox Modal Navigation
  const handleOpenLightbox = (index: number) => {
    // If the user was actively dragging, do not open lightbox
    if (Math.abs(velocityRef.current) > 2) return;
    setLightboxIndex(index);
  };

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + images.length) % images.length));
  }, [lightboxIndex, images.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % images.length));
  }, [lightboxIndex, images.length]);

  // Keyboard accessibility: Escape to close, Left/Right arrows to navigate
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext]);

  // Duplication for seamless infinite looping
  // Exactly as specified: [...images, ...images]
  const duplicatedMarquee = [...images, ...images];

  const selectedImage = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <section 
      ref={sectionRef}
      id="gallery" 
      className="relative w-full overflow-hidden bg-[#FFFFFF] py-20 md:py-28 text-[#302C29]"
    >
      {/* 01. Section Header: Title and Subtitle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 md:mb-14 space-y-3">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#887D73] font-mono block font-medium">
          AURA PORTFOLIO ARCHITECTURE
        </span>
        
        <h2 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-[#302C29] font-light tracking-tight">
          A closer look at <span className="italic font-normal text-[#887D73]">Aura.</span>
        </h2>

        <p className="text-sm sm:text-base text-[#887D73] font-light max-w-2xl mx-auto leading-relaxed">
          Beauty in every detail. Discover the people, spaces and work behind Aura The Salon.
        </p>

        <div className="pt-1 flex items-center justify-center gap-2 text-[10px] font-mono text-[#887D73]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Infinitely Draggable Marquee • Drag or swipe smoothly horizontally</span>
        </div>
      </div>

      {/* 02. Marquee Container with Bespoke Curved Masks */}
      <div className="relative w-full overflow-hidden py-6 md:py-10">
        {/* TOP CURVED MASK: 80px mobile, 100px desktop */}
        <div 
          className="absolute top-0 left-0 right-0 z-20 pointer-events-none h-[80px] md:h-[100px] w-full"
          aria-hidden="true"
        >
          <svg 
            viewBox="0 0 1440 100" 
            preserveAspectRatio="none" 
            className="w-full h-full block"
          >
            <path fill="white" d="M0 0H1440V50C1440 50 1200 100 720 100C240 100 0 50 0 50V0Z"/>
          </svg>
        </div>

        {/* BOTTOM CURVED MASK: 80px mobile, 100px desktop */}
        <div 
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none h-[80px] md:h-[100px] w-full"
          aria-hidden="true"
        >
          <svg 
            viewBox="0 0 1440 100" 
            preserveAspectRatio="none" 
            className="w-full h-full block"
          >
            <path fill="white" d="M0 100H1440V50C1440 50 1200 0 720 0C240 0 0 50 0 50V100Z"/>
          </svg>
        </div>

        {/* 03. Interactive Draggable Marquee Track */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrCancel}
          onPointerCancel={handlePointerUpOrCancel}
          className={`w-full overflow-hidden select-none touch-pan-y ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ willChange: 'transform' }}
        >
          <div
            ref={trackRef}
            className="flex items-center gap-[12px] md:gap-[16px] w-max"
            style={{ willChange: 'transform' }}
          >
            {duplicatedMarquee.map((slot, index) => {
              // Real index maps to single image list for lightbox
              const realIndex = index % images.length;
              return (
                <div
                  key={`${slot.slotId}-${index}`}
                  onClick={() => handleOpenLightbox(realIndex)}
                  className="relative group shrink-0 w-[240px] h-[320px] md:w-[320px] md:h-[512px] rounded-[16px] overflow-hidden bg-[#1D1916] shadow-xs hover:shadow-xl transition-all duration-300 transform-gpu hover:scale-[1.015]"
                >
                  {/* Subtle ambient blurred background so the whole image is framed gracefully without clipping */}
                  <img
                    src={slot.imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-35 pointer-events-none"
                  />

                  {/* Main image rendered with object-contain to ensure the whole image is shown inside the box */}
                  <img
                    src={slot.imageUrl}
                    alt={slot.altText || slot.name}
                    loading={index < 8 ? 'eager' : 'lazy'}
                    draggable={false}
                    className="relative z-10 w-full h-full object-contain rounded-[16px] pointer-events-none filter brightness-[0.98] contrast-[1.03] transition-transform duration-700 group-hover:scale-[1.02]"
                    style={{ objectPosition: slot.focalPoint || 'center center' }}
                  />

                  {/* Subtle luxury vignette gradient scrim */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#14110E]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Expand icon on hover */}
                  <div className="absolute bottom-4 right-4 z-30 p-2 rounded-full bg-[#FFFFFF]/90 text-[#302C29] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                    <Maximize2 className="w-4 h-4 text-[#C5A059]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 04. Verified Manifest Status Footer */}
      <div className="max-w-5xl mx-auto px-4 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#887D73] font-mono border-t border-[#E9E0D5]/70 pt-6 gap-3">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Displaying {images.length} verified authentic photographs of Aura The Salon Chandrapur.
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={SALON_CONFIG.brand.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#302C29] flex items-center gap-1 transition-colors"
          >
            <span>View on Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 05. Lightbox Modal with Strict Attribution & Controls */}
      <AnimatePresence>
        {selectedImage && lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-[#12100E]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#FFFFFF] border border-[#E9E0D5] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            >
              {/* Lightbox Header Bar */}
              <div className="p-4 px-6 bg-[#FFFFFF] border-b border-[#E9E0D5] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-full bg-[#F8F5F0] border border-[#E9E0D5] text-[#887D73]">
                    Slot {selectedImage.slotNumber} • {selectedImage.category}
                  </span>
                  <span className="text-xs text-[#302C29] font-medium font-serif-luxury hidden sm:inline">
                    {selectedImage.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLightboxIndex(null)}
                    className="p-2 rounded-full bg-[#F8F5F0] hover:bg-[#E9E0D5] text-[#302C29] transition-colors"
                    aria-label="Close Lightbox"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lightbox Image Stage with Previous & Next Arrows */}
              <div className="relative flex-1 bg-[#0A0908] flex items-center justify-center overflow-hidden min-h-[50vh] sm:min-h-[60vh]">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.altText || selectedImage.name}
                  className="max-h-[65vh] w-auto max-w-full object-contain"
                />

                {/* Left Arrow Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#14110E]/75 hover:bg-[#14110E] text-[#F8F5F0] border border-stone-700 transition-all shadow-lg active:scale-90"
                  aria-label="Previous photograph"
                >
                  <ChevronLeft className="w-5 h-5 text-[#E5C158]" />
                </button>

                {/* Right Arrow Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#14110E]/75 hover:bg-[#14110E] text-[#F8F5F0] border border-stone-700 transition-all shadow-lg active:scale-90"
                  aria-label="Next photograph"
                >
                  <ChevronRight className="w-5 h-5 text-[#E5C158]" />
                </button>
              </div>

              {/* Lightbox Details & Action Toolbar */}
              <div className="p-5 sm:p-6 bg-[#FFFFFF] border-t border-[#E9E0D5] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
                <div className="space-y-1 max-w-xl">
                  <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#302C29] font-light">
                    {selectedImage.name}
                  </h3>
                  <p className="text-xs text-[#887D73] font-light leading-relaxed">
                    {selectedImage.description}
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-[#887D73] flex flex-wrap items-center gap-2">
                    <span>
                      Attribution: <strong className="text-[#302C29]">{selectedImage.attribution}</strong>
                    </span>
                    <span>•</span>
                    <span>License: {selectedImage.license}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <a
                    href={createQuickWhatsAppUrl(
                      selectedImage.name,
                      `Inquiring about style/treatment shown in photo: ${selectedImage.name}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire on WhatsApp</span>
                  </a>

                  {onOpenBooking && (
                    <button
                      onClick={() => {
                        const lookName = selectedImage.name;
                        setLightboxIndex(null);
                        onOpenBooking(lookName);
                      }}
                      className="px-4 py-2.5 rounded-full bg-[#302C29] hover:bg-[#433E3A] text-[#F8F5F0] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Book Look</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
