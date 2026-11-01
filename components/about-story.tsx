'use client';

import React from 'react';
import { SALON_CONFIG } from '@/config/salon-config';
import { MapPin, Clock, Phone, Calendar, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { createQuickWhatsAppUrl, CALL_HREF, CALL_NUMBER } from '@/lib/whatsapp';

interface AboutStoryProps {
  onOpenBooking?: () => void;
}

export default function AboutStory({ onOpenBooking }: AboutStoryProps) {
  const about = SALON_CONFIG.about;
  const brand = SALON_CONFIG.brand;

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#FFFFFF] border-y border-[#E9E0D5] text-[#302C29] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Photographic Portrait Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E9E0D5] group bg-[#F8F5F0]">
              <img
                src={typeof SALON_CONFIG.hero.videoFallbackImg === 'string' ? SALON_CONFIG.hero.videoFallbackImg : (SALON_CONFIG.hero.videoFallbackImg as { src: string }).src}
                alt="Aura The Salon Interior"
                className="w-full h-[460px] sm:h-[500px] object-cover object-center filter brightness-[0.95] contrast-[1.05] transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#302C29]/80 via-transparent to-transparent opacity-85" />

              {/* Floating Monogram Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl border border-[#E9E0D5] text-[#302C29]">
                <p className="font-serif-luxury text-xl text-[#302C29] italic font-light">
                  &ldquo;{brand.tagline}&rdquo;
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#887D73] font-mono mt-1.5">
                  {brand.name} • Chandrapur
                </p>
              </div>
            </div>

            {/* Decorative Corner Offset Accent */}
            <div className="absolute -bottom-3 -right-3 w-28 h-28 border-b-2 border-r-2 border-[#C5A059]/40 rounded-br-3xl pointer-events-none hidden sm:block" />
          </motion.div>

          {/* Editorial Story Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-7"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#887D73] font-mono block mb-2">
                {about.subtitle}
              </span>
              <h2 className="font-serif-luxury text-4xl sm:text-5xl text-[#302C29] font-light leading-tight">
                {about.headline}
              </h2>
            </div>

            <div className="space-y-4 text-[#887D73] font-light text-base sm:text-lg leading-relaxed">
              {about.paragraphs.map((p, idx) => (
                <p key={idx} className="relative pl-5 border-l-2 border-[#E9E0D5] hover:border-[#C5A059] transition-colors">
                  {p}
                </p>
              ))}
            </div>

            {/* Verified Information Badges */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E9E0D5]">
              <div className="p-3.5 rounded-2xl bg-[#F8F5F0] border border-[#E9E0D5] space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#302C29] font-mono font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Location</span>
                </div>
                <div className="text-xs text-[#887D73] font-light leading-snug">
                  Beside SBI, Nagpur Road, Bapat Nagar Sq, Civil Lines
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F5F0] border border-[#E9E0D5] space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#302C29] font-mono font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Schedule</span>
                </div>
                <div className="text-xs text-[#887D73] font-light leading-snug">
                  10:00 AM – 10:00 PM Monday through Sunday
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F5F0] border border-[#E9E0D5] space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#302C29] font-mono font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Contact</span>
                </div>
                <div className="text-xs text-[#887D73] font-light leading-snug">
                  +91 {brand.phone} • WhatsApp Direct
                </div>
              </div>
            </div>

            {/* Booking & Call Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#302C29] hover:bg-[#433E3A] text-[#F8F5F0] font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>BOOK APPOINTMENT</span>
              </button>

              <a
                href={createQuickWhatsAppUrl('Consultation', 'Inquiring after reading about Aura The Salon')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Request on WhatsApp</span>
              </a>

              <a
                href={CALL_HREF}
                className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-[#F8F5F0] border border-[#E9E0D5] hover:border-[#887D73] text-[#302C29] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Call {CALL_NUMBER}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
