'use client';

import React from 'react';
import { Calendar, Phone, MessageCircle } from 'lucide-react';
import { createQuickWhatsAppUrl, CALL_HREF, CALL_NUMBER } from '@/lib/whatsapp';

interface MobileBookingBarProps {
  onOpenBooking: () => void;
}

export default function MobileBookingBar({ onOpenBooking }: MobileBookingBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#FFFFFF]/95 backdrop-blur-lg border-t border-[#E9E0D5] shadow-[0_-4px_20px_rgba(48,44,41,0.08)] sm:hidden flex items-center justify-between gap-2.5">
      <a
        href={CALL_HREF}
        className="w-12 h-12 rounded-full bg-[#F8F5F0] border border-[#E9E0D5] flex items-center justify-center text-[#302C29] active:scale-95 transition-transform shrink-0"
        aria-label={`Call Aura The Salon at ${CALL_NUMBER}`}
        title={`Call ${CALL_NUMBER}`}
      >
        <Phone className="w-5 h-5 text-[#887D73]" />
      </a>

      <a
        href={createQuickWhatsAppUrl('General Consultation', 'Quick booking request from mobile bottom bar')}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 active:scale-95 transition-transform shrink-0"
        aria-label="WhatsApp Aura The Salon"
        title="WhatsApp Direct Inquiry"
      >
        <MessageCircle className="w-5 h-5" />
      </a>

      <button
        onClick={onOpenBooking}
        className="flex-1 h-12 rounded-full bg-[#302C29] text-[#F8F5F0] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform"
      >
        <Calendar className="w-4 h-4 text-[#C5A059]" />
        <span>BOOK APPOINTMENT</span>
      </button>
    </div>
  );
}
