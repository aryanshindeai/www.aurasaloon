import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const photoName = searchParams.get('name');
    const maxWidthPx = Math.min(Math.max(parseInt(searchParams.get('maxWidthPx') || '1600', 10), 100), 4800);
    const maxHeightPx = Math.min(Math.max(parseInt(searchParams.get('maxHeightPx') || '1200', 10), 100), 4800);

    if (!photoName || !photoName.startsWith('places/')) {
      return NextResponse.json(
        { error: 'Valid photo resource name required (e.g. places/.../photos/...)' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Places API key not configured on server' },
        { status: 503 }
      );
    }

    // Google Places Photo (New) API Media endpoint
    const googlePhotoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${apiKey}&maxWidthPx=${maxWidthPx}&maxHeightPx=${maxHeightPx}&skipHttpRedirect=false`;

    const photoRes = await fetch(googlePhotoUrl, {
      headers: {
        'Accept': 'image/*'
      }
    });

    if (!photoRes.ok) {
      return NextResponse.json(
        { error: `Google Places photo media request failed with status ${photoRes.status}` },
        { status: photoRes.status }
      );
    }

    const contentType = photoRes.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await photoRes.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // STRICT GOOGLE COMPLIANCE: Do not cache or permanently store restricted Google imagery
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (err: any) {
    console.error('Google Places photo stream error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to stream Places photo' },
      { status: 500 }
    );
  }
}
