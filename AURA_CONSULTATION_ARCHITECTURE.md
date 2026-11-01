# AURA AI — INTERACTIVE BEAUTY CONSULTATION ARCHITECTURE

**System Specification & Implementation Dossier**  
**Project:** Aura The Salon — Chandrapur, Maharashtra  
**Place ID:** `ChIJfZdksm_X0jsRkwFrmIZg`  
**Contact:** `+91 86688 06851` | WhatsApp: `https://wa.me/918668806851`  
**Status:** Implemented & Verified in Production Build

---

## 1. Executive Summary & Objective

**AURA AI: Your Personal Beauty Concierge** is an interactive, multi-step digital consultation atelier embedded directly into the Aura The Salon homepage (`#consultation`).

Inspired by the spatial editorial walkthrough concept of luxury fashion and salon ateliers, it provides visitors with:
- **Large authentic photography** mapped directly to verified salon services.
- **Selectable beauty interest categories** with multi-select support.
- **Natural conversational preference inputs** covering transformation depth, upkeep commitment, and occasions.
- **Optional reference photo upload** with live in-memory AI image analysis and client-side photo deletion controls.
- **Real-time LLM streaming dialogue** with multi-turn reasoning and grounded salon constraints.
- **Personalized Consultation Summary Dossier** with verified salon recommendations, discussion checklists, and three primary action controls (`CONTINUE CONVERSATION`, `START AGAIN`, `ENQUIRE WITH AURA`).

---

## 2. Multi-Surface System Integration

To ensure maximum discoverability without confusing general chat with in-depth style consultations, Aura AI operates across distinct surfaces:

| Surface | Location | UI Element | Interaction |
| :--- | :--- | :--- | :--- |
| **01. Desktop Navigation** | `components/navigation.tsx` | `AURA AI CONSULTATION` pill button | Smooth scroll directly to `#consultation` |
| **02. Mobile Menu** | `components/navigation.tsx` | `AURA AI CONSULTATION` menu entry | Closes menu, scrolls to `#consultation` |
| **03. Hero Section** | `components/hero.tsx` | `DISCOVER YOUR STYLE` banner button | Scrolls to `#consultation` |
| **04. Services Section** | `components/services-section.tsx` | *“Not sure what to choose? Consult Aura AI”* banner | Direct CTA to `#consultation` |
| **05. Floating Chatbot** | `components/aura-ai.tsx` | `START PERSONAL CONSULTATION` carousel chip | Minimizes floating chat, navigates to `#consultation` |
| **06. Dedicated Section** | `app/page.tsx` (`#consultation`) | Full two-column interactive editorial atelier | Complete 4-step consultation experience |

---

## 3. Four-Step Interactive Consultation Flow

```
┌─────────────────┐       ┌────────────────────┐       ┌──────────────────────┐       ┌───────────────────┐
│   01. DISCOVER  │ ────► │  02. PREFERENCES   │ ────► │   03. CONSULTATION   │ ────► │    04. SUMMARY    │
│  Choose Interests│       │  Routine & Goals   │       │ Real-Time AI Dialogue│       │  Dossier & Actions│
└─────────────────┘       └────────────────────┘       └──────────────────────┘       └───────────────────┘
```

### Step 01: Discover Your Interest
- 6 verified category choices:
  1. **Haircut & styling**: Precision cuts, face framing, layers, blowout.
  2. **Hair colour**: Dimensional balayage, babylights, root touch-up, global color.
  3. **Hair treatment**: Deep nourishing hair spa, restorative scalp hydration.
  4. **Beauty services**: Radiance facials, gentle pore cleansing, skin therapy.
  5. **Nail services**: Manicure, nail care, shaping, polish.
  6. **Other enquiries**: Bridal packages, festive occasion draping, bespoke trials.
- **Multi-select enabled**: Clients exploring a cut plus a hair spa or balayage can select both.
- Dynamic visual update: The left-column hero photography switches smoothly to highlight the primary selected treatment.

### Step 02: Understand Your Preferences
1. **Style Goal / Consideration:** Open text field accompanied by quick suggestion chips (*“Face-framing soft layers”*, *“Sun-kissed caramel balayage”*, *“Deep hydrating hair spa”*, *“Voluminous blowout”*, *“Radiant bridal trial”*).
2. **Change Level:**
   - *Subtle & Natural*
   - *Soft Enhancement*
   - *Noticeable & Expressive*
   - *Complete Transformation*
3. **Maintenance Commitment:**
   - *Low Maintenance (effortless at-home care)*
   - *Moderate Upkeep (every 8–12 weeks)*
   - *High Commitment (regular touch-ups)*
4. **Occasion:**
   - *Everyday Lifestyle*
   - *Special Event / Party*
   - *Bridal & Wedding Celebration*
5. **Optional Hairstyle Inspiration Photo:**
   - Drag-and-drop or file upload (`accept="image/*"`, max 5MB).
   - In-browser preview thumbnail and active status tag.
   - Prominent **Remove Reference Photo** button.
   - Privacy guarantee: In-memory processing only; never saved or published.

### Step 03: Personal AI Consultation
- Live streaming dialogue powered by `POST /api/consultation`.
- Multi-turn conversation capability: Clients can ask follow-up questions (*“Will this suit wavy frizz-prone hair?”*, *“How long does the blowout last?”*).
- Markdown formatting with clear visual hierarchy:
  - ✨ *Style Direction & Concept*
  - 🌿 *Why This Works For You*
  - ⏱️ *Maintenance & Home Care Reality*
  - ✂️ *Recommended Aura Salon Service*
  - 💬 *What to Discuss with Your Stylist*

### Step 04: Personalized Consultation Summary
- Elegant, downloadable/shareable summary card displaying:
  - **Selected Service Interests** (pills)
  - **Transformation Level, Upkeep Commitment & Occasion**
  - **Stated Style Goal**
  - **Checklist for In-Person Stylist Consultation**
- **Three Core Action Controls:**
  1. `CONTINUE CONVERSATION`: Re-opens Step 3 with full conversation history preserved for further questions.
  2. `START AGAIN`: Completely resets client selections and photo state back to Step 1.
  3. `ENQUIRE WITH AURA`: Launches WhatsApp (`918668806851`) with a pre-filled, URI-encoded message containing the full consultation dossier.

---

## 4. Technical Architecture & Data Flow

```
Browser Client (React / Next.js)
  │
  ├─ User actions: Select categories, set preferences, upload inspiration photo
  │
  ├─ POST /api/consultation
  │    │
  │    ├─ In-memory Sliding Window Rate Limiter (30 req/min per IP)
  │    │
  │    ├─ Payload Parser (interests, preferences, history, base64 image)
  │    │
  │    ├─ Prompt Assembler + Strict Grounding Instructions
  │    │
  │    ├─ Official Google GenAI SDK (@google/genai, model: gemini-2.5-flash)
  │    │    └─ Streaming SSE response chunks / TextEncoder stream
  │    │
  │    └─ Grounded Fallback Engine (active when key is absent/unreachable)
  │
  └─ WhatsApp Deep Link Generator
       └─ https://wa.me/918668806851?text=[encodeURIComponent(dossier)]
```

---

## 5. Security, Privacy & Integrity Guardrails

1. **In-Memory Image Analysis:**
   - Inspiration photos are read on the client via `FileReader.readAsDataURL`.
   - Transmitted via HTTPS directly in the POST body to `/api/consultation`.
   - Forwarded as ephemeral `inlineData` to Gemini multimodal vision.
   - No filesystem write, no permanent cloud storage, zero risk of data leakage.
2. **Anti-Hallucination & Price Guardrails:**
   - The AI explicitly informs users that pricing is determined by hair length, texture, and in-person assessment.
   - No prices or unauthorized discounts are fabricated.
3. **Medical Safety Boundary:**
   - The AI will not diagnose scalp or skin conditions (alopecia, psoriasis, eczema), directing guests to certified dermatologists.
4. **Hero Image Preservation Lock:**
   - Verified SHA-256 hash `d9490f02112532827e63fb310cdbcab31a0d8d76115db946129e77088e04d3b7` remained untouched throughout implementation.
