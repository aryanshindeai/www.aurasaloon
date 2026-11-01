'use client';

import React, { useState, useEffect } from 'react';
import { SALON_CONFIG } from '@/config/salon-config';
import { Menu, X, Calendar, Phone, MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createQuickWhatsAppUrl, CALL_HREF, CALL_NUMBER } from '@/lib/whatsapp';

interface NavigationProps {
  onOpenBooking: () => void;
}

export default function Navigation({ onOpenBooking }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = SALON_CONFIG.navigation;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${
          isScrolled
            ? 'py-3.5 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E9E0D5] shadow-sm'
            : 'py-5 bg-gradient-to-b from-[#FFFFFF]/95 via-[#FFFFFF]/70 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Monogram */}
          <a
            href="#"
            className="group flex flex-col items-start whitespace-nowrap shrink-0"
          >
            <span className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.3em] text-[#302C29] group-hover:text-[#C5A059] transition-colors duration-300 uppercase font-light">
              A U R A
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#887D73] font-sans font-medium -mt-1 opacity-90">
              The Salon • Chandrapur
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-[0.18em] text-[#887D73] hover:text-[#302C29] transition-colors duration-300 py-1 relative group font-sans font-medium"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C5A059] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href="#consultation"
              className="px-4 py-2.5 text-xs uppercase tracking-wider text-[#302C29] font-medium bg-[#F8F5F0] hover:bg-[#E9E0D5] border border-[#E9E0D5] rounded-full transition-all duration-300 flex items-center gap-1.5 shadow-xs hover:scale-[1.02]"
              title="Aura AI Interactive Style Consultation"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>AURA AI CONSULTATION</span>
            </a>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-aura-ai'));
                }
              }}
              className="px-3.5 py-2.5 text-xs uppercase tracking-wider text-[#887D73] hover:text-[#302C29] font-medium bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#E9E0D5] rounded-full transition-all duration-300 flex items-center gap-1.5 shadow-xs hover:scale-[1.02]"
              title="Open Aura AI Personal Beauty Concierge Chat"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>ASK AI</span>
            </button>

            <a
              href={CALL_HREF}
              className="text-xs tracking-wider text-[#887D73] hover:text-[#302C29] flex items-center gap-1.5 font-mono transition-colors"
              title={`Call ${CALL_NUMBER}`}
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{CALL_NUMBER}</span>
            </a>

            <a
              href={createQuickWhatsAppUrl('General Consultation', 'Inquiring via website header')}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors"
              title="WhatsApp Aura The Salon"
              aria-label="WhatsApp Aura The Salon"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 text-xs uppercase tracking-widest text-[#F8F5F0] font-semibold bg-[#302C29] hover:bg-[#433E3A] rounded-full transition-all duration-300 shadow-sm flex items-center gap-2 hover:scale-[1.02]"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>BOOK APPOINTMENT</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full text-[#302C29] bg-[#FFFFFF] border border-[#E9E0D5] hover:border-[#887D73]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#302C29]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-[#F8F5F0]/98 backdrop-blur-xl pt-24 px-6 pb-20 flex flex-col justify-between sm:hidden"
          >
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#887D73] font-mono block">
                Menu
              </span>
              <nav className="flex flex-col space-y-4">
                <a
                  href="#consultation"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-serif-luxury text-[#C5A059] hover:text-[#302C29] tracking-wider transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                  <span>AURA AI CONSULTATION</span>
                </a>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-serif-luxury text-[#302C29] hover:text-[#C5A059] tracking-wider transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#E9E0D5]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('open-aura-ai'));
                  }
                }}
                className="w-full py-3 rounded-full bg-[#FFFFFF] border border-[#C5A059] text-[#302C29] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>ASK AURA AI CONCIERGE</span>
              </button>

              <a
                href={CALL_HREF}
                className="w-full py-3 rounded-full bg-[#FFFFFF] border border-[#E9E0D5] text-[#302C29] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span>Call {CALL_NUMBER}</span>
              </a>

              <a
                href={createQuickWhatsAppUrl('General Consultation', 'Inquiring via mobile navigation menu')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Aura The Salon</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3.5 rounded-full bg-[#302C29] text-[#F8F5F0] font-semibold text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>BOOK APPOINTMENT</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
