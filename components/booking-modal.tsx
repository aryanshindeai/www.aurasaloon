'use client';

import React, { useState } from 'react';
import { SALON_CONFIG } from '@/config/salon-config';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, CheckCircle2, X, MessageSquare, Phone, AlertCircle } from 'lucide-react';
import { createWhatsAppAppointmentUrl, CALL_HREF, CALL_NUMBER } from '@/lib/whatsapp';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  initialService,
}: BookingModalProps) {
  const [customerName, setCustomerName] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>(
    initialService || SALON_CONFIG.services[0]?.name || 'Hair Cut & Styling'
  );
  const [preferredDate, setPreferredDate] = useState<string>(
    () => new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState<string>('11:00 AM');
  const [optionalMessage, setOptionalMessage] = useState<string>('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const minDate = new Date().toISOString().split('T')[0];

  const timeSlots = [
    '10:30 AM',
    '11:45 AM',
    '01:15 PM',
    '02:45 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
    '08:15 PM',
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!customerName.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!selectedService.trim()) {
      setValidationError('Please select a service.');
      return;
    }
    if (!preferredDate) {
      setValidationError('Please select a preferred date.');
      return;
    }
    if (!preferredTime) {
      setValidationError('Please select a preferred time slot.');
      return;
    }

    setIsSubmitting(true);

    const whatsappUrl = createWhatsAppAppointmentUrl({
      name: customerName,
      service: selectedService,
      date: preferredDate,
      time: preferredTime,
      message: optionalMessage
    });

    // Launch WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#302C29]/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative max-w-lg w-full bg-[#FFFFFF] border border-[#E9E0D5] rounded-3xl p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl text-[#302C29]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#887D73] hover:text-[#302C29] bg-[#F8F5F0] border border-[#E9E0D5]"
            aria-label="Close booking modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#887D73] font-mono block">
              WhatsApp Appointment Request
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#302C29] font-light">
              Book at <span className="italic font-normal text-[#887D73]">Aura.</span>
            </h2>
            <p className="text-xs text-[#887D73] font-light">
              Submit your request to launch WhatsApp. Our salon reception team will confirm your appointment details directly.
            </p>
          </div>

          {validationError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Booking Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Customer Name */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono font-medium block">
                Customer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Radhika Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#F8F5F0] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-4 py-2.5 text-xs text-[#302C29] focus:outline-none"
              />
            </div>

            {/* Selected Service */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono font-medium block">
                Selected Service *
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-[#F8F5F0] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-[#302C29] focus:outline-none"
              >
                {SALON_CONFIG.services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.duration})
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono font-medium block">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  min={minDate}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs font-mono text-[#302C29] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono font-medium block">
                  Preferred Time *
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs font-mono text-[#302C29] focus:outline-none"
                >
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional Message */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono font-medium block">
                Optional Message
              </label>
              <textarea
                rows={2}
                placeholder="Any special requests, hair length, or notes for the stylist..."
                value={optionalMessage}
                onChange={(e) => setOptionalMessage(e.target.value)}
                className="w-full bg-[#F8F5F0] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-4 py-2 text-xs text-[#302C29] focus:outline-none resize-none"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isSubmitting ? 'Opening WhatsApp...' : 'BOOK THROUGH WHATSAPP'}</span>
            </button>
          </form>

          {/* Direct Phone Call Alternative */}
          <div className="pt-2 border-t border-[#E9E0D5] flex items-center justify-between text-xs font-mono text-[#887D73]">
            <span>Prefer a direct phone call?</span>
            <a
              href={CALL_HREF}
              className="text-[#302C29] font-medium hover:text-[#C5A059] flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{CALL_NUMBER}</span>
            </a>
          </div>

          <p className="text-[10px] text-[#887D73] font-light text-center leading-tight">
            * Note: Sending this request opens WhatsApp to verify slot availability directly with salon reception. Appointments are confirmed upon salon reply.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
