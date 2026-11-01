'use client';

import React, { useState } from 'react';
import { MessageCircle, Calendar, Clock, Check, Send, Phone, AlertCircle } from 'lucide-react';
import { SALON_CONFIG } from '@/config/salon-config';
import { createWhatsAppAppointmentUrl, CALL_HREF, CALL_NUMBER } from '@/lib/whatsapp';

export default function WhatsAppBookingSection() {
  const brand = SALON_CONFIG.brand;

  const [customerName, setCustomerName] = useState('');
  const [selectedService, setSelectedService] = useState(SALON_CONFIG.services[0]?.name || 'Hair Cut & Styling');
  const [preferredDate, setPreferredDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [optionalMessage, setOptionalMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minDate = new Date().toISOString().split('T')[0];

  const timeOptions = [
    '10:30 AM',
    '11:45 AM',
    '01:15 PM',
    '02:45 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
    '08:15 PM',
  ];

  const handleSendWhatsApp = (e: React.FormEvent) => {
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
      message: optionalMessage,
    });

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="whatsapp-booking" className="py-20 sm:py-28 bg-[#FFFFFF] text-[#302C29] relative border-t border-[#E9E0D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Why Book via WhatsApp */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] uppercase tracking-[0.25em] font-mono">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct WhatsApp Booking</span>
            </div>

            <h2 className="font-serif-luxury text-4xl sm:text-5xl text-[#302C29] font-light leading-tight">
              Request Your Appointment on <span className="italic font-normal text-emerald-700">WhatsApp.</span>
            </h2>

            <p className="text-base text-[#887D73] font-light leading-relaxed">
              Prefer simple, direct communication? Send your appointment request directly to our reception team at Beside SBI, Civil Lines, Chandrapur. We check slot availability in real time and confirm your visit immediately.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100/60 flex items-center justify-center text-emerald-700 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm text-[#302C29] font-light">Fast confirmation directly with salon reception</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100/60 flex items-center justify-center text-emerald-700 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm text-[#302C29] font-light">Flexible rescheduling and consultation on WhatsApp</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100/60 flex items-center justify-center text-emerald-700 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm text-[#302C29] font-light">
                  Direct phone call alternative: <a href={CALL_HREF} className="font-semibold text-[#302C29] hover:text-[#C5A059] underline">{CALL_NUMBER}</a>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick-Booking Box */}
          <div className="lg:col-span-6">
            <div className="card-warm-beige p-7 sm:p-9 rounded-3xl border border-[#E9E0D5] shadow-sm space-y-5">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#887D73] font-mono block">
                  Interactive Appointment Request
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#302C29] font-light mt-0.5">
                  Send Booking Request
                </h3>
                <p className="text-xs text-[#887D73] font-light mt-1">
                  Fill in your details to open WhatsApp with a pre-formatted message.
                </p>
              </div>

              {validationError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{validationError}</span>
                </div>
              )}

              <form onSubmit={handleSendWhatsApp} className="space-y-4">
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
                    className="w-full bg-[#FFFFFF] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-4 py-2.5 text-xs text-[#302C29] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono font-medium block">
                    Selected Service *
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-3 py-2.5 text-xs text-[#302C29] focus:outline-none"
                  >
                    {SALON_CONFIG.services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.duration})
                      </option>
                    ))}
                  </select>
                </div>

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
                      className="w-full bg-[#FFFFFF] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-3 py-2.5 text-xs text-[#302C29] font-mono focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono font-medium block">
                      Preferred Time *
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-3 py-2.5 text-xs text-[#302C29] font-mono focus:outline-none"
                    >
                      {timeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono font-medium block">
                    Optional Message
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any notes, hair length, or special styling requests..."
                    value={optionalMessage}
                    onChange={(e) => setOptionalMessage(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-4 py-2 text-xs text-[#302C29] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-[#FFFFFF] font-semibold text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Opening WhatsApp...' : 'SEND REQUEST ON WHATSAPP'}</span>
                </button>
              </form>

              <div className="pt-2 border-t border-[#E9E0D5] flex items-center justify-between text-xs font-mono text-[#887D73]">
                <span>Prefer direct phone call?</span>
                <a
                  href={CALL_HREF}
                  className="text-[#302C29] font-medium hover:text-[#C5A059] flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{CALL_NUMBER}</span>
                </a>
              </div>

              <p className="text-[10px] text-[#887D73] font-light text-center leading-tight">
                * Note: Submitting this form opens WhatsApp. Your appointment is confirmed directly upon response from salon reception.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
