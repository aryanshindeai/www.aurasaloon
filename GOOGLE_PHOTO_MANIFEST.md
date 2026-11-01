# Google Photo Manifest: Aura The Salon

**Business Name:** Aura The Salon  
**Address:** Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401  
**Platform Integration:** Official Google Places API (New)  
**Document Version:** 1.0.0  
**Compliance Standard:** Google Maps Platform Terms of Service & Places API (New) Policies  

---

## 1. Place Verification & Field Mask Specification

To ensure photographic assets and metadata correspond strictly to the physical salon in Chandrapur without conflation with identically named businesses in other cities, the integration queries the official **Google Places API (New)** Place Details endpoint:

```http
GET https://places.googleapis.com/v1/places/{PLACE_ID}
```

### Required Header Field Mask
```http
X-Goog-Api-Key: [SERVER_SIDE_API_KEY]
X-Goog-FieldMask: id,displayName,formattedAddress,googleMapsUri,rating,userRatingCount,regularOpeningHours,internationalPhoneNumber,photos
```

### Verified Field Map
| Field Name | Purpose | Verified Value / Type |
|---|---|---|
| `id` | Google Place ID | Unique alphanumeric Place ID |
| `displayName` | Business Name | `Aura The Salon` |
| `formattedAddress` | Physical Location | `Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401` |
| `googleMapsUri` | Direct Google Maps URL | Canonical profile URL |
| `rating` | Aggregate Star Rating | Float (e.g., `4.8` - `5.0`) |
| `userRatingCount` | Total Verified Reviews | Integer |
| `regularOpeningHours`| Operating Schedule | `10:00 AM – 10:00 PM Daily` |
| `internationalPhoneNumber`| Direct Phone | `+91 86688 06851` |
| `photos` | Photo Resources Array | Array of `Photo` objects |

---

## 2. Photo Resource Schema & Inspection Rules

Each photo returned by the Google Places API (New) adheres to the following resource schema:

```json
{
  "name": "places/{PLACE_ID}/photos/{PHOTO_REFERENCE}",
  "widthPx": 4032,
  "heightPx": 3024,
  "authorAttributions": [
    {
      "displayName": "Author Name",
      "uri": "https://maps.google.com/maps/contrib/...",
      "photoUri": "https://lh3.googleusercontent.com/..."
    }
  ]
}
```

### Mandatory Inspection Criteria
Before any photo is presented on the public website, it undergoes strict programmatic and visual validation:
1. **Resource Identity:** Freshly generated `name` path (`places/.../photos/...`).
2. **Dimension Constraints:** Original dimensions inspected; API requests clamped to `maxWidthPx` / `maxHeightPx` $\le 4800\text{ px}$.
3. **Author Attribution:** Display name and profile URI must be rendered adjacent to or on hover over the photograph.
4. **Image Relevance:** Verification that the photograph actually depicts Aura The Salon's premises or verified styling work.
5. **No 8K Exaggeration:** Rendered at native responsive resolutions (e.g., 800px - 1600px) with honest clarity descriptions.

---

## 3. Photographic Priority Hierarchy

Photos retrieved from Google Places or submitted by the owner are ranked by the following hierarchy:

| Priority | Category | Subject Matter | Acceptance Criteria |
|---|---|---|---|
| **01** | Actual Salon Exterior | Street-level facade showing "Aura The Salon" signage aside SBI on Nagpur Road. | Visible signage, street orientation. |
| **02** | Actual Entrance | Glass entry door, welcoming threshold, reception foyer. | Clean entrance view. |
| **03** | Actual Reception | Welcome desk, reception lounge, consultation counter. | Welcoming aesthetic. |
| **04** | Actual Interior | Full room perspective showing flooring, lighting, mirrors. | Well-lit, uncluttered view. |
| **05** | Workstations | Signature gold-framed oval halo mirror styling stations, chairs. | Clean styling chairs & mirrors. |
| **06** | Real Equipment | Professional wash basins, dryers, styling tools. | Legitimate salon equipment. |
| **07** | Service In-Progress | Genuine hair styling, wash ritual, or facial care in progress. | Client-consented authentic care. |
| **08** | Authentic Finished Work| Genuine haircut, color result, or bridal styling achieved at Aura. | Unedited, authentic results. |
| **09** | Other Genuine Listing Photos | Client-uploaded or owner-shared verified photos of the premises. | Verified salon context. |

---

## 4. Places Photo (New) Retrieval Specification

Photos are served through a dedicated server-side proxy route:

```http
GET /api/places/photo?name=places/{PLACE_ID}/photos/{PHOTO_ID}&maxWidthPx=1600&maxHeightPx=1200
```

The server queries Google's media endpoint:
```http
GET https://places.googleapis.com/v1/{name}/media?key={API_KEY}&maxWidthPx={maxWidth}&maxHeightPx={maxHeight}&skipHttpRedirect=false
```

### Google Compliance Rules
- **No Permanent Rehosting:** Restricted Google photo blobs are never permanently downloaded or saved to disk.
- **Cache-Control:** All proxy responses send `Cache-Control: no-store, no-cache, must-revalidate`.
- **API Key Protection:** The Google Maps Platform API key is stored strictly on the server (`process.env.GOOGLE_PLACES_API_KEY`) and is never leaked to the client bundle.
- **Attribution Banner:** Every Google Places photo includes "Photo: [Author Name]" with a link to their Google Maps profile.

---

## 5. Owner-Upload System for High-Resolution Assets

For permanent high-definition assets (such as homepage showcases, editorial gallery spreads, and high-fidelity banners), the website provides an **Owner Photographic Registry**:
- Stored in `config/owner-photos.json` and managed via `/api/owner-photos`.
- Each photo records: title, category (Exterior, Interior, Workstation, Bridal, Hair), image URL / path, photographer/owner attribution, and verification timestamp.
- Ensures the salon retains permanent, high-quality, authorized imagery without dependency on external API rate limits.
