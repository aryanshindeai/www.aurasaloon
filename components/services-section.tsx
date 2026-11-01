'use client';

import React, { useState } from 'react';
import { SALON_CONFIG, ServiceItem } from '@/config/salon-config';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Sparkles, Check, X, Calendar, Search, MessageSquare } from 'lucide-react';
import { createQuickWhatsAppUrl } from '@/lib/whatsapp';

interface ServicesProps {
  onSelectService: (service: ServiceItem) => void;
}

export default function ServicesSection({ onSelectService }: ServicesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Services');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailService, setDetailService] = useState<ServiceItem | null>(null);

  const categories = SALON_CONFIG.serviceCategories;
  const services = SALON_CONFIG.services;

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === 'All Services' || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="services" className="py-20 sm:py-28 bg-[#F8F5F0] text-[#302C29] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9E0D5]/70 border border-[#887D73]/20 text-[#302C29] text-[11px] uppercase tracking-[0.25em] font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Salon Services</span>
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#302C29] font-light">
            Thoughtful Hair & <span className="italic font-normal text-[#887D73]">Beauty Care.</span>
          </h2>
          <p className="text-base text-[#887D73] font-light max-w-xl mx-auto leading-relaxed">
            Every service is tailored to your routine and style preferences. We take time to listen, consult, and ensure you leave feeling your best.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-250 font-mono ${
                  selectedCategory === cat
                    ? 'bg-[#302C29] text-[#F8F5F0] font-medium shadow-sm'
                    : 'bg-[#FFFFFF] border border-[#E9E0D5] text-[#887D73] hover:text-[#302C29] hover:border-[#887D73]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#887D73] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E9E0D5] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#302C29] placeholder-[#887D73]/70 focus:outline-none focus:border-[#C5A059] transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-ivory rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
            >
              <div>
                {/* Image Container with Whole Image Display */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-[#231F1C] flex items-center justify-center">
                  {/* Subtle ambient blurred backdrop so the box is harmoniously filled */}
                  <img
                    src={service.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
                  />
                  {/* Complete whole image without cropping */}
                  <img
                    src={service.image}
                    alt={service.name}
                    className="relative z-10 w-full h-full object-contain filter brightness-[0.99] group-hover:scale-102 transition-transform duration-500"
                  />
                  <span className="absolute top-3.5 right-3.5 z-20 px-3 py-1 rounded-full bg-[#FFFFFF]/90 text-[#302C29] text-[10px] font-mono uppercase tracking-wider border border-[#E9E0D5] backdrop-blur-md shadow-xs">
                    {service.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-1.5 text-[#C5A059] text-xs font-mono font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.duration}</span>
                  </div>

                  <h3 className="font-serif-luxury text-2xl text-[#302C29] font-light group-hover:text-[#C5A059] transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-[#887D73] text-xs font-light leading-relaxed">
                    {service.shortDesc}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    {service.keyBenefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[#302C29] text-xs font-light">
                        <Check className="w-3.5 h-3.5 text-[#A6B19D] shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setDetailService(service)}
                    className="w-1/3 py-2.5 rounded-full bg-[#F8F5F0] border border-[#E9E0D5] hover:border-[#887D73] text-[#302C29] text-xs font-mono uppercase transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onSelectService(service)}
                    className="flex-1 py-2.5 rounded-full bg-[#302C29] text-[#F8F5F0] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#433E3A] active:scale-98 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Book Service</span>
                  </button>
                  <a
                    href={createQuickWhatsAppUrl(service.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                    title={`Request ${service.name} on WhatsApp`}
                    aria-label={`Request ${service.name} on WhatsApp`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>

                {/* Ask Aura AI About This Service */}
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(
                        new CustomEvent('open-aura-ai', {
                          detail: {
                            prompt: `Tell me about the ${service.name} service, what it involves, and how I should prepare.`,
                            service: service.name
                          }
                        })
                      );
                    }
                  }}
                  className="w-full py-2 px-3 rounded-full bg-[#FFFFFF] border border-[#E9E0D5] hover:border-[#C5A059] text-[#302C29] text-[10px] font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors shadow-2xs hover:bg-[#FAF8F5]"
                  title={`Ask Aura AI about ${service.name}`}
                >
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>ASK AURA ABOUT THIS SERVICE</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Not Sure What to Choose - Aura AI Consultation Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FFFFFF] via-[#FAF8F5] to-[#FFFFFF] border border-[#E9E0D5] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#C5A059] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Beauty Guidance</span>
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#302C29] font-light">
              Not sure what to choose? Consult Aura AI
            </h3>
            <p className="text-xs sm:text-sm text-[#887D73] font-light max-w-xl">
              Let&apos;s discover your style with tailored cut, color, and treatment recommendations based on your routine, face shape, and maintenance goals.
            </p>
          </div>

          <a
            href="#consultation"
            className="px-7 py-3.5 rounded-full bg-[#302C29] hover:bg-[#433E3A] text-[#F8F5F0] text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2 shrink-0 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>START PERSONAL CONSULTATION</span>
          </a>
        </div>

        {/* Service Details Modal */}
        <AnimatePresence>
          {detailService && (
            <div className="fixed inset-0 z-50 bg-[#302C29]/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-lg w-full bg-[#FFFFFF] border border-[#E9E0D5] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
              >
                <button
                  onClick={() => setDetailService(null)}
                  className="absolute top-5 right-5 p-2 rounded-full text-[#887D73] hover:text-[#302C29] bg-[#F8F5F0] border border-[#E9E0D5]"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#887D73] font-mono">
                    {detailService.category} • {detailService.duration}
                  </span>
                  <h3 className="font-serif-luxury text-3xl text-[#302C29] font-light">
                    {detailService.name}
                  </h3>
                </div>

                <p className="text-[#887D73] text-sm font-light leading-relaxed">
                  {detailService.fullDesc}
                </p>

                <div className="space-y-2 pt-2 border-t border-[#E9E0D5]">
                  <span className="text-xs uppercase tracking-wider text-[#302C29] font-mono font-medium block">
                    What&apos;s Included:
                  </span>
                  {detailService.keyBenefits.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[#302C29] text-xs">
                      <Check className="w-3.5 h-3.5 text-[#A6B19D] shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => {
                      const serv = detailService;
                      setDetailService(null);
                      onSelectService(serv);
                    }}
                    className="flex-1 py-3.5 rounded-full bg-[#302C29] text-[#F8F5F0] font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#433E3A] transition-all"
                  >
                    <Calendar className="w-4 h-4 text-[#C5A059]" />
                    <span>Book Service</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const sName = detailService.name;
                      setDetailService(null);
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(
                          new CustomEvent('open-aura-ai', {
                            detail: {
                              prompt: `Tell me about the ${sName} service, what it involves, and how I should prepare.`,
                              service: sName
                            }
                          })
                        );
                      }
                    }}
                    className="px-4 py-3.5 rounded-full bg-[#F8F5F0] border border-[#E9E0D5] hover:border-[#C5A059] text-[#302C29] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
                    title="Consult Aura AI about this treatment"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Ask Aura AI</span>
                  </button>

                  <a
                    href={createQuickWhatsAppUrl(detailService.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
