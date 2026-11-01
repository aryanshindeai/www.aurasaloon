# Hero Asset Lock Specification

**Document Version:** 1.0.0 — Permanent Lock  
**Target:** Hero Image Photograph & Visual Composition  
**Status:** **STRICTLY LOCKED / IMMUTABLE**  

---

## 1. Absolute Preservation Mandate

Under user directive, the existing Hero image asset, its visual treatment, its file source, and its compositional presentation are **strictly locked**. 

The following actions are **expressly prohibited**:
- Replacing existing hero image files.
- Modifying existing hero image URLs or import paths.
- Altering existing hero image order or layers.
- Altering existing hero image compositions or aspect ratios.
- Shifting existing hero image positioning or focal coordinates.
- Removing or altering the existing hero image visual treatment (filters, scales, vignette).
- Regenerating or substituting the hero photograph with AI or stock imagery.

---

## 2. Technical Asset Record

### Primary Hero Photograph Asset
| Property | Specification |
|---|---|
| **Local Canonical File** | `src/assets/images/regenerated_image_1785000416312.png` |
| **Public Serving File** | `public/images/regenerated_image_1785000416312.png` |
| **Width** | 800 px |
| **Height** | 983 px |
| **Aspect Ratio** | ~ 1 : 1.229 |
| **Color Model** | RGBA (8-bit per channel) |
| **File Format** | Portable Network Graphics (PNG) |
| **Exact File Size** | 733,537 bytes (716.34 KB) |
| **SHA-256 Checksum** | `d9490f02112532827e63fb310cdbcab31a0d8d76115db946129e77088e04d3b7` |

---

## 3. Code Implementation & Rendering Blueprint

### Import in Configuration (`config/salon-config.ts`)
```typescript
import regeneratedSalonImg from '@/src/assets/images/regenerated_image_1785000416312.png';

export const SALON_CONFIG = {
  // ...
  hero: {
    videoFallbackImg: getImgSrc(regeneratedSalonImg),
    // ...
  }
};
```

### Exact Rendering Element (`components/hero.tsx`)
```tsx
{/* Background Image / Cinema Atmosphere */}
<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
  <img
    src={SALON_CONFIG.hero.videoFallbackImg}
    alt="Aura Luxury Salon"
    className="w-full h-full object-cover object-center scale-105 filter brightness-[0.45] contrast-[1.1] blur-[1px] transition-transform duration-1000"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-[#070606] via-[#070606]/60 to-[#070606]/40" />
</div>
```

---

## 4. Visual Composition & Overlay Integrity

The hero visual architecture consists of three synchronized visual planes:

1. **Base Photographic Plane:**
   - Fullscreen `object-cover` orientation centered at `object-center`.
   - Subtle subtle `scale-105` zoom factor with `brightness-[0.45]`, `contrast-[1.1]`, and soft optical `blur-[1px]`.
   - Dark radial and linear gradient vignette (`from-[#070606] via-[#070606]/60 to-[#070606]/40`) creating an intimate, cinematic theatre depth.
2. **Dynamic HTML5 Canvas Particle Plane:**
   - Smooth floating golden dust particles (`#E5C158` / `#D4AF37`) drifting upward with gentle horizontal drift.
   - Dual glowing Gold Oval Halo Mirrors rendered dynamically at `cx: width * 0.28` and `cx: width * 0.72`, mirroring the architectural signature of Aura's physical styling stations.
3. **Typography & Foreground CTA Plane:**
   - Royal status badge with live pulsing beacon.
   - Cormorant Garamond serif headline: *"Royal Luxury Lives Here."* with gold italic emphasis.
   - Editorial subheadline, dual action buttons (VIP Booking & AI Style Preview), and live stat indicators.

---

## 5. Secondary Image References in Repository

For completeness, all other original salon photograph assets in `src/assets/images/` are also cataloged and protected:

| File | Resolution | File Size | SHA-256 Hash | Role in Salon Config |
|---|---|---|---|---|
| `regenerated_image_1785002876784.jpg` | 735 x 916 | 100,745 B | `cc25d47057d877bed79fd766bb57d5b805c6a4b25f2676d5cddbf58df81bb8b4` | `service1Img` (Bridal & Couture) |
| `regenerated_image_1785002880851.jpg` | 736 x 1141 | 90,980 B | `e8e7600318bf95fe4b3d3d5ab27a13a139f65b0b929f357a7bee4536906323a8` | `service2Img` (Hair Atelier / Balayage) |
| `regenerated_image_1785009577668.jpg` | 735 x 916 | 100,745 B | `cc25d47057d877bed79fd766bb57d5b805c6a4b25f2676d5cddbf58df81bb8b4` | `modelBeforeImg` (Transformation Before) |

---

## 6. Verification Protocol

During any build or refactoring step:
1. `src/assets/images/regenerated_image_1785000416312.png` must remain identical to checksum `d9490f02112532827e63fb310cdbcab31a0d8d76115db946129e77088e04d3b7`.
2. The `public/images/regenerated_image_1785000416312.png` file must be a pristine byte-for-byte binary replica.
3. No build script, image optimization pipeline, or component refactor may replace or mutate these source bytes.
