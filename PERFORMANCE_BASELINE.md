# AURA THE SALON PREMIUM — PERFORMANCE BASELINE AUDIT
**Date:** November 2, 2026  
**Auditor:** Principal Frontend Performance & Systems Architect  
**Project:** Aura The Salon — Chandrapur (New Independent Website)  
**Tech Stack:** Next.js 15.4 (App Router) + React 19.2 + TypeScript 5.9 + Tailwind CSS 4.1 + Motion 12.2  

---

## 1. Executive Summary

This comprehensive audit establishes the pre-optimization performance baseline of the Aura The Salon website across client bundle size, network waterfalls, runtime execution, image delivery, and cross-device responsiveness. 

While the aesthetic presentation, typography, and functional features (WhatsApp integration, AI Consultation Atelier, Draggable Marquee, Google Maps) are fully functional, several high-impact optimization opportunities were identified across all layers of the stack.

---

## 2. Quantitative Baseline Metrics

| Category | Metric | Baseline Measurement | Target | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Bundle Size** | Initial Route JS (Gzip) | `90.4 kB` | `< 75 kB` | Needs Optimization |
| **Bundle Size** | Total First Load JS | `193 kB` | `< 160 kB` | Good / Can improve |
| **Image Payload** | Total Public Images Size | `4.78 MB` | `< 1.8 MB` | Urgent Action |
| **Image Formats** | Modern Format Adoption | `0%` (Only Raw PNG / JPEG) | `> 95%` AVIF / WebP | Urgent Action |
| **Runtime CPU** | Idle Particle Canvas Loop | Unbounded `rAF` (continuous) | Pause when offscreen/hidden | High Priority |
| **Runtime CPU** | Marquee Infinite `rAF` Loop | Continuous animation loop | Pause when offscreen/hidden | High Priority |
| **Fonts** | Google Fonts Delivery | External render-blocking `<link>` | Self-hosted `next/font/google` | High Priority |
| **Component Loading** | Chatbot & Booking Modal | Bundled in initial homepage JS | Dynamically loaded on-demand | High Priority |
| **Map Delivery** | Google Maps Embed | Eagerly prepared in DOM | Lazy loaded near viewport | Medium Priority |
| **LCP Image** | Hero Image Priority | No `fetchPriority="high"` | Explicit high priority & async | High Priority |
| **CLS Stability** | Image Aspect Ratios | Some unconstrained heights | Explicit aspect ratios on all cards | Medium Priority |

---

## 3. Detailed Component & Subsystem Findings

### 3.1. Typography & Font Loading (`app/layout.tsx`)
- **Finding:** Google Fonts (`Cormorant Garamond` & `Plus Jakarta Sans`) are requested via `<link rel="stylesheet" href="https://fonts.googleapis.com/...">`.
- **Impact:** Incurs external DNS lookups, TCP handshakes, TLS negotiation, and render-blocking CSS before the first paint can occur.
- **Remediation:** Migrate to Next.js native `next/font/google`, which inlines critical CSS, self-hosts WOFF2 font files locally, and enforces zero-CLS font fallback metrics.

### 3.2. Initial Client-Side Bundling (`app/page.tsx`)
- **Finding:** `BookingModal` (which imports `canvas-confetti`), `AuraAI` (the full chatbot window with messaging history), and `Lenis` smooth-scroller are imported at the top-level of `app/page.tsx`.
- **Impact:** Increases the initial JavaScript execution cost for mobile devices on First Contentful Paint.
- **Remediation:**
  - Wrap `BookingModal` in Next.js `dynamic(() => import(...))` loaded strictly when `bookingOpen === true`.
  - Dynamically load the heavy `AuraAI` chatbot dialog component when the user toggles the floating assistant.
  - Dynamically import `lenis` inside `useEffect`, deferring it until after the primary paint.

### 3.3. Unbounded Animation Loops & CPU Drain
- **Finding 1 (`components/hero.tsx`):** The golden particle canvas maintains a continuous `requestAnimationFrame(render)` loop without checking if the hero is visible. When the user scrolls down through Services, Marquee, or Location, this canvas continues executing 60fps canvas draw calls.
- **Finding 2 (`components/AuraImageMarquee.tsx`):** The marquee `requestAnimationFrame(animate)` loop runs continuously regardless of viewport visibility or document tab state.
- **Impact:** Noticeable battery drain and CPU contention on lower-end Android and iOS devices, degrading scrolling fluidity.
- **Remediation:**
  - Implement `IntersectionObserver` on the Hero canvas and Marquee track to pause `requestAnimationFrame` when elements leave the viewport.
  - Listen to `document.addEventListener('visibilitychange')` to halt loops when the tab is backgrounded.

### 3.4. Image Asset Payload & Modern Formats (`public/images/`)
- **Finding:** 
  - `marquee_aura_jewels_timeless.png` is an uncompressed `1.01 MB` PNG.
  - `marquee_pedicure_feet.png` is an uncompressed `701 KB` PNG.
  - `regenerated_image_1785000416312.png` is a `716 KB` PNG.
  - Total directory payload is `4.78 MB`.
  - Zero `.webp` or `.avif` formats are currently supplied.
- **Remediation:**
  - Generate high-quality WebP and AVIF companions for all gallery and service images using Python PIL with high fidelity (`quality=88`).
  - Configure `next.config.ts` image optimization formats `['image/avif', 'image/webp']`.
  - Hero image source visual fidelity must remain 100% identical and `src/assets/images/regenerated_image_1785000416312.png` hash lock must be preserved.

### 3.5. Responsive Layout & Viewport Resilience
- **Audit across 16 Target Viewports (320px to 2560px):**
  - **320px – 390px (Mobile):** Need to ensure all CTA buttons (e.g. Hero buttons, Location action buttons) stack with zero overflow, touch targets are $\ge 48\text{px}$, and horizontal padding is consistent.
  - **768px – 1024px (Tablet):** Grid columns in Services (2 columns) and Location layout (stacked vs side-by-side) must not cause awkward line wraps or squished text.
  - **1440px – 2560px (Ultrawide/Desktop):** Maximum container constraints (`max-w-7xl` and `max-w-5xl`) prevent excessive line length and keep typography elegant.

---

## 4. Remediation Action Plan
1. **Next.js & Font Optimization:** Transition to `next/font/google` and configure package optimization for `lucide-react` and `motion`.
2. **Dynamic Imports:** Code-split `BookingModal`, `AuraAI` dialog, and `AuraConsultation`.
3. **Loop Pausing:** Add IntersectionObserver and document visibility guards to Hero and Marquee.
4. **Image Generation:** Generate `.webp` and `.avif` assets; add `fetchPriority="high"` to Hero LCP image.
5. **Responsive Polish:** Inspect and refine all 16 target viewports with zero horizontal scrollbar.
6. **Verification:** Execute all test suites (Marquee 41/41, Location 12/12, Consultation 14/14, WhatsApp 25/25, Hero lock).
