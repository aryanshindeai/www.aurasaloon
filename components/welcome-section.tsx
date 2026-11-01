'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Smile, ShieldCheck } from 'lucide-react';
import { SALON_CONFIG } from '@/config/salon-config';

export default function WelcomeSection() {
  const brand = SALON_CONFIG.brand;

  const highlights = [
    {
      icon: Smile,
      title: "Thoughtful Consultation",
      description: "We listen to what you want. Every haircut, color, or treatment is customized to suit your routine, hair texture, and unique style."
    },
    {
      icon: ShieldCheck,
      title: "Clean & Relaxing Sanctuary",
      description: "Step into a clean, hygienic, and peaceful salon environment where you can unwind, recharge, and enjoy quality time for yourself."
    },
    {
      icon: Heart,
      title: "Everyday Confidence",
      description: "From routine grooming and deep hair spa rituals to bridal celebrations, we ensure you step out feeling refreshed and confident."
    }
  ];

  return (
    <section id="welcome" className="py-20 sm:py-28 bg-[#F8F5F0] text-[#302C29] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9E0D5]/70 border border-[#887D73]/20 text-[#302C29] text-[11px] uppercase tracking-[0.25em] font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Welcome to Aura</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#302C29] font-light leading-tight"
          >
            A place to discover your style and <span className="italic font-normal text-[#887D73]">feel your best.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-[#887D73] font-light leading-relaxed max-w-2xl mx-auto"
          >
            {brand.welcomeMessage}
          </motion.p>
        </div>

        {/* 3 Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="card-ivory p-8 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F5F0] border border-[#E9E0D5] flex items-center justify-center text-[#302C29] group-hover:border-[#C5A059] transition-colors">
                    <Icon className="w-5 h-5 text-[#887D73] group-hover:text-[#C5A059] transition-colors" />
                  </div>

                  <h3 className="font-serif-luxury text-2xl text-[#302C29] font-light">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#887D73] font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E9E0D5]/70 text-[10px] uppercase tracking-widest text-[#887D73] font-mono">
                  Aura Standard 0{idx + 1}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
