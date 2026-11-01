# Existing Site Audit: Aura The Salon

**Project:** Aura The Salon  
**Repository:** [aryanshindeai/aurasallon0002](https://github.com/aryanshindeai/aurasallon0002)  
**Existing Deployment:** [https://aurasallon0002.vercel.app/](https://aurasallon0002.vercel.app/)  
**Audit Date:** November 2026  
**Auditor:** Principal Frontend Engineer, Luxury Web Designer & Senior Software Architect  

---

## 1. Executive Summary

Aura The Salon is a luxury salon web application for an exclusive sanctuary located in Civil Lines, Chandrapur, Maharashtra. The current implementation presents an ambitious visual atmosphere combining dark obsidian backgrounds, metallic champagne gold accents, and bespoke interactive features including an HTML5 canvas particle hero, Web Audio ambient synth soundscape, Lenis smooth scrolling, Leaflet interactive location map, and an interactive before/after transformation slider.

The audit identifies strong foundational aesthetics alongside key architectural, content, and asset integrity issues that must be elevated to achieve true bespoke luxury standards without disrupting the core design identity or the hero image assets.

---

## 2. Technology Stack & Dependencies

| Layer | Package / Technology | Version | Evaluation |
|---|---|---|---|
| **Core Framework** | Next.js (App Router) | `15.4.9` (Built on Next.js 15.5.x) | Modern, fast, static-optimized |
| **UI Library** | React & React DOM | `19.2.1` | React 19 concurrent features |
| **Styling** | Tailwind CSS & PostCSS | `@tailwindcss/postcss 4.1.11`, `tailwindcss 4.1.11` | Tailwind v4 engine |
| **Motion & Animation** | Motion (Framer Motion) | `motion 12.23.24` | Smooth transitions and layout animations |
| **Icons** | Lucide React | `lucide-react 0.553.0` | Comprehensive feather icon set |
| **Smooth Scroll** | Lenis | `lenis 1.3.25` | Momentum smooth scrolling |
| **Interactive Map** | Leaflet & React types | `leaflet 1.9.4`, `@types/leaflet 1.9.21` | Client-rendered OpenStreetMap/CartoDB |
| **Celebration FX** | Canvas Confetti | `canvas-confetti 1.9.4` | Used on booking pass confirmation |
| **AI Integration** | Google Gen AI SDK | `@google/genai 2.4.0` | Powers trichology diagnostic endpoint |

---

## 3. Component Architecture & Hierarchy

The application runs as a high-density, single-page editorial experience with client-side interactive modals:

```
app/
├── layout.tsx                (Root metadata, Google Fonts Cormorant Garamond & Plus Jakarta Sans)
├── page.tsx                  (Master orchestrator, Lenis scroll init, state for modals)
├── globals.css               (Tailwind v4 theme, gold gradients, glass-panel utilities)
├── not-found.tsx             (Custom 404 luxury return screen)
└── api/
    └── ai-consultation/
        └── route.ts          (POST endpoint calling @google/genai for diagnostic analysis)

components/
├── luxury-cursor.tsx         (Custom interactive circle cursor tracking mouse coordinates)
├── ambient-soundscape.tsx    (Web Audio API synthesizer playing meditative luxury harmonic chords)
├── navigation.tsx            (Fixed glass navigation bar with mobile drawer)
├── hero.tsx                  (CRITICAL: Hero image layer + HTML5 canvas gold dust & dual halo mirrors)
├── spatial-journey.tsx       (Interactive room-by-room virtual sanctuary walkthrough)
├── about-story.tsx           (Editorial heritage philosophy & craftsmanship story)
├── services-section.tsx      (Categorized service menu with category filters & search)
├── transformation-slider.tsx (Interactive before/after split slider with image drag & drop)
├── luxury-gallery.tsx        (Editorial grid with category filter & full-screen lightbox modal)
├── experience-timeline.tsx   (The 6-step client ceremony journey from arrival to reveal)
├── product-shelf.tsx         (Curated shelf of imported brand formulations)
├── meet-experts.tsx          (Master Director profiles with chair reservation triggers)
├── reviews-section.tsx       (Verified customer testimonials with rating display)
├── location-contact.tsx      (Location details, business hours, VIP direct inquiry form)
├── luxury-interactive-map.tsx(Dynamic Leaflet map with dark tile layers & custom gold markers)
├── landmarks-data.ts         (Nearby transit, dining, shopping, and landmark points)
├── booking-modal.tsx         (5-step hotel-grade reservation wizard with WhatsApp pass generation)
├── ai-consultant-modal.tsx   (Gemini-powered hair & scalp consultation suite with instant fallback)
└── footer.tsx                (Brand identity, quick anchors, copyright, and direct contact links)
```

---

## 4. Navigation Routes & Page Anchors

| Anchor / Route | Target Component | Purpose & State |
|---|---|---|
| `/` | `app/page.tsx` | Main landing experience |
| `#walkthrough` | `components/spatial-journey.tsx` | Room-by-room sanctuary walkthrough |
| `#about` | `components/about-story.tsx` | Salon story & heritage |
| `#services` | `components/services-section.tsx` | Service catalog & selection |
| `#transformations` | `components/transformation-slider.tsx` | Before/after transformation showcase |
| `#gallery` | `components/luxury-gallery.tsx` | Editorial photography lightbox |
| `#ritual` | `components/experience-timeline.tsx` | 6-step service ceremony timeline |
| `#experts` | `components/meet-experts.tsx` | Master styling directors |
| `#reviews` | `components/reviews-section.tsx` | Testimonials & ratings |
| `#contact` | `components/location-contact.tsx` | Address, map, hours, and inquiry |
| `/api/ai-consultation` | `app/api/ai-consultation/route.ts` | Backend AI consultation endpoint |

---

## 5. Booking & Contact Functional Audit

### Booking Flow (`components/booking-modal.tsx`)
1. **Step 1 — Service Selection:** User selects from catalog or inherits active service from catalog click.
2. **Step 2 — Director Selection:** Next Available Master Director or specific director.
3. **Step 3 — Schedule:** Date picker (with minimum date constrained to today) and time slot chips. Also includes complimentary refreshment selection (Artisanal Pour-Over Espresso, Japanese Matcha, etc.).
4. **Step 4 — Guest Information:** Name, WhatsApp phone number, email, and special notes.
5. **Step 5 — VIP Pass Issuance:** Generates a unique Pass ID (e.g., `AURA-729481`), triggers gold confetti, and renders a VIP pass.
6. **Direct Integration:** Includes a 1-click action: `"Send Pass to Salon WhatsApp"` opening `https://wa.me/918668806851` pre-filled with the exact appointment details.

### Contact & Map System (`components/location-contact.tsx` + `luxury-interactive-map.tsx`)
- Coordinates: `19.9614° N, 79.2962° E` (Chandrapur Civil Lines).
- Map engine: Dynamic client-side Leaflet with CartoDB Dark Matter tile set (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`).
- Contact form: Direct message trigger with feedback confirmation.
- Direct links: Google Maps search query, Directions URL, and WhatsApp Concierge link.

---

## 6. Critical Technical Findings & Risks

1. **Asset Duplication & Corruption in Public Directory:**
   - In `public/images/`, several image files had been corrupted by a previous UTF-8 string write (yielding byte errors on standard decoders).
   - In contrast, `src/assets/images/` contains pristine, valid, uncorrupted binary image files.
   - Any fallback URLs pointing to `/images/...` risk rendering blank or broken images until synchronized with the authentic binaries.
2. **AI Model Reference:**
   - In `app/api/ai-consultation/route.ts`, model is configured as `"gemini-3.6-flash"`. The official Google Gemini model naming convention is `gemini-2.5-flash` or `gemini-1.5-flash`. While the client modal handles fallbacks gracefully, fixing this model parameter ensures live API calls succeed when `GEMINI_API_KEY` is provided.
3. **Exaggerated Marketing Copy vs True Luxury:**
   - Claims such as "Billion-Dollar Luxury Salon Experience" and "₹10 crore hair & beauty salon" read like hyperbole rather than refined high-end luxury. Replacing these with understated, confident, bespoke luxury phrasing elevates the brand significantly.
4. **Fictitious Landmarks:**
   - Landmarks like "The Artisanal Roastery Café" and "Grand City Shopping Arcade" are not verified Chandrapur establishments and should be grounded in authentic local points of reference (Bapat Nagar Square, Nagpur Road, SBI, Civil Lines).

---

## 7. Next Steps

- Lock the hero assets permanently (see `HERO_ASSET_LOCK.md`).
- Document all business information discrepancies (see `BUSINESS_INFORMATION_AUDIT.md`).
- Formulate the removal and cleanup plan (see `REMOVAL_PLAN.md`).
- Formulate the comprehensive luxury design upgrade plan (see `NEW_DESIGN_PLAN.md`).
- Execute implementation without touching hero photographs.
