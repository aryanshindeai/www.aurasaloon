'use client';

import React from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink, 
  Navigation, 
  MessageSquare, 
  Star, 
  Compass, 
  CheckCircle2, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';
import { SALON_CONFIG } from '@/config/salon-config';
import GoogleMapsEmbed from '@/components/google-maps-embed';

export default function LocationContact() {
  const brand = SALON_CONFIG.brand;

  // Four Premium Action URLs
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=Aura+The+Salon%2C+Chandrapur&destination_place_id=${brand.placeId}`;
  const callUrl = `tel:+91${brand.phoneClean}`;
  const whatsappAppointmentUrl = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
    'Hello Aura The Salon!\n\nI would like to enquire about an appointment.\n\nPlease share your available appointment timings.'
  )}`;
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=Aura+The+Salon%2C+Chandrapur&query_place_id=${brand.placeId}`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${brand.coordinates.lat},${brand.coordinates.lng}`;

  // Schema.org BeautySalon Local Business Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: brand.name,
    telephone: `+91${brand.phoneClean}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${brand.address.line1}, ${brand.address.line2}`,
      addressLocality: brand.address.city,
      addressRegion: brand.address.state,
      postalCode: brand.address.pincode,
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: brand.coordinates.lat,
      longitude: brand.coordinates.lng
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      bestRating: '5'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        opens: '10:00',
        closes: '22:00'
      }
    ],
    hasMap: googleMapsSearchUrl
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#F8F5F0] text-[#302C29] relative border-t border-[#E9E0D5] overflow-hidden">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Decorative Subtle Ambient Glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#E9E0D5]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16 sm:space-y-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9E0D5]/80 border border-[#887D73]/20 text-[#302C29] text-[11px] uppercase tracking-[0.25em] font-mono shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>AURA THE SALON · CHANDRAPUR</span>
          </div>

          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#302C29] font-light tracking-tight">
            Find your way <span className="italic font-normal text-[#C5A059]">to Aura.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#887D73] font-light max-w-2xl mx-auto leading-relaxed">
            Your next beauty experience is waiting. Visit us in the heart of Chandrapur.
          </p>
        </div>

        {/* Main Location & Map Experience Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Panel: Luxury Location Information Panel (Desktop: 5 cols) */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E9E0D5] rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Brand & Rating Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E9E0D5]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] block">
                    Verified Atelier
                  </span>
                  <h3 className="font-serif-luxury text-3xl text-[#302C29] font-light tracking-wide mt-0.5">
                    Aura The Salon
                  </h3>
                  <span className="text-xs text-[#887D73] font-sans font-light">
                    Civil Lines • Chandrapur
                  </span>
                </div>

                {/* Google Rating Badge */}
                <a
                  href={googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-2xl bg-[#F8F5F0] border border-[#E9E0D5] hover:border-[#C5A059] transition-all flex flex-col items-center shadow-2xs group"
                  title="View genuine Google customer reviews"
                >
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-mono font-semibold text-[#302C29]">
                      {brand.rating}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-[#887D73] group-hover:text-[#302C29] mt-0.5 underline">
                    Google Reviews
                  </span>
                </a>
              </div>

              {/* Exact Address & Landmark */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#F8F5F0] border border-[#E9E0D5] text-[#C5A059] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#887D73] block">
                      Salon Address
                    </span>
                    <p className="text-sm text-[#302C29] font-sans font-normal leading-relaxed">
                      Beside SBI, Nagpur Road,
                      <br />
                      Bapat Nagar Square, Civil Lines,
                      <br />
                      Chandrapur, Maharashtra 442401.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8F5F0]/70 border border-[#E9E0D5] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#887D73]">Landmark:</span>
                  <span className="font-semibold text-[#302C29]">Beside SBI (State Bank of India)</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8F5F0]/70 border border-[#E9E0D5] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#887D73]">Plus Code:</span>
                  <span className="text-[#302C29] font-mono">{brand.plusCode}</span>
                </div>
              </div>

              {/* Verified Hours & Telephone */}
              <div className="space-y-3 pt-4 border-t border-[#E9E0D5]">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#F8F5F0] border border-[#E9E0D5] text-[#C5A059] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#887D73] block">
                      Opening Hours
                    </span>
                    <p className="text-sm text-[#302C29] font-semibold font-mono">
                      {brand.hours}
                    </p>
                    <p className="text-[11px] text-[#887D73] font-light italic">
                      {brand.hoursNote}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#F8F5F0] border border-[#E9E0D5] text-[#C5A059] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#887D73] block">
                      Direct Telephone
                    </span>
                    <a
                      href={callUrl}
                      className="text-sm font-mono font-medium text-[#302C29] hover:text-[#C5A059] transition-colors"
                    >
                      +91 {brand.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* The Four Premium Action Buttons */}
            <div className="pt-6 border-t border-[#E9E0D5] space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#887D73] font-medium block">
                Quick Actions
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* ACTION 01: GET DIRECTIONS */}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-2xl bg-[#302C29] hover:bg-[#433E3A] text-[#F8F5F0] font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
                  title="Open Google Maps directions to Aura The Salon Chandrapur"
                >
                  <Navigation className="w-4 h-4 text-[#C5A059]" />
                  <span>GET DIRECTIONS</span>
                </a>

                {/* ACTION 02: CALL THE SALON */}
                <a
                  href={callUrl}
                  className="px-4 py-3 rounded-2xl bg-[#F8F5F0] hover:bg-[#E9E0D5] text-[#302C29] font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 border border-[#E9E0D5] transition-all hover:scale-[1.02]"
                  title={`Call +91 ${brand.phone}`}
                >
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  <span>CALL THE SALON</span>
                </a>

                {/* ACTION 03: WHATSAPP APPOINTMENT */}
                <a
                  href={whatsappAppointmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
                  title="Send WhatsApp appointment enquiry"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WHATSAPP</span>
                </a>

                {/* ACTION 04: OPEN GOOGLE MAPS */}
                <a
                  href={googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-2xl bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#302C29] font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 border border-[#E9E0D5] hover:border-[#302C29] transition-all hover:scale-[1.02]"
                  title="Open Aura The Salon in Google Maps"
                >
                  <ExternalLink className="w-4 h-4 text-[#C5A059]" />
                  <span>OPEN GOOGLE MAPS</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Panel: Premium Google Map Experience (Desktop: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <GoogleMapsEmbed className="h-full" />
          </div>
        </div>

        {/* Section 06: Location Discovery Experience ("Right here in Chandrapur") */}
        <div className="bg-[#FFFFFF] border border-[#E9E0D5] rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E9E0D5]">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C5A059] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Finding Us With Ease</span>
              </div>
              <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#302C29] font-light">
                Right here in Chandrapur.
              </h3>
              <p className="text-xs sm:text-sm text-[#887D73] font-light max-w-xl">
                A calm beauty sanctuary positioned right beside SBI at Bapat Nagar Square, Civil Lines.
              </p>
            </div>

            {/* Optional Google Street View surroundings button */}
            <a
              href={streetViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#F8F5F0] hover:bg-[#E9E0D5] border border-[#E9E0D5] text-[#302C29] text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors self-start md:self-auto shrink-0 shadow-2xs"
              title="Explore surroundings on Google Maps Street View"
            >
              <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>EXPLORE SURROUNDINGS</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Authentic Atelier Preview for Easy Recognition (Whole Image Shown) */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#E9E0D5] aspect-[4/3] bg-[#14110E] shadow-sm flex items-center justify-center">
              {/* Subtle ambient backdrop */}
              <img
                src="/images/aura_chandrapur_atelier.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
              />
              {/* Complete whole image without cropping */}
              <img
                src="/images/aura_chandrapur_atelier.jpg"
                alt="Aura The Salon - Verified Interior & Styling Atelier"
                className="relative z-10 w-full h-full object-contain filter brightness-[0.99]"
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#14110E]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 z-20 text-[#F8F5F0] text-xs flex items-center justify-between pointer-events-none">
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#E5C158] font-medium drop-shadow-sm">
                  Verified Atelier Space
                </span>
                <span className="text-[10px] text-stone-200 font-mono drop-shadow-sm">
                  Civil Lines
                </span>
              </div>
            </div>

            {/* Right: Three Clear Wayfinding Milestones */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#E9E0D5] space-y-1.5">
                <div className="text-[#C5A059] font-mono text-xs font-semibold uppercase">
                  01. Landmark
                </div>
                <div className="font-medium text-xs text-[#302C29]">
                  Beside SBI
                </div>
                <p className="text-[11px] text-[#887D73] leading-relaxed">
                  Located directly beside the State Bank of India on Nagpur Road.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#E9E0D5] space-y-1.5">
                <div className="text-[#C5A059] font-mono text-xs font-semibold uppercase">
                  02. Junction
                </div>
                <div className="font-medium text-xs text-[#302C29]">
                  Bapat Nagar Square
                </div>
                <p className="text-[11px] text-[#887D73] leading-relaxed">
                  Easy to locate at Bapat Nagar Square with convenient roadside access.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#E9E0D5] space-y-1.5">
                <div className="text-[#C5A059] font-mono text-xs font-semibold uppercase">
                  03. Area
                </div>
                <div className="font-medium text-xs text-[#302C29]">
                  Civil Lines District
                </div>
                <p className="text-[11px] text-[#887D73] leading-relaxed">
                  Tranquil setting in Chandrapur with dedicated guest parking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
