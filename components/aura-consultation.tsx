'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  RotateCcw,
  MessageSquare,
  Scissors,
  Palette,
  Droplets,
  Heart,
  HelpCircle,
  Send,
  CheckCircle2,
  Calendar,
  Check,
  AlertCircle
} from 'lucide-react';
import { SALON_CONFIG } from '@/config/salon-config';

export interface ConsultationPreferences {
  styleGoal: string;
  changeLevel: string;
  maintenance: string;
  occasion: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const CATEGORY_DATA = [
  {
    id: 'Haircut & styling',
    title: 'Haircut & styling',
    desc: 'Precision cuts, face-framing layers, bangs, and professional blowouts.',
    icon: Scissors,
    image: '/images/precision_haircut_styling.jpg',
    tagline: 'Precision Sculpting & Silhouette'
  },
  {
    id: 'Hair colour',
    title: 'Hair colour',
    desc: 'Dimensional balayage, babylights, root touch-ups, and rich global tones.',
    icon: Palette,
    image: '/images/hair_color_highlights.jpg',
    tagline: 'Dimensional Tones & Luminosity'
  },
  {
    id: 'Hair treatment',
    title: 'Hair treatment',
    desc: 'Deep nourishing hair spas, restorative scalp care, and intense hydration.',
    icon: Droplets,
    image: '/images/deep_nourishing_hair_spa.jpg',
    tagline: 'Restorative Hair Sanctuary'
  },
  {
    id: 'Beauty services',
    title: 'Beauty services',
    desc: 'Radiance facials, pore cleansing, skin therapy, and rejuvenating rituals.',
    icon: Heart,
    image: '/images/refreshing_radiance_facial.jpg',
    tagline: 'Skin Wellness & Glow'
  },
  {
    id: 'Nail services',
    title: 'Nail services',
    desc: 'Classic manicures, precision shaping, buffing, and cuticle care.',
    icon: Sparkles,
    image: '/images/regenerated_image_1785000416312.png',
    tagline: 'Nail Perfection & Polish'
  },
  {
    id: 'Other enquiries',
    title: 'Other enquiries',
    desc: 'Bridal packages, festive occasion draping, or bespoke consultations.',
    icon: HelpCircle,
    image: '/images/bridal_occasion_styling.jpg',
    tagline: 'Bridal & Occasion Artistry'
  }
];

const CHANGE_LEVELS = [
  { id: 'Subtle & Natural', label: 'Subtle & Natural', desc: 'Maintain current length and natural look with gentle refinement' },
  { id: 'Soft Enhancement', label: 'Soft Enhancement', desc: 'Noticeable freshness with soft framing or delicate dimension' },
  { id: 'Noticeable & Expressive', label: 'Noticeable & Expressive', desc: 'Distinct new silhouette, layers, or visible color tone' },
  { id: 'Complete Transformation', label: 'Complete Transformation', desc: 'A dramatic, bold reset tailored to your facial architecture' }
];

const MAINTENANCE_LEVELS = [
  { id: 'Low maintenance (effortless at-home care)', label: 'Low Maintenance', desc: 'Air-dry friendly, effortless at-home styling, 3-4 months between visits' },
  { id: 'Moderate (every 8-12 weeks)', label: 'Moderate Upkeep', desc: 'Light blow-dry styling, salon refreshes every 8 to 12 weeks' },
  { id: 'High commitment (regular touch-ups)', label: 'High Commitment', desc: 'Polished daily heat styling, salon gloss & root touch-ups every 4-6 weeks' }
];

const OCCASIONS = [
  { id: 'Everyday lifestyle', label: 'Everyday Lifestyle', desc: 'Versatile for work, daily life, gym, and casual outings' },
  { id: 'Special event / Party', label: 'Special Event', desc: 'Cocktails, galas, birthdays, or celebrating milestone events' },
  { id: 'Bridal / Wedding celebration', label: 'Bridal & Wedding', desc: 'Weddings, receptions, sangeet, and festive family occasions' }
];

const QUICK_GOAL_CHIPS = [
  'Face-framing soft layers',
  'Sun-kissed caramel balayage',
  'Deep hydrating hair spa for dry ends',
  'Voluminous blowout that lasts',
  'Radiant bridal hair styling trial'
];

interface AuraConsultationProps {
  onOpenBooking?: (serviceName?: string) => void;
}

export default function AuraConsultation({ onOpenBooking }: AuraConsultationProps) {
  // Navigation & Step State (1: Discover, 2: Preferences, 3: Consultation, 4: Summary)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // User Selections
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Haircut & styling']);
  const [preferences, setPreferences] = useState<ConsultationPreferences>({
    styleGoal: '',
    changeLevel: 'Soft Enhancement',
    maintenance: 'Low maintenance (effortless at-home care)',
    occasion: 'Everyday lifestyle'
  });

  // Photo Upload State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Chat / Consultation Conversation State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasStartedConsultation, setHasStartedConsultation] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll within consultation conversation
  useEffect(() => {
    if (currentStep === 3) {
      conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentStep, isStreaming]);

  // Toggle category in multi-select
  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((item) => item !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorBanner('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorBanner('Image size should be under 5MB.');
      return;
    }

    setErrorBanner(null);
    setUploadedImageName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setUploadedImage(null);
    setUploadedImageName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger Consultation Streaming Call
  const startOrSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage.trim();
    if (isStreaming) return;
    if (customPrompt === undefined && !textToSend && !hasStartedConsultation) return;

    setErrorBanner(null);
    setIsStreaming(true);

    const newMessages: ChatMessage[] = [...messages];
    if (textToSend) {
      newMessages.push({ role: 'user', content: textToSend });
      setMessages(newMessages);
      setInputMessage('');
    }

    // Assistant placeholder
    const assistantIndex = newMessages.length;
    newMessages.push({ role: 'assistant', content: '' });
    setMessages([...newMessages]);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests: selectedInterests,
          preferences,
          history: messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content
          })),
          message: textToSend,
          uploadedImage,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`Consultation service returned status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported by response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        newMessages[assistantIndex].content = accumulated;
        setMessages([...newMessages]);
      }

      setHasStartedConsultation(true);
    } catch (err: any) {
      console.error('Consultation Stream Error:', err);
      setErrorBanner('Consultation connection interrupted. Loading verified recommendations.');
      newMessages[assistantIndex].content =
        `### ✨ Aura Style Guidance for ${selectedInterests.join(' & ')}\n\nBased on your selected interests and preference for **${preferences.changeLevel}** with **${preferences.maintenance}**, our senior stylists at Aura recommend a tailored consultation in person. You can bring your inspiration notes, and our team will analyze your hair texture and face framing to design your ideal look.\n\n*Would you like to review your consultation summary or book an appointment on WhatsApp?*`;
      setMessages([...newMessages]);
      setHasStartedConsultation(true);
    } finally {
      setIsStreaming(false);
    }
  };

  // Launch consultation transition from Step 2 to Step 3
  const proceedToConsultation = () => {
    setCurrentStep(3);
    if (!hasStartedConsultation) {
      startOrSendMessage('');
    }
  };

  // Reset entire consultation
  const handleStartAgain = () => {
    setCurrentStep(1);
    setSelectedInterests(['Haircut & styling']);
    setPreferences({
      styleGoal: '',
      changeLevel: 'Soft Enhancement',
      maintenance: 'Low maintenance (effortless at-home care)',
      occasion: 'Everyday lifestyle'
    });
    handleRemovePhoto();
    setMessages([]);
    setHasStartedConsultation(false);
    setErrorBanner(null);
  };

  // Create WhatsApp Consultation Enquiry URL
  const generateWhatsAppConsultationUrl = () => {
    const interests = selectedInterests.join(', ');
    const goal = preferences.styleGoal || 'Personalized recommendation from Aura AI';
    const latestAdvice = messages.findLast((m) => m.role === 'assistant')?.content.slice(0, 300) || 'Tailored style consultation completed via website.';

    const message = `Hello Aura The Salon!

I completed an AI Beauty Consultation on your website and would like to discuss an appointment.

*Consultation Details:*
• Interested In: ${interests}
• Style Goal: ${goal}
• Desired Change: ${preferences.changeLevel}
• Maintenance Preference: ${preferences.maintenance}
• Occasion: ${preferences.occasion}
${uploadedImageName ? `• Reference Photo: "${uploadedImageName}" (I will share this in chat)` : ''}

*Aura AI Suggested Direction:*
"${latestAdvice.replace(/[*#]/g, '').slice(0, 180)}..."

Could you please advise on availability and stylist consultation for this service?

Thank you!`;

    return `https://wa.me/${SALON_CONFIG.brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  // Determine current display photo for left visual panel
  const primaryCategory = CATEGORY_DATA.find((c) => selectedInterests.includes(c.id)) || CATEGORY_DATA[0];

  return (
    <section id="consultation" className="py-20 sm:py-28 bg-[#F8F5F0] text-[#302C29] relative overflow-hidden border-t border-[#E9E0D5]">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#E9E0D5]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9E0D5]/80 border border-[#887D73]/20 text-[#302C29] text-[11px] uppercase tracking-[0.25em] font-mono shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Aura AI • Personal Beauty Concierge</span>
          </div>

          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#302C29] font-light tracking-tight">
            Let&apos;s discover <span className="italic font-normal text-[#C5A059]">your style.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#887D73] font-light max-w-2xl mx-auto leading-relaxed">
            Your personal beauty consultation starts here. Tell Aura what you&apos;re looking for and explore your options.
          </p>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
            {[
              { step: 1, label: '01. Discover', title: 'Your Interest' },
              { step: 2, label: '02. Preferences', title: 'Your Routine' },
              { step: 3, label: '03. Consultation', title: 'Aura AI Dialogue' },
              { step: 4, label: '04. Summary', title: 'Consultation Plan' }
            ].map((item) => {
              const isActive = currentStep === item.step;
              const isPast = currentStep > item.step;
              return (
                <div
                  key={item.step}
                  onClick={() => {
                    // Allow moving back, or forward to 3/4 if consultation has started
                    if (item.step < currentStep || (item.step === 2 && currentStep === 1)) {
                      setCurrentStep(item.step as any);
                    } else if (item.step === 4 && hasStartedConsultation) {
                      setCurrentStep(4);
                    }
                  }}
                  className={`cursor-pointer transition-all p-3 rounded-2xl border text-center ${
                    isActive
                      ? 'bg-[#302C29] text-[#F8F5F0] border-[#302C29] shadow-md shadow-[#302C29]/10'
                      : isPast
                      ? 'bg-[#FFFFFF] text-[#302C29] border-[#C5A059]/40 hover:border-[#C5A059]'
                      : 'bg-[#FFFFFF]/60 text-[#887D73] border-[#E9E0D5]'
                  }`}
                >
                  <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider font-semibold">
                    {item.label}
                  </div>
                  <div className="text-xs sm:text-sm font-serif-luxury truncate hidden sm:block mt-0.5">
                    {item.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Notification Banner if any */}
        {errorBanner && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorBanner}</span>
            <button
              onClick={() => setErrorBanner(null)}
              className="ml-auto text-amber-800 hover:text-black font-semibold text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Two-Column Editorial Consultation Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Column: Authentic Photography & Visual Dossier */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-[#E9E0D5] bg-[#FFFFFF] shadow-lg group">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full bg-[#14110E]">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded hairstyle reference for consultation"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={primaryCategory.image}
                    alt={`Aura The Salon - ${primaryCategory.title}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 450px"
                    priority
                  />
                )}

                {/* Ambient Visual Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14110E]/90 via-[#14110E]/20 to-transparent pointer-events-none" />

                {/* Top Badge: Verified Authentic Salon Photography */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-[#14110E]/80 backdrop-blur-md border border-[#E5C158]/40 text-[#E5C158] text-[10px] font-mono tracking-wider uppercase">
                    {uploadedImage ? 'Inspiration Reference' : primaryCategory.tagline}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#14110E]/60 backdrop-blur-md text-[9px] text-stone-300 font-mono">
                    Chandrapur
                  </span>
                </div>

                {/* Uploaded Image Active Pill & Remove Control */}
                {uploadedImage && (
                  <div className="absolute top-14 left-4 right-4 flex items-center justify-between p-2 rounded-xl bg-[#14110E]/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs">
                    <span className="truncate max-w-[200px]">{uploadedImageName || 'Reference Photo'}</span>
                    <button
                      onClick={handleRemovePhoto}
                      className="px-2 py-1 rounded-md bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 text-[10px] flex items-center gap-1 transition-colors"
                      title="Remove uploaded inspiration photo"
                    >
                      <X className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}

                {/* Bottom Dossier Overlay */}
                <div className="absolute bottom-5 left-5 right-5 text-[#F8F5F0] space-y-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#E5C158]">
                    Aura Atelier Consultation
                  </span>
                  <h3 className="font-serif-luxury text-2xl font-light leading-snug">
                    {uploadedImage ? 'Custom Style Analysis' : primaryCategory.title}
                  </h3>
                  <p className="text-xs text-stone-300 font-light line-clamp-2">
                    {uploadedImage
                      ? 'Analyzing cut, volume, and texture harmony for your face shape.'
                      : primaryCategory.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Consultation Fact Card */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E9E0D5] space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#302C29] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                <span>What to Expect at Aura</span>
              </div>
              <ul className="text-xs text-[#887D73] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                  <span>Personal face-shape and crown analysis with our experienced stylists.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                  <span>Transparent quotes upfront — no hidden surprises or unsolicited add-ons.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                  <span>Personalized maintenance plan so you can maintain your look effortlessly.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Step-by-Step Interactive Workflow */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E9E0D5] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg min-h-[560px] flex flex-col justify-between">
            {/* STEP 1: DISCOVER YOUR INTEREST */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
                      Step 01 of 04
                    </span>
                    <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#302C29] font-light mt-1">
                      Which treatments are you exploring today?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#887D73] font-light mt-1">
                      Select one or multiple service categories to personalize your consultation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {CATEGORY_DATA.map((cat) => {
                      const isSelected = selectedInterests.includes(cat.id);
                      const IconComponent = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleInterest(cat.id)}
                          className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 group relative ${
                            isSelected
                              ? 'bg-[#302C29] text-[#F8F5F0] border-[#302C29] shadow-md shadow-[#302C29]/10'
                              : 'bg-[#F8F5F0]/60 text-[#302C29] border-[#E9E0D5] hover:bg-[#FAF8F5] hover:border-[#887D73]/40'
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-[#FFFFFF]/15 text-[#C5A059]'
                                : 'bg-[#FFFFFF] text-[#887D73] border border-[#E9E0D5] group-hover:text-[#302C29]'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-sans font-medium text-xs sm:text-sm tracking-wide">
                                {cat.title}
                              </span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                              )}
                            </div>
                            <p
                              className={`text-[11px] leading-relaxed line-clamp-2 ${
                                isSelected ? 'text-stone-300' : 'text-[#887D73]'
                              }`}
                            >
                              {cat.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E9E0D5] flex items-center justify-between">
                  <span className="text-xs text-[#887D73] font-mono">
                    {selectedInterests.length} {selectedInterests.length === 1 ? 'service' : 'services'} selected
                  </span>
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={selectedInterests.length === 0}
                    className="px-6 py-3 rounded-full bg-[#302C29] hover:bg-[#433E3A] text-[#F8F5F0] font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <span>Next: Set Preferences</span>
                    <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: UNDERSTAND YOUR PREFERENCES */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2 scrollbar-none">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
                      Step 02 of 04
                    </span>
                    <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#302C29] font-light mt-1">
                      Tell us about your style & routine
                    </h3>
                    <p className="text-xs sm:text-sm text-[#887D73] font-light mt-1">
                      The more context you give, the more tailored Aura AI&apos;s recommendations will be.
                    </p>
                  </div>

                  {/* Question 1: Style Goal */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#302C29] font-semibold block">
                      1. What style or goal are you considering?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Soft face-framing layers, warm caramel balayage, or deep hydration"
                      value={preferences.styleGoal}
                      onChange={(e) =>
                        setPreferences({ ...preferences, styleGoal: e.target.value })
                      }
                      className="w-full bg-[#F8F5F0] border border-[#E9E0D5] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#302C29] placeholder-[#887D73]/60 focus:outline-none focus:border-[#C5A059] transition-colors"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {QUICK_GOAL_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, styleGoal: chip })}
                          className="px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E9E0D5] text-[10px] font-mono text-[#887D73] hover:text-[#302C29] hover:border-[#C5A059] transition-colors"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question 2: Change Level */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#302C29] font-semibold block">
                      2. Subtle or noticeable transformation?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CHANGE_LEVELS.map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, changeLevel: lvl.id })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            preferences.changeLevel === lvl.id
                              ? 'bg-[#302C29] text-[#F8F5F0] border-[#302C29]'
                              : 'bg-[#F8F5F0]/60 text-[#302C29] border-[#E9E0D5] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="text-xs font-medium">{lvl.label}</div>
                          <div
                            className={`text-[10px] mt-0.5 line-clamp-1 ${
                              preferences.changeLevel === lvl.id ? 'text-stone-300' : 'text-[#887D73]'
                            }`}
                          >
                            {lvl.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question 3: Maintenance Level */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#302C29] font-semibold block">
                      3. Maintenance & home upkeep commitment?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {MAINTENANCE_LEVELS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, maintenance: m.id })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            preferences.maintenance === m.id
                              ? 'bg-[#302C29] text-[#F8F5F0] border-[#302C29]'
                              : 'bg-[#F8F5F0]/60 text-[#302C29] border-[#E9E0D5] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="text-xs font-medium">{m.label}</div>
                          <div
                            className={`text-[10px] mt-0.5 line-clamp-2 ${
                              preferences.maintenance === m.id ? 'text-stone-300' : 'text-[#887D73]'
                            }`}
                          >
                            {m.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question 4: Occasion */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#302C29] font-semibold block">
                      4. Everyday wear or special occasion?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {OCCASIONS.map((occ) => (
                        <button
                          key={occ.id}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, occasion: occ.id })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            preferences.occasion === occ.id
                              ? 'bg-[#302C29] text-[#F8F5F0] border-[#302C29]'
                              : 'bg-[#F8F5F0]/60 text-[#302C29] border-[#E9E0D5] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="text-xs font-medium">{occ.label}</div>
                          <div
                            className={`text-[10px] mt-0.5 line-clamp-1 ${
                              preferences.occasion === occ.id ? 'text-stone-300' : 'text-[#887D73]'
                            }`}
                          >
                            {occ.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Hairstyle Inspiration Upload */}
                  <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#E9E0D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-[#C5A059]" />
                        <span className="text-xs font-mono uppercase tracking-wider text-[#302C29] font-semibold">
                          Optional: Hairstyle Reference Photo
                        </span>
                      </div>
                      <span className="text-[10px] text-[#887D73] font-mono">Max 5MB</span>
                    </div>

                    <p className="text-xs text-[#887D73]">
                      Have a cut or color inspiration from Instagram or Pinterest? Upload it for real-time AI visual analysis.
                    </p>

                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                        id="consultation-file-input"
                      />
                      <label
                        htmlFor="consultation-file-input"
                        className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#E9E0D5] hover:border-[#C5A059] text-[#302C29] text-xs font-mono uppercase tracking-wider cursor-pointer transition-colors shadow-2xs flex items-center gap-2"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{uploadedImage ? 'Change Reference Photo' : 'Upload Inspiration Photo'}</span>
                      </label>

                      {uploadedImage && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-2 rounded-full text-red-600 hover:bg-red-50 text-xs font-mono flex items-center gap-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="text-[10px] text-[#887D73] font-mono italic">
                      🔒 Privacy Promise: Your inspiration photo is analyzed strictly in-memory during this session and is never permanently stored on our servers.
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E9E0D5] flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-3 rounded-full bg-[#F8F5F0] hover:bg-[#E9E0D5] text-[#302C29] text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={proceedToConsultation}
                    className="px-7 py-3 rounded-full bg-gradient-to-r from-[#FFF6DF] via-[#E5C158] to-[#C5A059] hover:brightness-105 text-[#14110E] font-semibold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-md shadow-[#C5A059]/20"
                  >
                    <Sparkles className="w-4 h-4 text-[#14110E]" />
                    <span>Begin AI Consultation</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PERSONAL AI CONSULTATION (INTERACTIVE DIALOGUE) */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
                      Step 03 of 04 • Live Consultation
                    </span>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="text-xs font-mono uppercase tracking-wider text-[#C5A059] hover:text-[#302C29] font-semibold flex items-center gap-1"
                    >
                      <span>View Summary Card</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-serif-luxury text-2xl text-[#302C29] font-light mt-1">
                    Your Personalized Style Analysis
                  </h3>
                </div>

                {/* Live Conversation Stream Box */}
                <div className="flex-1 max-h-[380px] overflow-y-auto space-y-4 p-4 rounded-2xl bg-[#F8F5F0]/70 border border-[#E9E0D5] text-xs sm:text-sm">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-[#302C29] text-[#C5A059] flex items-center justify-center shrink-0 shadow-xs">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div
                        className={`p-4 rounded-2xl max-w-[88%] leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-[#302C29] text-[#F8F5F0] rounded-tr-xs'
                            : 'bg-[#FFFFFF] text-[#302C29] border border-[#E9E0D5] rounded-tl-xs shadow-xs'
                        }`}
                      >
                        <div className="whitespace-pre-wrap font-sans">
                          {msg.content || (
                            <span className="inline-flex items-center gap-1 text-[#887D73] font-mono text-xs">
                              <Sparkles className="w-3 h-3 animate-spin text-[#C5A059]" />
                              <span>Aura AI is formulating your style roadmap...</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={conversationEndRef} />
                </div>

                {/* Follow-up question input */}
                <div className="space-y-3 pt-2 border-t border-[#E9E0D5]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      startOrSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Ask a follow-up or refine (e.g., 'Will this suit wavy hair?', 'Is it easy to blow dry?')..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={isStreaming}
                      className="flex-1 bg-[#F8F5F0] border border-[#E9E0D5] rounded-full px-4 py-2.5 text-xs text-[#302C29] placeholder-[#887D73]/60 focus:outline-none focus:border-[#C5A059] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isStreaming || !inputMessage.trim()}
                      className="p-2.5 rounded-full bg-[#302C29] hover:bg-[#433E3A] text-[#F8F5F0] transition-colors disabled:opacity-40"
                    >
                      <Send className="w-4 h-4 text-[#C5A059]" />
                    </button>
                  </form>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-mono uppercase tracking-wider text-[#887D73] hover:text-[#302C29] flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Edit Preferences</span>
                    </button>

                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-2.5 rounded-full bg-[#302C29] text-[#F8F5F0] font-semibold text-xs uppercase tracking-wider hover:bg-[#433E3A] flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <span>Proceed to Summary</span>
                      <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: PERSONALIZED CONSULTATION SUMMARY */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-5 max-h-[460px] overflow-y-auto pr-2 scrollbar-none">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
                      Step 04 of 04 • Final Dossier
                    </span>
                    <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#302C29] font-light mt-1">
                      Your Consultation Summary
                    </h3>
                    <p className="text-xs text-[#887D73] font-light mt-0.5">
                      Present this summary directly to your stylist at Aura The Salon Chandrapur.
                    </p>
                  </div>

                  {/* Summary Dossier Card */}
                  <div className="p-5 rounded-2xl bg-[#F8F5F0] border border-[#E9E0D5] space-y-4">
                    {/* Selected Interests */}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#887D73] block mb-1.5 font-medium">
                        Selected Service Interests:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedInterests.map((interest) => (
                          <span
                            key={interest}
                            className="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E9E0D5] text-xs font-mono font-medium text-[#302C29]"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Preferences Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#E9E0D5]/80 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E9E0D5]">
                        <span className="text-[10px] font-mono uppercase text-[#887D73] block">Transformation</span>
                        <span className="font-medium text-[#302C29] mt-0.5 block">{preferences.changeLevel}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E9E0D5]">
                        <span className="text-[10px] font-mono uppercase text-[#887D73] block">Upkeep</span>
                        <span className="font-medium text-[#302C29] mt-0.5 block truncate">{preferences.maintenance}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E9E0D5]">
                        <span className="text-[10px] font-mono uppercase text-[#887D73] block">Occasion</span>
                        <span className="font-medium text-[#302C29] mt-0.5 block">{preferences.occasion}</span>
                      </div>
                    </div>

                    {/* Stated Style Goal */}
                    {preferences.styleGoal && (
                      <div className="pt-2 border-t border-[#E9E0D5]/80 text-xs">
                        <span className="text-[10px] font-mono uppercase text-[#887D73] block">Your Style Goal</span>
                        <p className="text-[#302C29] font-medium mt-0.5 italic">
                          &ldquo;{preferences.styleGoal}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Key Discussion Points for the Stylist */}
                    <div className="pt-2 border-t border-[#E9E0D5]/80 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#302C29] font-semibold block">
                        📋 Checklist for Your In-Person Stylist:
                      </span>
                      <ul className="text-xs text-[#887D73] space-y-1.5">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span>Assess natural hair fall and crown growth direction.</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span>Verify undertones (warm, cool, or neutral) before color application.</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span>Demonstrate quick 5-minute home blowout styling techniques.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 3 Prominent Mandatory Action Buttons */}
                <div className="pt-6 border-t border-[#E9E0D5] flex flex-col sm:flex-row gap-3">
                  {/* Action 1: Continue Conversation */}
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-3 px-4 rounded-full bg-[#FFFFFF] border border-[#E9E0D5] hover:border-[#302C29] text-[#302C29] text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>CONTINUE CONVERSATION</span>
                  </button>

                  {/* Action 2: Start Again */}
                  <button
                    onClick={handleStartAgain}
                    className="py-3 px-4 rounded-full bg-[#F8F5F0] hover:bg-[#E9E0D5] text-[#887D73] hover:text-[#302C29] text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    title="Reset and start a fresh consultation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>START AGAIN</span>
                  </button>

                  {/* Action 3: Enquire With Aura on WhatsApp */}
                  <a
                    href={generateWhatsAppConsultationUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>ENQUIRE WITH AURA</span>
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
