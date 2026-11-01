# AURA THE SALON PREMIUM — FINAL DEPLOYMENT CHECKLIST
**Date:** November 2, 2026  
**Target Environment:** Independent Vercel Project (Clean Production)  
**Safety Notice:** Never touch or modify the old existing deployment (`https://aurasallon0002.vercel.app/`).  

---

## 1. Pre-Deployment Verification Checklist

- [x] **Production Build Clean:** `npm run build` generates clean standalone output with zero TypeScript or bundling errors.
- [x] **Hero Image SHA-256 Lock Intact:** `d9490f02112532827e63fb310cdbcab31a0d8d76115db946129e77088e04d3b7` verified.
- [x] **Test Suites Green:** 
  - `test_aura_marquee.ts`: 41 / 41 Passed.
  - `scripts/test_aura_location.ts`: 12 / 12 Passed.
  - `scripts/test_aura_consultation.ts`: 14 / 14 Passed.
  - `test_whatsapp_system.ts`: 25 / 25 Passed.
- [x] **SEO Artifacts In Place:**
  - `app/robots.ts` configured for `/robots.txt`.
  - `app/sitemap.ts` configured for `/sitemap.xml`.
  - Schema.org `BeautySalon` structured data embedded in Location section.
- [x] **Next-Gen Images Generated:**
  - WebP companions generated for all 16 public images.
  - AVIF companions generated for all 16 public images.
  - `next.config.ts` configured with `formats: ['image/avif', 'image/webp']`.
- [x] **Font Optimization Active:**
  - Self-hosted WOFF2 subsets via `next/font/google` (`Cormorant_Garamond` and `Plus_Jakarta_Sans`).
  - Zero render-blocking external Google Font calls.
- [x] **Responsive Layout Tested:**
  - 16 Viewports from $320\text{px}$ to $2560\text{px}$ verified with zero horizontal scrollbar.
  - Safe area insets and virtual keyboard handling active.
- [x] **Local Dev Server Verified:**
  - `http://localhost:3000` responding with HTTP 200.

---

## 2. Environment Variables Configuration for New Vercel Project

When configuring the new independent Vercel project in the Vercel Dashboard, ensure the following environment variables are set:

| Variable Name | Required | Purpose |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Recommended | Powers live Gemini AI for Aura AI Assistant & Consultation |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` | Optional | Powers official Google Maps Embed API in Place Mode |

*(Note: If either key is omitted, the application uses its built-in grounded fallback engines, direct Google Maps search launcher, and prefilled WhatsApp booking channels.)*

---

## 3. Deployment Safety Protocol
1. Create a **NEW** project on Vercel (e.g. `aura-salon-chandrapur-premium`).
2. Point the Git repository to the current branch.
3. Keep the old deployment (`aurasallon0002.vercel.app`) completely untouched.
4. Verify the new production URL upon deployment completion.
