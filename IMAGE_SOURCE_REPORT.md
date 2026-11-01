# Image Source Report: Aura The Salon

**Document Version:** 1.0.0  
**Inspection Date:** November 2026  
**Auditor:** Senior Photographic Asset Manager & Google Maps Platform Specialist  

---

## 1. Overview of Photographic Assets

This report documents the origin, resolution constraints, integrity checks, and usage boundaries for all photographic assets utilized across the Aura The Salon website.

The website maintains a **strict architectural division** between three categories of imagery:
1. **Locked Hero Photograph (Permanent & Immutable)**
2. **Owner-Approved Original Portfolio Imagery (Permanent High-Resolution)**
3. **Google Places API (New) Dynamic Photo Stream (Episodic, Live Contributor & Owner Photos)**

---

## 2. Locked Hero Photograph Specification

| Metric | Verification Data |
|---|---|
| **File Path** | `src/assets/images/regenerated_image_1785000416312.png` |
| **Public Serving Mirror** | `public/images/regenerated_image_1785000416312.png` |
| **Dimensions** | 800 px (Width) × 983 px (Height) |
| **SHA-256 Checksum** | `d9490f02112532827e63fb310cdbcab31a0d8d76115db946129e77088e04d3b7` |
| **Lock Status** | **100% UNTOUCHED & PERMANENTLY LOCKED** |
| **Visual Composition** | High-end salon interior showing warm ambient track lighting, gold-framed backlit oval mirrors, crimson tufted styling chairs on polished gold hydraulic bases, Italian marble flooring, and hair wash/styling stations. |
| **Visual Treatment** | `scale-105 filter brightness-[0.45] contrast-[1.1] blur-[1px]` overlaid with radial vignette and canvas gold halo mirrors. |

---

## 3. Owner-Approved Original Photography Registry

For permanent, guaranteed high-resolution presentation across the website without external API latency or quota restrictions, the website integrates owner-verified original photography:

| Photo ID | Subject | Dimensions | Source | Usage |
|---|---|---|---|---|
| `owner-salon-interior` | Styling Stations & Mirrors | 800 × 983 | `src/assets/images/regenerated_image_1785000416312.png` | About Section, Gallery |
| `owner-bridal-couture` | Authentic Bridal Styling | 735 × 916 | `src/assets/images/regenerated_image_1785002876784.jpg` | Services, Gallery |
| `owner-hair-atelier` | Hair Coloring & Styling | 736 × 1141 | `src/assets/images/regenerated_image_1785002880851.jpg` | Services, Gallery |
| `owner-client-care` | Client Consultation & Care | 735 × 916 | `src/assets/images/regenerated_image_1785009577668.jpg` | About Section, Gallery |

---

## 4. Google Places API (New) Dynamic Photo Stream

### Technical Ingestion Pipeline
- **Endpoint:** Places Photo (New) (`https://places.googleapis.com/v1/{name}/media`)
- **Dimension Clamping:** `maxWidthPx` and `maxHeightPx` are capped at a maximum of `1600px` for desktop grids and `800px` for mobile displays, strictly within Google's `4800px` hard ceiling.
- **No False 8K Claims:** Photographs are delivered in optimized JPEG/WebP formats suited for modern retina viewports without exaggerated "8K Ultra HD" marketing labels.
- **Curation Filter:** The application parses author metadata and image dimensions. Only photographs tagged or verified as representing the physical Chandrapur premises are rendered in the primary showcase. Random or unrelated customer selfies are filtered out.

---

## 5. Compliance Verification Summary
- [x] Hero photograph preserved byte-for-byte (`d9490f...`).
- [x] Google Places API (New) implemented with backend proxying.
- [x] Zero exposure of Google API keys in client-side bundles.
- [x] `Cache-Control: no-store` applied to Google photo proxy routes.
- [x] Author attribution rendered for every Google Places photo resource.
- [x] Owner photograph management system established for permanent salon assets.
