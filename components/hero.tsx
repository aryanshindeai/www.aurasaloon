'use client';

import React, { useEffect, useRef } from 'react';
import { SALON_CONFIG } from '@/config/salon-config';
import { motion } from 'motion/react';
import { Calendar, ChevronDown, MapPin, Clock, Sparkles, MessageSquare } from 'lucide-react';
import { createQuickWhatsAppUrl } from '@/lib/whatsapp';

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Respect user's motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let isVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle floating golden dust particles
    const particleCount = Math.min(width > 768 ? 45 : 25, 60);
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      vy: -(Math.random() * 0.3 + 0.08),
      vx: (Math.random() - 0.5) * 0.15,
    }));

    let time = 0;

    const render = () => {
      if (!isVisible || document.hidden) {
        animationFrameId = null;
        return;
      }

      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Radial dark vignette
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      gradient.addColorStop(0, 'rgba(18, 15, 12, 0.25)');
      gradient.addColorStop(1, 'rgba(7, 6, 6, 0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Animated glowing Gold Oval Halo Mirrors (signature of Aura Salon)
      if (width > 640) {
        const mirrorPositions = [
          { cx: width * 0.28, cy: height * 0.48, rx: 70, ry: 130 },
          { cx: width * 0.72, cy: height * 0.48, rx: 70, ry: 130 },
        ];

        mirrorPositions.forEach((m, idx) => {
          const pulseAlpha = 0.15 + Math.sin(time * 0.02 + idx) * 0.06;
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(m.cx, m.cy, m.rx, m.ry, 0, 0, Math.PI * 2);
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = `rgba(229, 193, 88, ${pulseAlpha})`;
          ctx.shadowColor = '#E5C158';
          ctx.shadowBlur = 20;
          ctx.stroke();

          // Outer halo
          ctx.beginPath();
          ctx.ellipse(m.cx, m.cy, m.rx + 8, m.ry + 8, 0, 0, Math.PI * 2);
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(212, 175, 55, ${pulseAlpha * 0.4})`;
          ctx.stroke();
          ctx.restore();
        });
      }

      // Render gold particles
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 193, 88, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const startAnimation = () => {
      if (animationFrameId === null && isVisible && !document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Pause CPU render loop when hero is outside viewport or tab hidden
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry?.isIntersecting ?? true;
        if (isVisible) {
          startAnimation();
        } else if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        startAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startAnimation();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 bg-[#070606]">
      {/* Background Image / Cinema Atmosphere - STRICTLY PRESERVED */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <picture>
          <source srcSet="/images/regenerated_image_1785000416312.avif" type="image/avif" />
          <source srcSet="/images/regenerated_image_1785000416312.webp" type="image/webp" />
          <img
            src={SALON_CONFIG.hero.videoFallbackImg}
            alt="Aura The Salon Sanctuary"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.45] contrast-[1.1] blur-[1px] transition-transform duration-1000"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070606] via-[#070606]/65 to-[#070606]/40" />
      </div>

      {/* Floating Canvas Particle Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center min-h-[75vh]">
        {/* Top Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12100E]/85 border border-[#D4AF37]/30 backdrop-blur-md mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#E5C158] font-mono">
            {SALON_CONFIG.hero.badgeText}
          </span>
        </motion.div>

        {/* Master Brand Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight text-[#F8F5F0] leading-[1.08] mb-6"
        >
          Feel Good. <span className="gold-hero-text italic font-normal">Look Your Best.</span>
        </motion.h1>

        {/* Supporting Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base sm:text-lg lg:text-xl text-stone-300 max-w-2xl font-light leading-relaxed mb-9 tracking-wide font-sans"
        >
          {SALON_CONFIG.hero.subheadline}
        </motion.p>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
        >
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#FFF6DF] via-[#E5C158] to-[#C5A059] text-[#14110E] font-semibold text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#D4AF37]/20 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2.5"
          >
            <Calendar className="w-4 h-4 text-[#302C29]" />
            <span>BOOK APPOINTMENT</span>
          </button>

          <a
            href={createQuickWhatsAppUrl('General Consultation', 'Direct inquiry from website hero')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#12100E]/85 border border-emerald-500/40 hover:border-emerald-400 text-[#F8F5F0] text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            title="Chat directly on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          <a
            href="#welcome"
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#12100E]/80 border border-[#D4AF37]/30 hover:border-[#E5C158] text-[#F8F5F0] text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <span>Discover Aura</span>
          </a>
        </motion.div>

        {/* Attractive AI Introduction Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-7 inline-flex flex-col sm:flex-row items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#12100E]/90 border border-[#E5C158]/35 backdrop-blur-md shadow-lg shadow-[#D4AF37]/10"
        >
          <div className="flex items-center gap-2 text-xs text-stone-200 font-light">
            <Sparkles className="w-4 h-4 text-[#E5C158] animate-pulse" />
            <span>Meet <strong>Aura AI</strong> — your personal beauty concierge.</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#consultation"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFF6DF] via-[#E5C158] to-[#C5A059] hover:brightness-110 text-[#14110E] text-[10px] font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>DISCOVER YOUR STYLE</span>
            </a>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-aura-ai'));
                }
              }}
              className="px-3 py-1.5 rounded-full bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-stone-200 text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95"
            >
              <span>CHAT</span>
            </button>
          </div>
        </motion.div>

        {/* Verified Business Information Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 w-full grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#14110E]/85 border border-[#D4AF37]/25 backdrop-blur-md max-w-3xl"
        >
          <div className="p-2.5 text-center sm:border-r border-stone-800">
            <div className="flex items-center justify-center gap-1.5 text-[#E5C158] text-xs font-mono uppercase tracking-wider mb-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location</span>
            </div>
            <div className="text-xs text-stone-300 font-light">
              Beside SBI, Nagpur Rd, Civil Lines
            </div>
          </div>

          <div className="p-2.5 text-center sm:border-r border-stone-800">
            <div className="flex items-center justify-center gap-1.5 text-[#E5C158] text-xs font-mono uppercase tracking-wider mb-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Hours</span>
            </div>
            <div className="text-xs text-stone-300 font-light">
              10:00 AM – 10:00 PM Daily
            </div>
          </div>

          <div className="p-2.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#E5C158] text-xs font-mono uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Care</span>
            </div>
            <div className="text-xs text-stone-300 font-light">
              Hair, Skin & Bridal Artistry
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.a
          href="#welcome"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="mt-8 text-stone-400 hover:text-[#E5C158] flex flex-col items-center gap-1 group"
          aria-label="Scroll to welcome section"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] font-mono">Explore</span>
          <ChevronDown className="w-4 h-4 text-[#E5C158]" />
        </motion.a>
      </div>
    </section>
  );
}
