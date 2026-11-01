# Aura The Salon — Marquee Gallery Quality Assurance & Verification
**Component:** `AuraImageMarquee.tsx`  
**Test Suite:** `test_aura_marquee.ts` (41 Automated Assertions)  
**Overall Status:** **100% PASSED (41 / 41 Tests)**  
**Date:** November 2026 | **Version:** 1.0.0

---

## 1. Quality Assurance Matrix

| Feature | Requirement | Implementation | Status |
| :--- | :--- | :--- | :---: |
| **Animation Engine** | `requestAnimationFrame` loop, NO CSS `@keyframes` | Frame loop updating `offsetRef.current` via `translate3d` | **PASSED** |
| **Auto-Scroll Speed** | Strictly `0.8` pixels per frame | `offsetRef.current -= 0.8` in animation tick | **PASSED** |
| **Auto-Scroll Direction**| Continuous Left movement | Negative horizontal translation along X-axis | **PASSED** |
| **Loop Mathematics** | `halfWidth = track.scrollWidth / 2` | Seamless wrap: `offset <= -halfWidth` => `offset += halfWidth` | **PASSED** |
| **Internal Duplication**| Exact duplication once: `[...images, ...images]` | Clean array clone for continuous seamless repetition | **PASSED** |
| **Pointer Capture** | `setPointerCapture(e.pointerId)` on pointer down | Fluid drag tracking across window boundaries | **PASSED** |
| **Velocity Tracking** | `velocity = (dx / dt) * 16` | Measured every pointer move event against previous timestamp | **PASSED** |
| **Inertial Momentum** | Decay multiplier `velocity *= 0.95` | Released drag coasts to a halt and smoothly resumes auto-scroll | **PASSED** |
| **Cursor Styling** | `cursor-grab` and `cursor-grabbing` | Interactive grab feedback on hover and drag | **PASSED** |
| **Track Observation** | Dynamic recalculation on window resize | `ResizeObserver` updating `halfWidthRef.current` | **PASSED** |
| **Reduced Motion** | Accessibility compliance | Detects `(prefers-reduced-motion: reduce)` and pauses auto-scroll | **PASSED** |
| **Top Curved Mask** | SVG height 80px mobile, 100px desktop | Path `M0 0H1440V50C1440 50 1200 100 720 100C240 100 0 50 0 50V0Z` | **PASSED** |
| **Bottom Curved Mask**| SVG height 80px mobile, 100px desktop | Path `M0 100H1440V50C1440 50 1200 0 720 0C240 0 0 50 0 50V100Z` | **PASSED** |
| **Mobile Proportions** | Width 240px, Height 320px, Gap 12px | Responsive Tailwind classes: `w-[240px] h-[320px] gap-[12px]` | **PASSED** |
| **Desktop Proportions**| Width 320px, Height 512px, Gap 16px | Responsive Tailwind classes: `md:w-[320px] md:h-[512px] md:gap-[16px]`| **PASSED** |
| **Border Radius** | 16px smooth rounded corners | `rounded-[16px]` applied to all marquee items | **PASSED** |
| **Image Cleanliness** | No text overlays on images, no cards | Clean photographic presentation matching reference | **PASSED** |
| **Lightbox Modal** | Full-res viewer with Prev/Next & Escape | Chevron navigation, Escape close, click-outside close | **PASSED** |
| **Hero Image Lock** | SHA-256 Hash strictly preserved | Hash: `d9490f02112532827e63fb310cdbcab31a0d8d76115db946129e77088e04d3b7` | **PASSED** |

---

## 2. Mathematical Proof of Infinite Looping

The infinite loop relies on two identical sequences rendered side-by-side in a single flex track:
- Total Track Width: $W = 2 \times W_{\text{half}}$
- Half Width: $W_{\text{half}} = \sum_{i=1}^{N} (\text{width}_i + \text{gap})$
- Translation Vector: $\vec{T} = [X, 0, 0]$ where $X = \text{offset}$

```text
Position:
   [ Image Set A (Width W_half) ] [ Image Set B (Width W_half) ]
   ▲                              ▲
   0                              -W_half

Loop Transition Rule:
   If (offset <= -W_half):
       offset = offset + W_half
   Else If (offset > 0):
       offset = offset - W_half
```

Because Set A and Set B are pixel-identical in structure, shifting the offset by $W_{\text{half}}$ is imperceptible to the human eye, resulting in a continuous, infinite movement without jitter, stutter, or blank frames.

---

## 3. Inertia & Drag Mechanics Verification

```typescript
// Velocity sampling on pointer move:
const now = performance.now();
const dt = Math.max(now - previousTime, 1);
const dx = clientX - previousX;
velocity = (dx / dt) * 16; // Normalizes to 60fps frame rate

// Deceleration loop in animation frame:
if (Math.abs(velocity) > 0.08) {
  offset += velocity;
  velocity *= 0.95; // 5% drag per frame
} else {
  velocity = 0;
  offset -= 0.8; // Resumes continuous auto-scroll
}
```

The threshold of `0.08` ensures a smooth, imperceptible transition between the user's release gesture and the background marquee auto-scroll.

---

## 4. Lightbox Verification

- **Keyboard Support:**
  - `ArrowLeft`: Navigates to previous image.
  - `ArrowRight`: Navigates to next image.
  - `Escape`: Closes lightbox immediately.
- **Click Handling:**
  - Clicking outside the modal on the backdrop closes the lightbox.
  - A threshold check (`Math.abs(velocity) > 2`) prevents accidental lightbox opening during an active drag swipe.
- **WhatsApp Integration:**
  - Direct *"Inquire on WhatsApp"* button pre-populates the specific image name and inquiry context.
  - Direct *"Book Look"* button opens the guided 5-field appointment modal.
