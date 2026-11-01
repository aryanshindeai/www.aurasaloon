# AURA THE SALON — GOOGLE MAPS PLATFORM & API SETUP GUIDE

**Configuration, Security & Deployment Guide**  
**Project:** Aura The Salon — Chandrapur  
**Verified Google Place ID:** `ChIJfZdksm_X0jsRkwFrmIZg`  
**Coordinates:** `19.9614° N, 79.2962° E`  
**Plus Code:** `X7GM+9C, Chandrapur`

---

## 1. Google Maps Platform Integration Architecture

Aura The Salon employs the **Google Maps Embed API (Place Mode)** to display an interactive, authentic Google Map of the exact salon premises.

### Embed URL Specification (Place Mode)
```
https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=place_id:ChIJfZdksm_X0jsRkwFrmIZg&zoom=17&language=en&region=IN
```

### Fallback Embed URL (Zero-Key Deployment Mode)
If an API key is not configured, the website automatically falls back to:
```
https://maps.google.com/maps?q=Aura+The+Salon%2C+Beside+SBI%2C+Nagpur+Road%2C+Bapat+Nagar+Square%2C+Civil+Lines%2C+Chandrapur%2C+Maharashtra+442401&t=&z=17&ie=UTF8&iwloc=&output=embed
```
This guarantees that **visitors never encounter a blank frame, broken image, or console crash**, even before billing credentials are configured.

---

## 2. Environment Variable Configuration

Add the Google Maps Embed API key to your local or hosting environment:

### Local Development (`.env.local`)
```bash
# Public browser key for Google Maps Embed API
# (Supports both NEXT_PUBLIC_ and VITE_ conventions)
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY="AIzaSy..."
VITE_GOOGLE_MAPS_EMBED_KEY="AIzaSy..."

# Server-side Places API Key (Optional, for Place Details and Reviews)
GOOGLE_PLACES_API_KEY="AIzaSy..."
```

> [!IMPORTANT]
> Any variable prefixed with `NEXT_PUBLIC_` or `VITE_` is delivered into client JavaScript bundles. It is a public browser key, not a server secret. Always apply HTTP Referrer restrictions in Google Cloud Console.

---

## 3. Google Cloud Console Security Restrictions

To protect the API key from quota abuse and unauthorized third-party usage:

### Step 01: Set Application Restrictions (HTTP Referrers)
In Google Cloud Console > **APIs & Services** > **Credentials** > select your Key:
- Set **Application Restrictions** to: **Websites (HTTP Referrers)**
- Add the following allowed referrers:
  ```text
  http://localhost:3000/*
  http://127.0.0.1:3000/*
  https://aurasallon0002.vercel.app/*
  https://*.vercel.app/*
  https://aurathesalon.com/* (when custom domain is activated)
  ```

### Step 02: Set API Restrictions
- Under **API Restrictions**, select **Restrict key**.
- Check strictly:
  - **Maps Embed API** (for the embedded iframe)
  - *(Optional)* **Places API (New)** if sharing the key with server-side Places calls.
- Save restrictions.

---

## 4. Schema.org BeautySalon Local Business Structured Data

The location experience automatically injects search engine metadata via JSON-LD (`BeautySalon`):

```json
{
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "name": "Aura The Salon",
  "telephone": "+918668806851",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines",
    "addressLocality": "Chandrapur",
    "addressRegion": "Maharashtra",
    "postalCode": "442401",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 19.9614,
    "longitude": 79.2962
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "bestRating": "5"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "10:00",
      "closes": "22:00"
    }
  ],
  "hasMap": "https://www.google.com/maps/search/?api=1&query=Aura+The+Salon%2C+Chandrapur&query_place_id=ChIJfZdksm_X0jsRkwFrmIZg"
}
```
