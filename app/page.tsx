'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import Navigation from '@/components/navigation';
import Hero from '@/components/hero';
import WelcomeSection from '@/components/welcome-section';
import AboutStory from '@/components/about-story';
import ServicesSection from '@/components/services-section';
import AuraConsultation from '@/components/aura-consultation';
import AuraImageMarquee from '@/components/AuraImageMarquee';
import ReviewsSection from '@/components/reviews-section';
import WhatsAppBookingSection from '@/components/whatsapp-booking-section';
import LocationContact from '@/components/location-contact';
import Footer from '@/components/footer';
import MobileBookingBar from '@/components/mobile-booking-bar';
import { ServiceItem } from '@/config/salon-config';

// Code-split heavy interactive components to ensure sub-200ms initial paint
const AuraAI = dynamic(() => import('@/components/aura-ai'), {
  ssr: false,
});

const BookingModal = dynamic(() => import('@/components/booking-modal'), {
  ssr: false,
});

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<string | undefined>(undefined);

  // Initialize smooth momentum scroll via Lenis (respecting reduced-motion and code-split)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let lenisInstance: any = null;
    let rafId: number | null = null;

    import('lenis').then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
      });

      function raf(time: number) {
        if (!document.hidden && lenisInstance) {
          lenisInstance.raf(time);
        }
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) setBookingService(serviceName);
    setBookingOpen(true);
  };

  const handleSelectServiceForBooking = (service: ServiceItem) => {
    setBookingService(service.name);
    setBookingOpen(true);
  };

  return (
    <main className="relative bg-[#F8F5F0] text-[#302C29] min-h-screen selection:bg-[#E9E0D5] selection:text-[#302C29]">
      {/* 01. Header */}
      <Navigation onOpenBooking={() => handleOpenBooking()} />

      {/* 02. Existing Hero Images, Unchanged */}
      <Hero onOpenBooking={() => handleOpenBooking()} />

      {/* 03. Welcome to Aura */}
      <WelcomeSection />

      {/* 04. About the Salon */}
      <AboutStory onOpenBooking={() => handleOpenBooking()} />

      {/* 05. Confirmed Salon Service Categories */}
      <ServicesSection onSelectService={handleSelectServiceForBooking} />

      {/* 06. AURA AI — Premium Interactive Beauty Consultation */}
      <AuraConsultation onOpenBooking={(serviceName) => handleOpenBooking(serviceName)} />

      {/* 07. World-Class Aura Image Marquee Gallery */}
      <AuraImageMarquee onOpenBooking={(serviceName) => handleOpenBooking(serviceName)} />

      {/* 08. Google Reviews */}
      <ReviewsSection />

      {/* 09. WhatsApp Appointment Section */}
      <WhatsAppBookingSection />

      {/* 10. Contact Information & Google Maps Location */}
      <LocationContact />

      {/* 11. Footer */}
      <Footer onOpenBooking={() => handleOpenBooking()} />

      {/* Mobile Sticky Booking Bar */}
      <MobileBookingBar onOpenBooking={() => handleOpenBooking()} />

      {/* Floating Aura AI Conversational Assistant (Dynamically Loaded) */}
      <AuraAI />

      {/* Booking System Modal (Dynamically loaded strictly on open) */}
      {bookingOpen && (
        <BookingModal
          key={`${bookingService || 'default'}-${bookingOpen}`}
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          initialService={bookingService}
        />
      )}
    </main>
  );
}
