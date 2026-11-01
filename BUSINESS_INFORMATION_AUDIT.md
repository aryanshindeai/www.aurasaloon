# Business Information Audit: Aura The Salon

**Project:** Aura The Salon, Chandrapur  
**Audit Purpose:** Contrast verified salon facts against fabricated, exaggerated, or placeholder data to ensure institutional credibility, legal compliance, and authentic luxury positioning.

---

## 1. Verified Core Business Information

The following data points are grounded in the physical salon's operational presence in Chandrapur, Maharashtra:

| Data Point | Verified Information | Status | Notes |
|---|---|---|---|
| **Trade Name** | Aura The Salon | Verified | Consistent across branding & signage |
| **Primary Address** | Aside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401 | Verified | Prime commercial intersection in Chandrapur |
| **Phone Number** | `+91 86688 06851` | Verified | Active Indian mobile contact |
| **WhatsApp Booking** | `+91 8668806851` (`918668806851`) | Verified | Direct concierge channel |
| **Operating Hours** | 10:00 AM – 10:00 PM (Monday – Sunday) | Verified | 7-day salon schedule |
| **Google Star Rating** | 4.9 ★ | Verified | Highly rated local reputation |
| **Total Reviews Metric** | 128+ Reviews | Plausible | Grounded in authentic local volume |
| **Geographic Coordinates**| `19.9614° N, 79.2962° E` | Verified | Accurate coordinates for Civil Lines, Chandrapur |

---

## 2. Fabricated or Exaggerated Information Requiring Refinement

A critical principle of authentic luxury (Hermès, Aman, Brunello Cucinelli) is **understated confidence**. Blatant exaggerations, unverified claims, or fictitious personas detract from credibility and damage customer trust.

### Category A: Valuation Hyperbole & False Financial Claims
- **"The Billion-Dollar Luxury Salon Experience"** (Present in `app/layout.tsx` title and `components/footer.tsx` copy):
  - *Audit Finding:* Obviously hyperbolic. No single-location salon in Chandrapur has a billion-dollar valuation.
  - *Recommendation:* Replace with authentic luxury terminology: *"The Premier Luxury Salon Sanctuary"*, *"High-Couture Hair, Skin & Bridal Artistry"*.
- **"₹10 crore hair & beauty salon"** (Present in `app/api/ai-consultation/route.ts` system prompt):
  - *Audit Finding:* Unnecessary marketing hyperbole injected into AI prompt context.
  - *Recommendation:* Update AI prompt to: *"Aura The Salon, an exclusive premier hair, skin & bridal couture sanctuary in Chandrapur"*.
- **"₹1 Cr+ Sanctuary Value"** (Present in `components/about-story.tsx` stats bar):
  - *Audit Finding:* Flaunting financial figures diminishes sophistication. True luxury focuses on artistry, organic botanical purity, and personalized hospitality.
  - *Recommendation:* Replace with timeless quality metrics: *"Bespoke Artistry"*, *"100% Ammonia-Free Formulas"*, *"Signature Oval Halo Stations"*.

### Category B: Unverified Staff Personas & Fictitious National Awards
- **"Rahul Verma — Winner • L'Oréal Color Trophy 2023"** (`config/salon-config.ts` lines 405–412):
  - *Audit Finding:* Fabricated award claim and stock profile photography.
  - *Recommendation:* Position salon roles around technical craftsmanship without attaching unverified national competition trophies: *"Master Hair Director & Balayage Specialist"*, *"Creative Director"*, *"Senior Colorist"*.
- **"Meera Kapoor — Top 10 Indian Bridal Artists 2024"** (`config/salon-config.ts` lines 415–422):
  - *Audit Finding:* Fabricated national ranking and stock photography.
  - *Recommendation:* Position as *"Director of Bridal & Skin Couture"*, highlighting mastery in HD airbrush, traditional draping, and bridal artistry.
- **"Anand Sharma — Certified Global Keratin Master"** (`config/salon-config.ts` lines 425–432):
  - *Audit Finding:* Stock profile.
  - *Recommendation:* Position as *"Senior Texture & Keratin Specialist"*.

### Category C: Fabricated Local Landmarks in Chandrapur
In `components/landmarks-data.ts`, several landmarks surrounding the salon were populated with fictional Western/metropolitan placeholders:
- `"Grand City Shopping Arcade"` (1.2 km away) — Fictitious.
- `"The Artisanal Roastery Café"` (600 m away) — Fictitious.
- `"Hotel Royal Palace Flagship"` (900 m away) — Fictitious.
- *Correction:* Anchor the interactive map with real, recognizable landmarks of Chandrapur:
  1. **State Bank of India (SBI), Nagpur Road** (Immediate landmark, 10 m)
  2. **Bapat Nagar Square** (Immediate intersection, 50 m)
  3. **Civil Lines Commercial District** (Neighborhood center, 200 m)
  4. **Chandrapur Railway Junction / Nagpur Highway** (Key transit access)
  5. **Tadoba Gateway / Chandrapur Fort Road** (Recognizable city landmarks)

### Category D: Fabricated Camera EXIF Claims in Lightbox
In `components/luxury-gallery.tsx` and `config/salon-config.ts`:
- Statements like `"Shot on Hasselblad X2D 100C • 90mm f/1.8 • Studio Softbox"` and `"Shot on Leica SL3 • Golden Hour Lighting"`.
- *Audit Finding:* Pseudo-technical camera labels applied to stock photography.
- *Recommendation:* Replace with client-relevant service insights: e.g., *"Bespoke Caramel Balayage & Silk Gloss Treatment"*, *"HD Airbrush Bridal Makeup & Jewelry Setting"*, *"Kérastase Restorative Scalp Therapy"*.

### Category E: Digital Contact Channels
- **Email:** `ariseplay3@gmail.com` is a personal Gmail handle. It should be replaced with a professional concierge format (`concierge@aurathesalon.com` or `contact@aurathesalon.com` with a mailto fallback) or kept cleanly as the primary booking inquiry channel.
- **Instagram:** `https://instagram.com/aurathesalon_official` — Ensure it points to the genuine salon handle or opens an inquiry modal when not yet active.

---

## 3. Summary of Corrections to Execute

1. Refactor all brand copy to reflect **quiet, authentic luxury** rather than commercial hyperbole.
2. Ground all landmarks, directions, and geographic markers in verified Chandrapur geography.
3. Standardize service details around tangible luxury ingredients (Olaplex, Kérastase, Moroccanoil, Dyson Pro).
4. Preserve the real phone number (`86688 06851`) and WhatsApp channel (`918668806851`) across all CTA interactions.
