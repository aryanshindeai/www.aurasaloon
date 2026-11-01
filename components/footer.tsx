'use client';

import React from 'react';
import { SALON_CONFIG } from '@/config/salon-config';
import { ArrowUp, Phone, MapPin, MessageCircle, Calendar } from 'lucide-react';
import { createQuickWhatsAppUrl, CALL_HREF, CALL_NUMBER } from '@/lib/whatsapp';

interface FooterProps {
  onOpenBooking?: () => void;
}

export default function Footer({ onOpenBooking }: FooterProps) {
  const brand = SALON_CONFIG.brand;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#302C29] text-[#F8F5F0] py-16 border-t border-stone-800 relative pb-28 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 pb-12 border-b border-stone-700/60">
          <div className="space-y-3 max-w-md">
            <span className="font-serif-luxury text-3xl sm:text-4xl tracking-[0.3em] text-[#F8F5F0] block font-light whitespace-nowrap">
              A U R A
            </span>
            <p className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-mono whitespace-nowrap font-medium">
              {brand.tagline}
            </p>
            <p className="text-stone-300 text-xs font-light leading-relaxed">
              {brand.welcomeMessage}
            </p>
            <div className="pt-2 text-xs text-stone-300 font-light flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>{brand.address.line1}, {brand.address.line2}, {brand.address.city}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-7 text-xs font-mono text-stone-300">
            {SALON_CONFIG.navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-[#C5A059] transition-colors uppercase tracking-wider"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 self-end lg:self-auto">
            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="px-5 py-3 rounded-full bg-[#E5C158] hover:bg-[#C5A059] text-[#14110E] font-semibold text-xs font-mono uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-[#14110E]" />
                <span>BOOK APPOINTMENT</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="p-3.5 rounded-full bg-[#3D3834] border border-stone-600 text-[#C5A059] hover:text-[#FFFFFF] hover:border-[#C5A059] transition-all"
              title="Back to top"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-400 gap-4">
          <p suppressHydrationWarning>© {new Date().getFullYear()} Aura The Salon. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href={createQuickWhatsAppUrl('General Consultation', 'Inquiring via website footer link')}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C5A059] flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Chat</span>
            </a>
            <span>•</span>
            <a href={CALL_HREF} className="hover:text-[#C5A059] flex items-center gap-1.5 transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{CALL_NUMBER}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
