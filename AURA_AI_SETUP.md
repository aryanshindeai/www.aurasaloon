# Aura AI — Setup & Configuration Guide
**Product:** AURA AI — Your Personal Beauty Concierge  
**Client:** Aura The Salon — Beside SBI, Civil Lines, Chandrapur  
**Date:** November 2026 | **Version:** 2.0.0

---

## 1. Prerequisites

- **Node.js:** v20.0.0 or higher (v24 LTS recommended)
- **Google AI Studio API Key:** A valid Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
- **Framework:** Next.js 15 (App Router)

---

## 2. Environment Variables

Create or update `.env.local` in the project root:

```bash
# ==============================================================================
# AURA AI CONFIGURATION
# ==============================================================================

# 1. Your Google Gemini API Key from Google AI Studio
# Get yours at: https://aistudio.google.com/apikey
GEMINI_API_KEY="your_actual_gemini_api_key_here"

# 2. Configurable Model Name (Default: gemini-2.5-flash)
# Supported options: gemini-2.5-flash, gemini-1.5-flash, gemini-2.0-flash
GEMINI_MODEL="gemini-2.5-flash"
```

> **Security Rule:** Never prefix AI credentials with `NEXT_PUBLIC_`. The key must remain exclusively accessible on the server within `/api/chat`.

---

## 3. Supported Language Models

Aura AI is integrated with the official `@google/genai` SDK and supports:

| Model ID | Latency | Reasoning | Best Used For |
| :--- | :--- | :--- | :--- |
| `gemini-2.5-flash` *(Default)* | Ultra-fast (~200ms) | High | Real-time streaming conversational assistant |
| `gemini-1.5-flash` *(Fallback)* | Very fast | Medium-High | High-throughput general conversations |
| `gemini-2.0-flash` | Very fast | High | Advanced multimodal and agent tasks |

If `gemini-2.5-flash` encounters a temporary provider error, the backend automatically attempts graceful fallback to `gemini-1.5-flash`.

---

## 4. Fallback Architecture (When Key is Pending)

If `GEMINI_API_KEY` is not yet configured or is being provisioned:
1. Aura AI **never crashes**.
2. It operates using an intelligent grounded core engine that accurately answers all verified salon facts (services, address, phone, hours, booking steps, haircare routines, color vs highlights).
3. For open-ended general intelligence queries, it clearly and politely informs the user:
   > *"To activate my full generative intelligence for creative writing, coding, and open-ended topics, please configure your `GEMINI_API_KEY` in the project environment (`.env.local`). In the meantime, I can answer any questions about Aura The Salon, our services, location, hours, or haircare advice!"*

---

## 5. Verification Commands

Run the automated test suite locally to verify that all 14 conversational and system scenarios pass:

```bash
# 1. Start the local development server (if not already running)
npm run dev

# 2. Run the conversational test harness
npx tsx test_aura_ai_conversations.ts
```

Check API status directly:
```bash
curl http://localhost:3000/api/chat
```

Expected JSON response:
```json
{
  "product": "AURA AI",
  "tagline": "Your Personal Beauty Concierge",
  "provider": "Google Gemini API",
  "sdk": "@google/genai",
  "model": "gemini-2.5-flash",
  "configured": true,
  "streamingSupported": true,
  "capabilities": [
    "Multi-turn Context Memory",
    "Salon Concierge Mode",
    "General AI Conversation Mode",
    "Beauty & Skincare Guidance",
    "Multilingual Translation (English, Hindi, Marathi)",
    "WhatsApp Booking Handoff"
  ]
}
```

---

## 6. How Aura AI is Surfaced on the Website

1. **Floating Launcher:** Bottom-right luxury champagne trigger with glowing status dot and visible **"AURA AI"** badge.
2. **Header Navigation:** Prominent **"ASK AURA AI"** button in desktop and mobile menu drawer.
3. **Hero Section:** Dedicated luxury introduction card: *"Meet Aura AI — your personal beauty concierge"* with **"START A CONVERSATION"** button.
4. **Services Cards:** Every service card includes **"ASK AURA ABOUT THIS SERVICE"**, opening the chatbot pre-populated with that treatment's context.
