import { NextRequest, NextResponse } from 'next/server';
import { SALON_CONFIG } from '@/config/salon-config';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

    // Verified Chandrapur coordinates & identity
    const fallbackData = {
      id: "verified-aura-chandrapur",
      displayName: { text: SALON_CONFIG.brand.name, languageCode: "en" },
      formattedAddress: SALON_CONFIG.brand.address.full,
      googleMapsUri: SALON_CONFIG.brand.googleMapsUrl,
      internationalPhoneNumber: "+91 " + SALON_CONFIG.brand.phone,
      regularOpeningHours: {
        weekdayDescriptions: [
          "Monday: 10:00 AM – 10:00 PM",
          "Tuesday: 10:00 AM – 10:00 PM",
          "Wednesday: 10:00 AM – 10:00 PM",
          "Thursday: 10:00 AM – 10:00 PM",
          "Friday: 10:00 AM – 10:00 PM",
          "Saturday: 10:00 AM – 10:00 PM",
          "Sunday: 10:00 AM – 10:00 PM"
        ],
        openNow: true
      },
      hasLiveGooglePlaces: false,
      photos: []
    };

    if (!apiKey) {
      return NextResponse.json(
        {
          success: true,
          source: 'verified-local-record',
          message: 'Google Places API key not configured on server. Serving verified local profile data.',
          place: fallbackData
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache'
          }
        }
      );
    }

    // If an exact Place ID is set in env, use it; otherwise search by text query
    const placeId = process.env.GOOGLE_PLACE_ID;
    
    let targetPlaceId = placeId;

    if (!targetPlaceId) {
      // Find exact Place ID via Text Search (New) for Aura The Salon Chandrapur Beside SBI
      const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
        },
        body: JSON.stringify({
          textQuery: 'Aura The Salon Beside SBI Nagpur Road Chandrapur Maharashtra',
          locationBias: {
            circle: {
              center: { latitude: 19.9614, longitude: 79.2962 },
              radius: 500.0
            }
          }
        })
      });

      if (searchRes.ok) {
        const searchJson = await searchRes.json();
        targetPlaceId = searchJson?.places?.[0]?.id;
      }
    }

    if (!targetPlaceId) {
      return NextResponse.json({
        success: true,
        source: 'verified-local-record',
        place: fallbackData
      });
    }

    // Call official Place Details (New) with exact field mask
    const fieldMask = [
      'id',
      'displayName',
      'formattedAddress',
      'googleMapsUri',
      'rating',
      'userRatingCount',
      'regularOpeningHours',
      'internationalPhoneNumber',
      'photos'
    ].join(',');

    const detailsRes = await fetch(`https://places.googleapis.com/v1/places/${targetPlaceId}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask
      }
    });

    if (!detailsRes.ok) {
      return NextResponse.json({
        success: true,
        source: 'verified-local-record',
        place: fallbackData
      });
    }

    const placeDetails = await detailsRes.json();

    // Map photo resources to safe proxies with author attributions
    const safePhotos = (placeDetails.photos || []).map((photo: any) => ({
      name: photo.name,
      widthPx: Math.min(photo.widthPx || 1600, 4800),
      heightPx: Math.min(photo.heightPx || 1200, 4800),
      authorAttributions: photo.authorAttributions || [],
      proxyUrl: `/api/places/photo?name=${encodeURIComponent(photo.name)}&maxWidthPx=1600&maxHeightPx=1200`
    }));

    return NextResponse.json(
      {
        success: true,
        source: 'google-places-api-new',
        place: {
          ...placeDetails,
          hasLiveGooglePlaces: true,
          photos: safePhotos
        }
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache'
        }
      }
    );
  } catch (err: any) {
    console.error('Places details error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to query Places API'
      },
      { status: 500 }
    );
  }
}
