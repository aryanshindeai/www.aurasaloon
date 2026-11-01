'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Send, 
  Square, 
  RotateCcw, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Plus, 
  Maximize2, 
  Minimize2, 
  MessageSquare, 
  Calendar, 
  Navigation, 
  Phone,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { createQuickWhatsAppUrl, CALL_HREF, CALL_NUMBER } from '@/lib/whatsapp';
import { SALON_CONFIG } from '@/config/salon-config';

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  time: string;
  isStreaming?: boolean;
  model?: string;
  suggestWhatsApp?: boolean;
  suggestDirections?: boolean;
  serviceContext?: string;
  feedback?: 'like' | 'dislike' | null;
}

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-aura-ai',
  sender: 'assistant',
  text: "Hello! I'm **Aura**, your personal AI beauty concierge.\n\nYou can ask me about the salon, our confirmed treatments, personalized beauty and haircare guidance, or start our **[Interactive Beauty Consultation](#consultation)** to discover what haircut, color, or spa ritual best suits your lifestyle. What would you like to explore?",
  time: 'Just now'
};

const SUGGESTED_QUERIES = [
  { label: 'Confirmed Services', query: 'What services does Aura offer?' },
  { label: 'Salon Location', query: 'Where is Aura located?' },
  { label: 'Opening Hours', query: 'What are your opening hours?' },
  { label: 'Color vs Highlights', query: 'Explain the difference between hair colouring and highlights.' },
  { label: 'What is AI?', query: 'What is artificial intelligence?' },
  { label: 'Explain Photosynthesis', query: 'Explain photosynthesis.' },
  { label: 'Write Message', query: 'Help me write a professional message.' },
  { label: 'Translate to Marathi', query: 'Translate this into Marathi.' },
  { label: 'Book Appointment', query: 'How can I book an appointment?' }
];

export default function AuraAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeModel, setActiveModel] = useState<string>('Gemini 2.5 Flash');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll when new chunks arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Global event listener: Allows Header, Hero, and Services cards to open Aura AI seamlessly
  useEffect(() => {
    const handleOpenAuraAI = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt?: string; service?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.prompt) {
        // Send message with context
        handleSendMessage(customEvent.detail.prompt, customEvent.detail.service);
      }
    };

    window.addEventListener('open-aura-ai', handleOpenAuraAI as EventListener);
    return () => {
      window.removeEventListener('open-aura-ai', handleOpenAuraAI as EventListener);
    };
  }, []);

  // Fetch AI engine metadata
  useEffect(() => {
    fetch('/api/chat')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.model) {
          setActiveModel(data.configured ? `${data.model} (Live)` : `${data.model} (Ready)`);
        }
      })
      .catch(() => {});
  }, []);

  // Copy message text to clipboard
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Provide thumbs feedback
  const handleFeedback = (id: string, type: 'like' | 'dislike') => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, feedback: msg.feedback === type ? null : type } : msg))
    );
  };

  // Stop current generation stream
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
      setMessages((prev) =>
        prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
      );
    }
  };

  // Clear conversation / New Conversation
  const handleNewConversation = () => {
    handleStopGeneration();
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setErrorMessage(null);
  };

  // Send message and handle streaming
  const handleSendMessage = async (userTextToSend?: string, serviceContextParam?: string) => {
    const text = (userTextToSend || inputMessage).trim();
    if (!text || isGenerating) return;

    setErrorMessage(null);
    setInputMessage('');

    // Prepare multi-turn history for backend
    const currentHistory = messages
      .filter((m) => m.id !== 'welcome-aura-ai')
      .map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        content: m.text
      }));

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `aura-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text,
      time: timestamp
    };

    const newAssistantPlaceholder: ChatMessage = {
      id: assistantMessageId,
      sender: 'assistant',
      text: '',
      time: timestamp,
      isStreaming: true,
      serviceContext: serviceContextParam
    };

    setMessages((prev) => [...prev, newUserMessage, newAssistantPlaceholder]);
    setIsGenerating(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: currentHistory,
          stream: true,
          serviceContext: serviceContextParam
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment before sending another message.');
        }
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Server responded with status ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';

      // Check if response is streaming SSE
      if (contentType.includes('text/event-stream') && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let detectedModel = activeModel;
        let suggestWhatsApp = false;
        let suggestDirections = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const dataContent = trimmed.slice(6).trim();

            if (dataContent === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(dataContent);
              if (parsed.text) {
                accumulatedText += parsed.text;
              }
              if (parsed.model) {
                detectedModel = parsed.model;
              }
              if (parsed.suggestWhatsApp !== undefined) {
                suggestWhatsApp = parsed.suggestWhatsApp;
              }
              if (parsed.suggestDirections !== undefined) {
                suggestDirections = parsed.suggestDirections;
              }

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? {
                        ...m,
                        text: accumulatedText,
                        model: detectedModel,
                        suggestWhatsApp,
                        suggestDirections
                      }
                    : m
                )
              );
            } catch {
              // Non-JSON chunk fallback
              accumulatedText += dataContent;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId ? { ...m, text: accumulatedText } : m
                )
              );
            }
          }
        }

        // Finalize streaming
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  isStreaming: false,
                  text: accumulatedText || 'I have completed your answer.'
                }
              : m
          )
        );
      } else {
        // Non-streaming JSON response fallback
        const json = await response.json();
        const answer = json?.result?.answer || json?.answer || 'Response received.';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  text: answer,
                  isStreaming: false,
                  suggestWhatsApp: json?.result?.suggestWhatsApp,
                  suggestDirections: json?.result?.suggestDirections
                }
              : m
          )
        );
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User deliberately aborted generation
        return;
      }
      console.error('Aura AI client error:', err);
      const fallbackError = err.message || 'Unable to connect to Aura AI. Please check your connection and retry.';
      setErrorMessage(fallbackError);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                isStreaming: false,
                text: `I encountered an issue generating this response: *${fallbackError}*\n\nPlease feel free to retry or ask another question!`
              }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate last assistant response
  const handleRegenerate = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMessage) {
      // Remove last assistant message
      setMessages((prev) => {
        const lastIdx = prev.map((m) => m.sender).lastIndexOf('assistant');
        return lastIdx !== -1 ? prev.filter((_, i) => i !== lastIdx) : prev;
      });
      handleSendMessage(lastUserMessage.text);
    }
  };

  // Safe Lightweight Markdown Renderer Component
  const renderFormattedMarkdown = (content: string) => {
    const paragraphs = content.split('\n\n');

    return (
      <div className="space-y-3 leading-relaxed">
        {paragraphs.map((para, pIdx) => {
          const lines = para.split('\n');

          // Header 3 (###)
          if (para.startsWith('### ')) {
            return (
              <h4 key={pIdx} className="font-serif-luxury text-base font-medium text-[#302C29] mt-2 mb-1">
                {para.replace('### ', '')}
              </h4>
            );
          }

          // Blockquote (> )
          if (para.startsWith('> ')) {
            return (
              <blockquote
                key={pIdx}
                className="pl-3.5 border-l-2 border-[#C5A059] italic text-xs text-[#887D73] bg-[#F8F5F0]/70 py-1.5 rounded-r-lg"
              >
                {para.replace(/^>\s*/, '')}
              </blockquote>
            );
          }

          // Bullet or numbered lists
          if (lines.some((l) => l.trim().startsWith('•') || l.trim().startsWith('-') || /^\d+\./.test(l.trim()))) {
            return (
              <ul key={pIdx} className="space-y-1.5 pl-1">
                {lines.map((line, lIdx) => {
                  const cleaned = line.replace(/^[•\-*]\s*|^\d+\.\s*/, '');
                  return (
                    <li key={lIdx} className="flex items-start gap-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0 mt-1.5" />
                      <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(cleaned) }} />
                    </li>
                  );
                })}
              </ul>
            );
          }

          // Regular paragraph
          return (
            <p
              key={pIdx}
              className="text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseInlineStyles(para) }}
            />
          );
        })}
      </div>
    );
  };

  // Helper to parse bold, italics, inline code and links safely
  const parseInlineStyles = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#302C29]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#E9E0D5]/50 font-mono text-[11px] text-[#302C29]">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <>
      {/* 01. Floating AURA AI Launcher Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-[#302C29] text-[#F8F5F0] border border-[#D4AF37]/40 shadow-2xl hover:border-[#E5C158] transition-all group"
          aria-label="Open Aura AI Personal Beauty Concierge"
        >
          {/* Glowing Aura Ring */}
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#E5C158] animate-pulse" />
            <span className="absolute -inset-1 rounded-full bg-[#E5C158]/20 blur-xs" />
          </div>

          <div className="flex flex-col items-start text-left">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[#F8F5F0] flex items-center gap-1.5">
              <span>AURA AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </span>
            <span className="text-[9px] text-[#887D73] font-light hidden sm:inline -mt-0.5">
              Beauty Concierge
            </span>
          </div>
        </motion.button>
      </div>

      {/* 02. Interactive Conversational Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className={`fixed z-50 bg-[#FFFFFF] border border-[#E9E0D5] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#302C29] ${
              isExpanded
                ? 'inset-3 sm:inset-8 sm:max-w-4xl sm:mx-auto'
                : 'bottom-20 right-2 sm:right-6 w-[95vw] sm:w-[460px] max-w-[460px] h-[640px] max-h-[86vh]'
            }`}
          >
            {/* Header */}
            <div className="p-4 bg-[#F8F5F0] border-b border-[#E9E0D5] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#302C29] flex items-center justify-center text-[#E5C158] shadow-xs border border-[#D4AF37]/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-luxury text-lg text-[#302C29] font-medium leading-none">
                      AURA AI
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-mono uppercase">
                      Live
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#887D73] block mt-0.5">
                    Your Personal Beauty Concierge • {activeModel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Expand / Minimize Window */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 rounded-full text-[#887D73] hover:text-[#302C29] hover:bg-[#E9E0D5]/50 transition-colors hidden sm:inline-flex"
                  title={isExpanded ? 'Restore window size' : 'Expand window'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* New Conversation Button */}
                <button
                  onClick={handleNewConversation}
                  className="p-2 rounded-full text-[#887D73] hover:text-[#302C29] hover:bg-[#E9E0D5]/50 transition-colors"
                  title="Start a new conversation"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full text-[#887D73] hover:text-[#302C29] hover:bg-[#E9E0D5]/50 transition-colors"
                  aria-label="Close Aura AI"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-2.5 px-4 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="line-clamp-1">{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-amber-700 hover:text-amber-900 font-mono text-[10px] underline shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF8F5]/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`relative max-w-[88%] sm:max-w-[85%] rounded-3xl p-4 sm:p-4.5 text-xs shadow-xs transition-all ${
                      msg.sender === 'user'
                        ? 'bg-[#302C29] text-[#F8F5F0] rounded-br-xs'
                        : 'bg-[#FFFFFF] text-[#302C29] border border-[#E9E0D5] rounded-bl-xs'
                    }`}
                  >
                    {/* Render Formatted Markdown */}
                    {msg.sender === 'user' ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    ) : (
                      <>
                        {renderFormattedMarkdown(msg.text)}

                        {/* Streaming Indicator */}
                        {msg.isStreaming && (
                          <span className="inline-block w-2 h-3.5 bg-[#C5A059] ml-1 animate-pulse" />
                        )}

                        {/* Action Handoffs (WhatsApp Booking & Google Maps) */}
                        {(msg.suggestWhatsApp || msg.suggestDirections) && !msg.isStreaming && (
                          <div className="mt-3.5 pt-3 border-t border-[#E9E0D5] flex flex-wrap gap-2">
                            {msg.suggestWhatsApp && (
                              <a
                                href={createQuickWhatsAppUrl(
                                  msg.serviceContext || 'Salon Consultation',
                                  'Inquiring via Aura AI conversation'
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                              >
                                <Calendar className="w-3 h-3" />
                                <span>BOOK THROUGH WHATSAPP</span>
                              </a>
                            )}

                            {msg.suggestDirections && (
                              <a
                                href={SALON_CONFIG.brand.directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-full bg-[#F8F5F0] border border-[#E9E0D5] hover:border-[#887D73] text-[#302C29] font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                              >
                                <Navigation className="w-3 h-3 text-[#C5A059]" />
                                <span>Get Directions</span>
                              </a>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Message Bottom Toolbar for Assistant Messages */}
                  {msg.sender === 'assistant' && !msg.isStreaming && msg.text && (
                    <div className="flex items-center gap-3 mt-1.5 px-2 text-[10px] text-[#887D73] font-mono">
                      <span>{msg.time}</span>
                      <span>•</span>

                      {/* Copy Action */}
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="hover:text-[#302C29] flex items-center gap-1 transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <span>•</span>

                      {/* Feedback Thumbs */}
                      <button
                        onClick={() => handleFeedback(msg.id, 'like')}
                        className={`hover:text-[#302C29] transition-colors ${
                          msg.feedback === 'like' ? 'text-[#C5A059] font-semibold' : ''
                        }`}
                        title="Helpful response"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleFeedback(msg.id, 'dislike')}
                        className={`hover:text-[#302C29] transition-colors ${
                          msg.feedback === 'dislike' ? 'text-stone-700 font-semibold' : ''
                        }`}
                        title="Needs improvement"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {msg.sender === 'user' && (
                    <span className="text-[9px] font-mono text-[#887D73] mt-1 px-2">
                      {msg.time}
                    </span>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions Carousel */}
            {messages.length <= 4 && !isGenerating && (
              <div className="p-2.5 bg-[#FFFFFF] border-t border-[#E9E0D5] shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <a
                    href="#consultation"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 rounded-full bg-[#302C29] text-[#F8F5F0] text-[11px] font-sans font-medium whitespace-nowrap border border-[#302C29] hover:bg-[#433E3A] transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    <span>START PERSONAL CONSULTATION</span>
                  </a>
                  {SUGGESTED_QUERIES.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(s.query)}
                      className="px-3 py-1.5 rounded-full bg-[#F8F5F0] hover:bg-[#E9E0D5] text-[#302C29] text-[11px] font-sans whitespace-nowrap border border-[#E9E0D5] transition-colors shrink-0"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form with Stop / Send Controls */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#FFFFFF] border-t border-[#E9E0D5] flex items-end gap-2 shrink-0"
            >
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Ask about hair, beauty, salon services, or any topic..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isGenerating}
                className="flex-1 bg-[#F8F5F0] border border-[#E9E0D5] focus:border-[#C5A059] rounded-2xl px-4 py-3 text-xs text-[#302C29] placeholder-[#887D73]/70 focus:outline-none transition-colors resize-none max-h-32"
              />

              {isGenerating ? (
                <button
                  type="button"
                  onClick={handleStopGeneration}
                  className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white transition-all flex items-center justify-center shrink-0"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4 fill-white" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-3 rounded-2xl bg-[#302C29] hover:bg-[#433E3A] text-[#F8F5F0] disabled:opacity-30 transition-all flex items-center justify-center shrink-0 shadow-xs"
                  aria-label="Send message to Aura AI"
                >
                  <Send className="w-4 h-4 text-[#E5C158]" />
                </button>
              )}

              {/* Regenerate Button if conversation has messages */}
              {messages.length > 1 && !isGenerating && (
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="p-3 rounded-2xl bg-[#F8F5F0] border border-[#E9E0D5] text-[#887D73] hover:text-[#302C29] transition-all flex items-center justify-center shrink-0"
                  title="Regenerate last response"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Footer Notice */}
            <div className="px-4 py-2 bg-[#F8F5F0] border-t border-[#E9E0D5] flex items-center justify-between text-[10px] text-[#887D73] font-light shrink-0">
              <span>Aura AI • Multi-turn Assistant</span>
              <a
                href={CALL_HREF}
                className="hover:text-[#302C29] flex items-center gap-1 transition-colors"
              >
                <Phone className="w-3 h-3 text-[#C5A059]" />
                <span>Call {CALL_NUMBER}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
