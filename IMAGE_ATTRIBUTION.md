# Image Attribution & Compliance Record: Aura The Salon

**Document Version:** 1.0.0  
**Compliance Standard:** Google Maps Platform Terms of Service, Places API (New) Policies & Photographic Attribution Guidelines  

---

## 1. Google Places (New) Photo Attribution Framework

In compliance with section 3.2.3 of the Google Maps Platform Terms of Service:
1. **Author Name Display:** When a photo retrieved from the Google Places API is rendered, the `authorAttributions[0].displayName` is displayed visibly on or immediately adjacent to the image.
2. **Author Profile Link:** If the author attribution provides a `uri`, the author name links directly to the contributor's Google Maps profile with `target="_blank"` and `rel="noopener noreferrer"`.
3. **Google Maps Source Link:** A link reading *"View on Google Maps"* is surfaced on the lightbox modal, leading directly to the listing's Google Maps URI.
4. **Google Logo / Powered by Google:** The Places-powered gallery section displays the official *"Powered by Google"* indicator.

---

## 2. Photographic Asset Registry & Attribution Table

| Asset Identifier | Asset Source | Category | Attribution Requirement | Canonical Link |
|---|---|---|---|---|
| `hero-sanctuary-img` | Locked Local Original Asset (`regenerated_image_1785000416312.png`) | Hero Atmosphere & Interior | Aura The Salon Proprietary Sanctuary Asset | Preserved exactly as locked |
| `service-bridal-img` | Local Original Asset (`regenerated_image_1785002876784.jpg`) | Bridal & Occasion Styling | Aura The Salon Photographic Portfolio | On-premise archive |
| `service-hair-img` | Local Original Asset (`regenerated_image_1785002880851.jpg`) | Hair Styling & Atelier | Aura The Salon Photographic Portfolio | On-premise archive |
| `client-care-img` | Local Original Asset (`regenerated_image_1785009577668.jpg`) | Client Care & Consultations | Aura The Salon Photographic Portfolio | On-premise archive |
| `places/photos/*` | Google Places API (New) | Listing Photographs | Dynamic Author Attribution (e.g., Google Business Owner or Contributor) | `authorAttributions[].uri` on Google Maps |
| `owner-upload/*` | Verified Owner Asset Registry | Exterior, Reception, Workstations | © Aura The Salon, Chandrapur. Verified Owner Upload. | `/api/owner-photos` Registry |

---

## 3. Strict Compliance Prohibitions

- **No Scraping:** Images are never scraped from Google Maps via automated bots or crawlers. Only official Google Places API (New) endpoints are called.
- **No Permanent Storage of Google Imagery:** Photo streams proxied through `/api/places/photo` are served dynamically with `Cache-Control: no-store` headers. Photo references are requested freshly as required.
- **No False Claims:** Photographs are labeled honestly without false technical specifications, invented camera models, or 8K resolution exaggerations.
- **No API Key Exposure:** The API key is restricted to backend routes only.
