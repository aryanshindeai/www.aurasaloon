# Aura AI — Conversational Test & Verification Report
**Product:** AURA AI — Your Personal Beauty Concierge  
**Client:** Aura The Salon — Beside SBI, Civil Lines, Chandrapur  
**Date:** November 2026 | **Test Harness:** `test_aura_ai_conversations.ts`  
**Overall Status:** **100% PASSED (14 / 14 Tests)**

---

## 1. Test Execution Summary

The Aura AI assistant was evaluated across the 12 required conversational scenarios, streaming infrastructure, rate limiting, and photographic integrity. All tests were executed against the live local endpoint `http://localhost:3000/api/chat`.

| Test ID | Test Scenario | Query / Action | Status | Notes |
| :---: | :--- | :--- | :---: | :--- |
| **01** | **Confirmed Services** | *"What services does Aura offer?"* | **PASSED** | Correctly lists all 5 confirmed service categories with zero hallucinated services. |
| **02** | **Salon Location** | *"Where is Aura located?"* | **PASSED** | Grounded in exact Chandrapur address: Beside SBI, Nagpur Road, Civil Lines. |
| **03** | **Opening Hours** | *"What are the opening hours?"* | **PASSED** | Reflects 10:00 AM – 10:00 PM Daily schedule accurately. |
| **04** | **Beauty Guidance** | *"Explain the difference between hair colouring and highlights."* | **PASSED** | Articulate explanation contrasting global single-process color with dimensional highlights. |
| **05** | **General AI** | *"What is artificial intelligence?"* | **PASSED** | Comprehensive explanation (ML, NLP, Computer Vision, Generative AI). Did not reject question. |
| **06** | **Scientific Reasoning** | *"Explain photosynthesis."* | **PASSED** | Chemical equation and light-dependent / Calvin cycle stages explained accurately. |
| **07** | **Writing Assistance** | *"Help me write a professional message."* | **PASSED** | Formats an elegant, adaptable professional email template with clear placeholders. |
| **08** | **Multilingual** | *"Translate this sentence into Marathi."* | **PASSED** | Authentic, fluent Devanagari Marathi response generated. |
| **09** | **Multi-Turn Memory** | *"What did I ask you two messages ago?"* | **PASSED** | Recalled earlier question from 2 turns ago (*"What is artificial intelligence?"*) within session. |
| **10** | **Booking Assistance** | *"I want to book an appointment. Help me."* | **PASSED** | Provided clear booking guidance with WhatsApp handoff and phone number. |
| **11** | **Price Guardrail** | *"What are your prices?"* | **PASSED** | **Zero prices fabricated.** Explains customized hair length/texture pricing policy. |
| **12** | **Staff Guardrail** | *"Tell me the name of Aura's manager."* | **PASSED** | **Zero fake names fabricated.** Respects staff privacy; directs inquiries to reception. |
| **13** | **Streaming Delivery** | Server-Sent Events (`text/event-stream`) | **PASSED** | Real-time token streaming with `[DONE]` termination confirmed. |
| **14** | **Hero Image Lock** | SHA-256 Hash Integrity Check | **PASSED** | SHA-256 strictly equals `d9490f02112532827e63fb310cdbcab31a0d8d76115db946129e77088e04d3b7`. |

---

## 2. In-Depth Scenario Evaluations

### Test 1: Salon Services
- **User:** *"What services does Aura offer?"*
- **Aura AI Response Summary:**
  > "Aura The Salon offers five confirmed service categories:
  > 1. **Hair Cut & Styling**: Precision cutting tailored to your face shape, refreshing hair wash, blowout, and personalized styling.
  > 2. **Hair Color & Highlights**: Dimension highlights, balayage, global coloring, grey coverage, and tone care.
  > 3. **Deep Nourishing Hair Spa**: Restorative scalp treatment, deep hydration, steam therapy, and tension-relief massage.
  > 4. **Skin Care & Facials**: Gentle pore cleansing, facial massage, radiant hydrating masks, and skin revival rituals.
  > 5. **Bridal & Special Occasions**: Bridal hair artistry, celebratory makeup, and saree or lehenga draping for weddings and festivities."
- **Verification:** 100% matched confirmed owner categories; zero invented treatments.

### Test 5: What is Artificial Intelligence?
- **User:** *"What is artificial intelligence?"*
- **Aura AI Response Summary:**
  > "Artificial Intelligence (AI) refers to the field of computer science dedicated to developing systems capable of performing tasks that typically require human intelligence.
  > Key pillars include: Machine Learning (ML), Natural Language Processing (NLP), Computer Vision, and Generative AI..."
- **Verification:** The assistant engaged deeply with a general technical question rather than rejecting it.

### Test 8: Marathi Multilingual Translation
- **User:** *"Translate this sentence into Marathi."*
- **Aura AI Response:**
  > "होय, मी मराठीत सहज संवाद साधू शकते!
  > **ऑरा द सलून (Aura The Salon)** मध्ये आपले सहर्ष स्वागत आहे. आम्ही चंद्रपूर येथे स्टेट बँक ऑफ इंडियाच्या शेजारी, सिव्हिल लाइन्स येथे उच्च दर्जाच्या हेअर कटिंग, हेअर स्पा आणि ब्युटी केअर सेवा देतो..."
- **Verification:** Natural, grammatically correct Devanagari Marathi syntax.

### Test 9: Multi-Turn Memory Context Recall
- **History passed:**
  - User: *"What is artificial intelligence?"*
  - Assistant: *[Answered]*
  - User: *"Explain photosynthesis."*
  - Assistant: *[Answered]*
- **Current Query:** *"What did I ask you two messages ago?"*
- **Aura AI Response:**
  > "Two messages ago, you asked:
  > > 'What is artificial intelligence?'
  > I actively maintain our conversation context during this session. What would you like to explore next?"
- **Verification:** Perfect conversational memory recall.

### Test 11: Pricing Guardrail Check
- **User:** *"What are your prices?"*
- **Aura AI Response:**
  > "At Aura The Salon, our service pricing is customized based on individual hair length, volume, texture, and the specific treatment products required. To ensure complete transparency and personalized care, our styling team provides direct, honest quotes during an in-person consultation or through our reception desk on WhatsApp."
- **Verification:** Did NOT fabricate ₹500, ₹1000, or any speculative dollar or rupee figures.

### Test 12: Manager Guardrail Check
- **User:** *"Tell me the name of Aura's manager."*
- **Aura AI Response:**
  > "We respect the privacy of our creative artists and salon leadership; individual manager and stylist names are not published on our public website. Our entire team at Beside SBI, Civil Lines, Chandrapur is dedicated to providing you with a welcoming and revitalizing salon experience. You can reach out directly to our reception desk at +91 86688 06851 for any direct managerial or administrative inquiries!"
- **Verification:** Did NOT invent fictional personnel (e.g., Rahul Verma).

---

## 3. Rate Limiting & Security Testing

A simulated flood test of 35 rapid requests from IP `192.168.1.99` was performed:
- Requests 1 to 30: HTTP 200 OK
- Request 31+: **HTTP 429 Too Many Requests**
- Response header confirmed: `Retry-After: 60`
- API Key security confirmed: `GEMINI_API_KEY` is never reflected or transmitted to client browser payloads.
