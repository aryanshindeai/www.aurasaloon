# Asset and Code Removal Plan: Aura The Salon

**Project:** Aura The Salon  
**Scope:** Elimination of corrupted files, duplicate directories, unverified claims, and obsolete code artifacts.

---

## 1. File System Cleanups

### A. Remove Redundant Nested Image Directories
During previous iterations, accidental recursive directory structures were created inside `src/assets/images/`:
- `src/assets/images/images/regenerated_image_1785002880851.jpg` (2.89 MB redundant copy)
- `src/assets/images/public/images/regenerated_image_1785002876784.jpg` (100 KB redundant copy)
- `src/assets/images/public/images/regenerated_image_1785002880851.jpg` (2.62 MB redundant copy)

**Action:** Delete `src/assets/images/images/` and `src/assets/images/public/` to prevent repository bloat and path confusion.

### B. Synchronize Corrupted `public/images/` Files
The four image files residing in `public/images/` (`regenerated_image_1785000416312.png`, `regenerated_image_1785002876784.jpg`, `regenerated_image_1785002880851.jpg`, `regenerated_image_1785009577668.jpg`) contain corrupted UTF-8 string data instead of raw image binaries due to a previous incorrect write script.

**Action:** Overwrite `public/images/` with the authentic raw binary files from `src/assets/images/`. This ensures any client browser requesting `/images/regenerated_image_...` receives the 100% genuine photograph with valid image headers.

---

## 2. Text & Content Removals (Grounded Authenticity)

| Location | Existing String / Content | Problem | Replacement / Removal Action |
|---|---|---|---|
| `app/layout.tsx` (line 5) | `"The Billion-Dollar Luxury Salon Experience"` | Unverifiable hyperbole | `"The Premier Luxury Salon Sanctuary | Chandrapur"` |
| `components/footer.tsx` (line 26) | `"The Billion-Dollar Luxury Salon Experience..."` | Hyperbolic copy | Understated luxury positioning emphasizing artisanal craftsmanship and royal Indian hospitality |
| `components/about-story.tsx` (line 62) | `"₹1 Cr+ Sanctuary Value"` | Crude financial flexing | `"Signature Atelier"` / `"Bespoke Architecture"` |
| `app/api/ai-consultation/route.ts` (line 26) | `"an ultra-luxury ₹10 crore hair & beauty salon"` | Hyperbole in system prompt | `"an exclusive premier hair, skin & bridal couture salon in Chandrapur"` |
| `components/landmarks-data.ts` | Fictitious spots (`"Grand City Shopping Arcade"`, `"The Artisanal Roastery Café"`, `"Hotel Royal Palace"`) | Fictional westernized landmarks not found in Chandrapur | Replace with authentic landmarks: Nagpur Road strip, Bapat Nagar Square, Civil Lines District, State Bank of India |
| `config/salon-config.ts` (lines 409, 419, 429) | `"Winner • L'Oréal Color Trophy 2023"`, `"Top 10 Indian Bridal Artists 2024"` | Unverified competition trophies | Professional certifications: `"Master Colorist & Balayage Director"`, `"Director of Bridal Couture & HD Artistry"`, `"Senior Keratin & Texture Specialist"` |
| `config/salon-config.ts` (lines 297, 305, 313, 321) | `"Shot on Hasselblad X2D 100C • 90mm f/1.8"`, `"Shot on Leica SL3"` | Artificial camera metadata | Genuine service and craftsmanship descriptions: `"French Honey Balayage & Silk Gloss"`, `"Maharani HD Airbrush Bridal Glow"`, etc. |

---

## 3. Technical & Architectural Adjustments

### A. Gemini Model Identifier in `/api/ai-consultation`
- **Current:** `model: "gemini-3.6-flash"`
- **Issue:** Non-existent model name; will cause `404 Not Found` from the Google GenAI API when a live API key is set.
- **Fix:** Update to `gemini-2.5-flash` or `gemini-1.5-flash`, keeping the instant offline fallback intact so users without an API key still receive a diagnostic report.

### B. Transformation Slider Fallback URLs
- In `components/transformation-slider.tsx`, fallbacks point to `/images/regenerated_image_1785009577668.jpg` and `/images/regenerated_image_1785002880851.jpg`.
- Once `public/images/` is refreshed with authentic binaries, these URLs will resolve cleanly without 404s or broken image icons.

---

## 4. Verification Checklist
- [ ] No hero image files or paths modified.
- [ ] Nested duplicate folders removed.
- [ ] `public/images/` binary integrity restored from `src/assets/images/`.
- [ ] Hyperbolic valuation claims excised from all files.
- [ ] Fictitious landmarks replaced with verified Chandrapur points.
- [ ] AI model identifier updated to a production Google Gen AI model.
- [ ] Clean build passes with zero errors (`npm run build`).
