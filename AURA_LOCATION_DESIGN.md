# AURA THE SALON — WORLD-CLASS LOCATION EXPERIENCE DESIGN

**Design Specification & Luxury Hospitality Architecture**  
**Brand:** Aura The Salon  
**Location:** Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401  
**Verified Place ID:** `ChIJfZdksm_X0jsRkwFrmIZg`  
**Status:** Implemented, Integrated & Verified Locally

---

## 1. Executive Vision & Hospitality Philosophy

Rather than treating the location as an afterthought or a generic small contact form, the new **Aura Location Experience** is designed as a luxury hospitality arrival journey.

It transforms physical wayfinding into a brand touchpoint:
- **Calm, High-End Aesthetic:** Uses warm white backgrounds (`#F8F5F0`), natural linen cards (`#FFFFFF`), refined neutral borders (`#E9E0D5`), and champagne gold accents (`#C5A059`).
- **Zero Gimmicks:** Avoids artificial 3D map canvas animations, excessive glassmorphism, decorative fake pins, fake travel times, or invented neighborhood distances.
- **Unobstructed Google Maps:** The Google Map is treated as a major architectural visual element (`520px` desktop / `360px` mobile) with full Google branding, zoom controls, and interactive fidelity preserved.

---

## 2. Section Visual & Architectural Structure

### A. Section Header & Labeling
- **Small Location Tag:** `AURA THE SALON · CHANDRAPUR`
- **Headline:** *"Find your way to Aura."*
- **Subheading:** *"Your next beauty experience is waiting. Visit us in the heart of Chandrapur."*

### B. Two-Column Editorial Grid (`lg:grid-cols-12`)
```
┌──────────────────────────────────────┬─────────────────────────────────────────────────┐
│  LUXURY INFORMATION PANEL (5 Cols)   │       PREMIUM GOOGLE MAP EMBED (7 Cols)         │
│                                      │                                                 │
│  • Brand: Aura The Salon             │  • Responsive height: 520px (Desktop), 360px    │
│  • Google Rating: 4.7 / 5.0 (link)   │  • Official Google Maps Embed API in Place Mode │
│  • Address: Beside SBI, Nagpur Rd,   │  • Fallback to search embed if API key missing  │
│    Bapat Nagar Square, Civil Lines   │  • Neutral shimmer loading placeholder          │
│  • Landmark: Beside SBI              │  • Full native interactive Google Maps controls │
│  • Plus Code: X7GM+9C, Chandrapur    │                                                 │
│  • Hours: 10:00 AM – 10:00 PM Daily  │                                                 │
│  • Phone: +91 86688 06851            │                                                 │
│                                      │                                                 │
│  FOUR PREMIUM ACTION CONTROLS:       │                                                 │
│  [01. GET DIRECTIONS]                │                                                 │
│  [02. CALL THE SALON]                │                                                 │
│  [03. WHATSAPP APPOINTMENT]          │                                                 │
│  [04. OPEN GOOGLE MAPS]              │                                                 │
└──────────────────────────────────────┴─────────────────────────────────────────────────┘
```

---

## 3. Four Core Action Buttons

The four primary actions are designed with clear visual hierarchy, accessible tap targets (min 48px), and direct links:

| Action | Primary Function | Exact Destination URL |
| :--- | :--- | :--- |
| **01. GET DIRECTIONS** | Launches native turn-by-turn navigation using device location | `https://www.google.com/maps/dir/?api=1&destination=Aura+The+Salon%2C+Chandrapur&destination_place_id=ChIJfZdksm_X0jsRkwFrmIZg` |
| **02. CALL THE SALON** | Directly dials the salon reception phone | `tel:+918668806851` |
| **03. WHATSAPP APPOINTMENT** | Opens WhatsApp with prefilled appointment timing query | `https://wa.me/918668806851?text=Hello%20Aura%20The%20Salon!...` |
| **04. OPEN GOOGLE MAPS** | Opens verified Google Business Profile & genuine reviews | `https://www.google.com/maps/search/?api=1&query=Aura+The+Salon%2C+Chandrapur&query_place_id=ChIJfZdksm_X0jsRkwFrmIZg` |

---

## 4. Location Discovery Experience: *"Right here in Chandrapur."*

To assist first-time visitors in immediately recognizing the physical salon:
1. **Authentic Atelier Photography:**
   - Displays the verified salon interior & entrance image (`/images/regenerated_image_1785000416312.png`), ensuring guests can easily identify the space upon arrival.
2. **Wayfinding Milestones:**
   - **01. Landmark:** Located directly beside the State Bank of India (SBI) on Nagpur Road.
   - **02. Junction:** Positioned at Bapat Nagar Square with roadside accessibility.
   - **03. Area:** Situated in the peaceful Civil Lines district of Chandrapur with ample guest parking.
3. **Surroundings & Street View Explorer:**
   - Link: `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=19.9614,79.2962`
   - Lets visitors explore 360° surroundings along Nagpur Road.

---

## 5. Responsive Behavior & Accessibility

- **Mobile Viewports (320px, 375px, 390px, 430px):**
  - Stacks into a clean, legible single column.
  - Map container automatically sizes to `360px` height with full interactive touch panning.
  - Action buttons format into 2x2 or 1x4 stacked grids with generous finger tap targets.
  - Zero horizontal overflow.
- **Motion Accessibility:**
  - Respects `prefers-reduced-motion` across all transition states.
