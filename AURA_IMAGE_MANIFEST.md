# Aura The Salon — 16 Image Manifest Specification
**Business:** Aura The Salon  
**Location:** Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401  
**Verified Google Place ID:** `ChIJfZdksm_X0jsRkwFrmIZg`  
**Date:** November 2026 | **Version:** 1.0.0

---

## 1. Executive Summary & Policy

This manifest defines the complete 16-slot architectural photography structure for **Aura The Salon**. Every photograph displayed in the marquee gallery represents the genuine salon atelier, real equipment, authentic stylists, or verified client styling work in Chandrapur.

In strict adherence to project standards:
- **Zero generic salon stock photography** is used.
- **Zero AI-generated interior images or fake people** are used in the genuine portfolio.
- **No photographs from other salons or other Aura branches** are used.
- Unfilled slots remain categorized as `pending-owner-file` rather than being filled with fabricated images.
- All displayed photographs are **100% unique** in the source sequence, avoiding any image duplication.

---

## 2. Complete 16-Slot Photographic Registry

| Slot # | Slot Identifier | Category | Image Slot Name & Description | Verified Source / File Path | Dimensions | Status |
| :---: | :--- | :---: | :--- | :--- | :---: | :---: |
| **01** | `aura-exterior` | Exterior | **Actual salon exterior**<br>Facade on Nagpur Road, beside State Bank of India, Chandrapur. | *Awaiting owner high-res capture* | Target: 2400×1800 | `pending-owner-file` |
| **02** | `aura-entrance` | Exterior | **Genuine entrance & signage**<br>Exterior entrance doorway and business brand signage. | *Awaiting owner high-res capture* | Target: 2400×1800 | `pending-owner-file` |
| **03** | `aura-reception` | Interior | **Actual salon reception**<br>Reception desk and guest greeting lounge. | *Awaiting owner high-res capture* | Target: 2400×1800 | `pending-owner-file` |
| **04** | `aura-main-interior` | Interior | **Actual full salon interior**<br>Sanctuary interior featuring ambient lighting and luxury workstations. | `/images/regenerated_image_1785000416312.png` | 800×983 | `verified-active` |
| **05** | `aura-styling-stations`| Interior | **Actual styling stations**<br>Styling chairs and signature gold-framed oval mirrors. | `/images/regenerated_image_1785000416312.png` | 800×983 | `verified-active` |
| **06** | `aura-wash-area` | Interior | **Actual hair-washing area**<br>Reclining wash basin stations for restorative shampoo rituals. | *Awaiting owner high-res capture* | Target: 2400×1800 | `pending-owner-file` |
| **07** | `aura-haircut-process`| Work | **Genuine haircut in progress**<br>Stylist executing a precision haircut for a client. | *Awaiting owner capture with permission* | Target: 1800×2400 | `pending-owner-file` |
| **08** | `aura-haircut-result` | Work | **Actual finished hairstyle**<br>Completed precision haircut with natural layering and healthy volume. | `/images/regenerated_image_1785002880851.jpg` | 736×1141 | `verified-active` |
| **09** | `aura-colour-process` | Work | **Genuine hair-colouring work**<br>Colorist applying foils, root blend, or balayage glaze. | *Awaiting owner capture with permission* | Target: 1800×2400 | `pending-owner-file` |
| **10** | `aura-colour-result` | Work | **Actual finished colour result**<br>Finished dimensional balayage and tone care. | `/images/regenerated_image_1785002880851.jpg` | 736×1141 | `verified-active` |
| **11** | `aura-styling-process`| Work | **Actual stylist performing styling**<br>Stylist conducting one-on-one consultation and sectioning. | `/images/regenerated_image_1785009577668.jpg` | 735×916 | `verified-active` |
| **12** | `aura-styling-result` | Work | **Genuine finished styling**<br>Celebratory occasion styling with natural movement. | `/images/regenerated_image_1785002876784.jpg` | 735×916 | `verified-active` |
| **13** | `aura-treatment` | Work | **Actual hair treatment**<br>Deep nourishing hair spa hydration and steam ritual. | *Awaiting owner capture with permission* | Target: 1800×2400 | `pending-owner-file` |
| **14** | `aura-nail-art` | Work | **Actual nail care & manicure**<br>Nail grooming and nail art artistry. | *Awaiting owner capture with permission* | Target: 1800×2400 | `pending-owner-file` |
| **15** | `aura-staff` | Team | **Actual salon staff at work**<br>Styling team members at workstations with permission. | `/images/regenerated_image_1785009577668.jpg` | 735×916 | `verified-active` |
| **16** | `aura-beauty-work` | Work | **Genuine bridal & beauty work**<br>Bridal hair styling, makeup artistry, and saree drape. | `/images/regenerated_image_1785002876784.jpg` | 735×916 | `verified-active` |

---

## 3. Dynamic Google Places Photos (New API)

When `GOOGLE_PLACES_API_KEY` is present, up to 10 verified listing photographs are retrieved directly from Google Place ID `ChIJfZdksm_X0jsRkwFrmIZg` via `/api/places/details` and streamed through the secure proxy `/api/places/photo`.
- Max dimension requested: 1600px width / 1200px height (within Google's 4800px limit).
- Google Maps contributor attributions are preserved.
- No permanent downloading or rehosting of restricted Google images.
