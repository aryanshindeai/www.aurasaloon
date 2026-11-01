'use client';

import React, { useState, useEffect } from 'react';
import { SALON_CONFIG } from '@/config/salon-config';
import { motion } from 'motion/react';
import { Star, MessageCircle, ExternalLink, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function ReviewsSection() {
  const brand = SALON_CONFIG.brand;
  const [placesData, setPlacesData] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/places/details')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (isMounted && json?.place) {
          setPlacesData(json.place);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const experiencePillars = [
    {
      title: "Attentive Listening",
      desc: "Every appointment begins with understanding your preferences, daily routine, and the look you want to achieve."
    },
    {
      title: "Clean & Comfortable Space",
      desc: "Our salon maintains sanitized workstations, comfortable chairs, and a calm atmosphere where you can feel at ease."
    },
    {
      title: "Individual Hair & Skin Care",
      desc: "Personalized hair styling, gentle wash rituals, and radiant facial care designed to complement your natural beauty."
    }
  ];

  const ratingValue = placesData?.rating || null;
  const reviewCount = placesData?.userRatingCount || null;

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-[#F8F5F0] text-[#302C29] relative border-t border-[#E9E0D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9E0D5]/70 border border-[#887D73]/20 text-[#302C29] text-[11px] uppercase tracking-[0.25em] font-mono">
            <Heart className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Client Feedback & Care</span>
          </div>

          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#302C29] font-light">
            Your Experience <span className="italic font-normal text-[#887D73]">Matters to Us.</span>
          </h2>

          <p className="text-base text-[#887D73] font-light max-w-xl mx-auto leading-relaxed">
            We are committed to creating an honest, warm, and refreshing salon experience for everyone who walks through our doors.
          </p>

          {ratingValue && (
            <div className="pt-2 flex items-center justify-center gap-2 text-sm font-mono text-[#302C29]">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-semibold">{ratingValue} / 5.0</span>
              {reviewCount && (
                <span className="text-[#887D73]">({reviewCount} Google Reviews)</span>
              )}
            </div>
          )}
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {experiencePillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-ivory p-8 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F8F5F0] border border-[#E9E0D5] flex items-center justify-center text-[#C5A059]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-serif-luxury text-2xl text-[#302C29] font-light">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#887D73] font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Reviews Community Card */}
        <div className="card-warm-beige p-8 sm:p-12 rounded-3xl border border-[#E9E0D5] max-w-3xl mx-auto text-center space-y-5 shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>

          <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#302C29] font-light">
            Verified Feedback from Our Guests
          </h3>

          <p className="text-sm sm:text-base text-[#887D73] font-light max-w-xl mx-auto leading-relaxed">
            Read authentic reviews from guests who have visited Aura The Salon Beside SBI on Nagpur Road, Chandrapur. We welcome you to share your feedback.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={placesData?.googleMapsUri || brand.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#302C29] text-[#F8F5F0] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#433E3A] transition-colors shadow-sm"
            >
              <ExternalLink className="w-4 h-4 text-[#C5A059]" />
              <span>Read Reviews on Google Maps</span>
            </a>

            <a
              href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent("Hello Aura The Salon, I would like to share feedback about my visit.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#FFFFFF] border border-[#E9E0D5] text-[#302C29] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:border-[#887D73] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Share WhatsApp Feedback</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
