'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Phone, 
  MapPin, 
  Calendar, 
  Navigation, 
  ExternalLink,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { SALON_CONFIG } from '@/config/salon-config';
import { QUICK_QUESTIONS, AnswerPayload } from '@/config/salon-knowledge-base';
import { createQuickWhatsAppUrl } from '@/lib/whatsapp';

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  time: string;
  showWhatsAppButton?: boolean;
  showDirectionsButton?: boolean;
  serviceContext?: string;
  whatsappMessage?: string;
}

export default function AuraAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: "Hello! Welcome to Aura The Salon. I'm Aura Assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isTyping) return;

    setHasInteracted(true);
    setInputMessage('');

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      const data = await res.json();
      const payload: AnswerPayload = data?.result || {
        answer: "I don't have confirmed information about that yet. Please contact Aura The Salon directly on WhatsApp for accurate details.",
        showWhatsAppButton: true,
        source: 'fallback-boundary'
      };

      // Extract service context if user mentioned any confirmed service
      const lowerQuery = query.toLowerCase();
      let detectedService: string | undefined = payload.serviceContext;
      if (!detectedService) {
        if (lowerQuery.includes('hair cut') || lowerQuery.includes('haircut') || lowerQuery.includes('cut')) {
          detectedService = 'Hair Cut & Styling';
        } else if (lowerQuery.includes('color') || lowerQuery.includes('highlight')) {
          detectedService = 'Hair Color & Highlights';
        } else if (lowerQuery.includes('spa') || lowerQuery.includes('treatment')) {
          detectedService = 'Hair Spa & Treatments';
        } else if (lowerQuery.includes('facial') || lowerQuery.includes('skin')) {
          detectedService = 'Skin Care & Facials';
        } else if (lowerQuery.includes('bridal') || lowerQuery.includes('wedding')) {
          detectedService = 'Bridal & Special Occasions';
        }
      }

      const assistantMsg: Message = {
        id: 'assistant-' + Date.now(),
        sender: 'assistant',
        text: payload.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showWhatsAppButton: payload.showWhatsAppButton,
        showDirectionsButton: payload.showDirectionsButton,
        serviceContext: detectedService,
        whatsappMessage: payload.whatsappMessage
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: 'assistant-' + Date.now(),
        sender: 'assistant',
        text: "I don't have confirmed information about that yet. Please contact Aura The Salon directly on WhatsApp for accurate details.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showWhatsAppButton: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const getWhatsAppBookingUrl = (serviceContext?: string, customMsg?: string) => {
    return createQuickWhatsAppUrl(serviceContext, customMsg);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-[#302C29] text-[#F8F5F0] border border-[#E9E0D5]/30 shadow-xl hover:bg-[#433E3A] transition-all group"
          aria-label="Open Aura Assistant chat"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#C5A059]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <span className="text-xs uppercase tracking-wider font-mono font-medium hidden sm:inline">
            Aura Assistant
          </span>

          {!hasInteracted && !isOpen && (
            <span className="absolute -top-9 right-0 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E9E0D5] text-[#302C29] text-[10px] font-sans shadow-md whitespace-nowrap animate-bounce hidden sm:inline">
              Ask a question ✨
            </span>
          )}
        </motion.button>
      </div>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-20 right-2 sm:right-6 z-50 w-[95vw] sm:w-[420px] max-w-[420px] h-[580px] max-h-[85vh] bg-[#FFFFFF] border border-[#E9E0D5] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#302C29]"
          >
            {/* Header */}
            <div className="p-4 bg-[#F8F5F0] border-b border-[#E9E0D5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#302C29] flex items-center justify-center text-[#C5A059] shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-luxury text-lg text-[#302C29] font-medium leading-none">
                      Aura Assistant
                    </h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] font-mono text-[#887D73] block mt-0.5">
                    Official Guide • Chandrapur
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setMessages([
                      {
                        id: 'welcome-reset',
                        sender: 'assistant',
                        text: "Hello! Welcome to Aura The Salon. I'm Aura Assistant. How can I help you today?",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                  }}
                  className="p-2 rounded-full text-[#887D73] hover:text-[#302C29] hover:bg-[#E9E0D5]/50 transition-colors"
                  title="Reset Conversation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full text-[#887D73] hover:text-[#302C29] hover:bg-[#E9E0D5]/50 transition-colors"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF8F5]/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#302C29] text-[#F8F5F0] rounded-br-xs shadow-xs'
                        : 'bg-[#FFFFFF] text-[#302C29] border border-[#E9E0D5] rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Action Buttons for Handoff */}
                    {msg.sender === 'assistant' && (
                      <div className="mt-2.5 pt-2 border-t border-[#E9E0D5]/60 flex flex-col gap-1.5">
                        {msg.showWhatsAppButton && (
                          <a
                            href={getWhatsAppBookingUrl(msg.serviceContext, msg.whatsappMessage)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>BOOK THROUGH WHATSAPP</span>
                          </a>
                        )}

                        {msg.showDirectionsButton && (
                          <a
                            href={SALON_CONFIG.brand.directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-[#F8F5F0] border border-[#E9E0D5] hover:border-[#887D73] text-[#302C29] font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Navigation className="w-3 h-3 text-[#C5A059]" />
                            <span>Get Directions in Google Maps</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] font-mono text-[#887D73] mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-[#887D73] text-xs font-mono p-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
                  <span>Aura Assistant is replying...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Carousel */}
            <div className="p-2.5 bg-[#FFFFFF] border-t border-[#E9E0D5]">
              <span className="text-[9px] uppercase tracking-wider font-mono text-[#887D73] px-1 block mb-1.5">
                Frequently Asked Questions:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestionClick(q)}
                    disabled={isTyping}
                    className="px-3 py-1.5 rounded-full bg-[#F8F5F0] hover:bg-[#E9E0D5] text-[#302C29] text-[11px] font-sans whitespace-nowrap border border-[#E9E0D5] transition-colors shrink-0 disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#FFFFFF] border-t border-[#E9E0D5] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about hours, location, services..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isTyping}
                className="flex-1 bg-[#F8F5F0] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-[#302C29] placeholder-[#887D73]/70 focus:outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2.5 rounded-xl bg-[#302C29] hover:bg-[#433E3A] text-[#F8F5F0] disabled:opacity-40 transition-all flex items-center justify-center shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-[#C5A059]" />
              </button>
            </form>

            {/* Privacy & Verification Notice Footer */}
            <div className="px-4 py-2 bg-[#F8F5F0] border-t border-[#E9E0D5] text-center">
              <p className="text-[9px] text-[#887D73] font-light leading-tight">
                AI assistant. Final appointments and service details are confirmed directly by salon reception.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
