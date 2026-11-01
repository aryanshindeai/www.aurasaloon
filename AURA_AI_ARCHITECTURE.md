# Aura AI — System Architecture & Technical Specifications
**Product:** AURA AI  
**Tagline:** Your Personal Beauty Concierge  
**Client:** Aura The Salon — Beside SBI, Civil Lines, Chandrapur  
**Date:** November 2026 | **Version:** 2.0.0

---

## 1. Architectural Vision

Aura AI is designed as a luxury conversational assistant engineered to serve as both an authoritative salon concierge and a general-purpose artificial intelligence companion. Rather than treating WhatsApp as a surrogate for conversation or relying on static FAQ matching, Aura AI possesses true natural language comprehension, multi-turn session memory, streaming token delivery, and domain grounding.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AURA AI CLIENT INTERFACE                        │
│   (Floating Launcher • Header CTA • Hero Banner • Service Cards CTA)   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                     fetch('/api/chat', { stream: true })
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SECURE API ROUTE                          │
│                      (POST /api/chat, Server-Side)                     │
│                                                                        │
│   1. Sliding Window IP Rate Limiter (30 req/min per client)            │
│   2. Payload Validation & Sanitization (max 2,000 characters)          │
│   3. Multi-Turn Session History Assembler (up to 20 context turns)     │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
            ┌────────────────────────┴────────────────────────┐
            ▼                                                 ▼
┌───────────────────────────────┐ ┌──────────────────────────────────────┐
│  LIVE GEMINI API ENGINE       │ │  INTELLIGENT GROUNDED ENGINE         │
│  (@google/genai SDK)          │ │  (Verified Core Fallback)            │
│                               │ │                                      │
│  - gemini-2.5-flash           │ │  - Verified Salon Knowledge Base     │
│  - gemini-1.5-flash fallback  │ │  - Beauty & Haircare Guidance Matrix │
│  - Real-Time Token Streaming  │ │  - Multi-Turn Session Memory Recall  │
│  - System Prompt Grounding    │ │  - Strict Zero-Hallucination Guard   │
└───────────────┬───────────────┘ └──────────────────┬───────────────────┘
                │                                    │
                └─────────────────┬──────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                SERVER-SENT EVENTS (SSE) STREAM DISPATCH                │
│    ReadableStream: `data: {"text":"...", "model":"..."}\n\n`           │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  FRONTEND STREAM CONSUMER & UI                         │
│  - Real-Time Chunk Assembly & Animated Typing Cursor                   │
│  - Safe Markdown Parser (Headers, Bold, Italics, Lists, Blockquotes)   │
│  - Action Toolbar (Copy, Feedback, Regenerate, New Conversation)       │
│  - Dynamic Handoffs: One-Click WhatsApp Booking & Google Maps Directions│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Functional Modes

### Mode A: Salon Concierge Mode
Aura AI is grounded in verified, owner-confirmed business facts for Aura The Salon:
- **Verified Location:** Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401.
- **Landmark:** Beside State Bank of India (SBI).
- **Telephone:** `+91 86688 06851` (`tel:+918668806851`).
- **WhatsApp:** `https://wa.me/918668806851`.
- **Google Rating:** 4.7 / 5 (Place ID: `ChIJfZdksm_X0jsRkwFrmIZg`).
- **Operating Schedule:** 10:00 AM – 10:00 PM Daily (Monday through Sunday).
- **Confirmed Service Categories:**
  1. Hair Cut & Styling
  2. Hair Color & Highlights
  3. Deep Nourishing Hair Spa
  4. Skin Care & Facials
  5. Bridal & Special Occasion Styling
- **Strict Guardrails:** Never fabricates prices, fake discounts, staff names (e.g., Rahul Verma, Meera Kapoor), awards, or fictitious partnerships.

### Mode B: General AI Conversational Intelligence
Aura AI is equipped with broad multi-domain knowledge. Visitors can ask questions about:
- Artificial intelligence, machine learning, computer science.
- Natural sciences, physics, chemistry, photosynthesis.
- Writing assistance: drafting emails, professional inquiries, creative text.
- Educational explanations and conceptual breakdowns.
- Conversational companionship and reasoning.
- *Critical rule:* Aura AI never rejects a question merely because it is not salon-related.

### Mode C: Beauty & Haircare Guidance
Aura AI provides expert education on:
- Differences between techniques: Balayage vs Highlights vs Global single-process color.
- Daily haircare and scalp hydration routines.
- Pre-appointment prep advice.
- *Medical Boundary:* Aura AI strictly refuses to diagnose medical conditions (e.g. alopecia, psoriasis, severe dermatitis) and instructs visitors to consult a medical doctor or dermatologist.

### Mode D: Multi-Turn Conversation Memory
- Conversation history is maintained within the session.
- The assistant recalls previous statements (e.g. user name, previous questions asked).
- Supports seamless follow-ups without resetting state.

---

## 3. Technical Implementation Details

### Server-Side Route (`/api/chat`)
- **Runtime:** Edge-compatible Node.js dynamic server endpoint (`force-dynamic`).
- **SDK:** Official `@google/genai` (v2.4.0) using `GoogleGenAI`.
- **Streaming:** Native `ReadableStream` streaming SSE text frames.
- **Rate Limiting:** Sliding-window in-memory rate limiter enforcing a maximum of 30 requests/minute per client IP, with `Retry-After: 60` headers on HTTP 429.
- **Security:** API keys (`GEMINI_API_KEY`) remain strictly server-side. No browser exposure.

### Frontend Component (`components/aura-ai.tsx`)
- **State Management:** React hooks maintaining session history, streaming chunks, feedback, and window state.
- **Accessibility:** Escape key handling, keyboard shortcuts (Enter to send, Shift+Enter for newline), high-contrast elements.
- **Streaming Reader:** Asynchronous byte chunk decoding via `ReadableStreamDefaultReader` and `TextDecoder`.
- **Safe Markdown Rendering:** Custom parser formatting paragraphs, headings, bolding, italics, code snippets, and blockquotes without executing unvalidated raw HTML.
- **Global Event Hook:** `open-aura-ai` window event listener enabling Header, Hero, and Service cards to launch Aura AI with tailored contextual prompts.
