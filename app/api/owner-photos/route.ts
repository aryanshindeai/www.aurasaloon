import { NextRequest, NextResponse } from 'next/server';
import { SALON_CONFIG } from '@/config/salon-config';

// Initial verified owner photography repository
let ownerPhotosDatabase = [
  {
    id: "owner-photo-1",
    title: "Aura Salon Interior & Styling Stations",
    category: "Salon Interior",
    priority: "04",
    imageUrl: "/images/regenerated_image_1785000416312.png",
    widthPx: 800,
    heightPx: 983,
    attribution: "Aura The Salon, Chandrapur (Owner Verified)",
    description: "Signature gold-framed oval mirrors, styling chairs, and ambient track lighting inside our Civil Lines sanctuary.",
    verifiedDate: "2026-11-01",
    isOwnerApproved: true
  },
  {
    id: "owner-photo-2",
    title: "Bridal Styling & Artistry",
    category: "Bridal Couture",
    priority: "07",
    imageUrl: "/images/regenerated_image_1785002876784.jpg",
    widthPx: 735,
    heightPx: 916,
    attribution: "Aura The Salon, Chandrapur (Owner Verified)",
    description: "Detailed bridal hair styling and makeup artistry crafted for wedding celebrations.",
    verifiedDate: "2026-11-01",
    isOwnerApproved: true
  },
  {
    id: "owner-photo-3",
    title: "Hair Atelier & Color Care",
    category: "Hair Services",
    priority: "08",
    imageUrl: "/images/regenerated_image_1785002880851.jpg",
    widthPx: 736,
    heightPx: 1141,
    attribution: "Aura The Salon, Chandrapur (Owner Verified)",
    description: "Personalized precision cutting, hair color, and dimensional highlighting.",
    verifiedDate: "2026-11-01",
    isOwnerApproved: true
  },
  {
    id: "owner-photo-4",
    title: "Client Consultation & Care",
    category: "Client Experience",
    priority: "06",
    imageUrl: "/images/regenerated_image_1785009577668.jpg",
    widthPx: 735,
    heightPx: 916,
    attribution: "Aura The Salon, Chandrapur (Owner Verified)",
    description: "Thoughtful one-on-one style consultation and dedicated client care.",
    verifiedDate: "2026-11-01",
    isOwnerApproved: true
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    photos: ownerPhotosDatabase
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, imageUrl, description, author } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Title and Image URL are required" },
        { status: 400 }
      );
    }

    const newPhoto = {
      id: "owner-photo-" + (ownerPhotosDatabase.length + 1),
      title,
      category: category || "Salon Work",
      priority: "09",
      imageUrl,
      widthPx: 1200,
      heightPx: 900,
      attribution: author || "Aura The Salon Owner Upload",
      description: description || "Verified salon photograph",
      verifiedDate: new Date().toISOString().split('T')[0],
      isOwnerApproved: true
    };

    ownerPhotosDatabase.unshift(newPhoto);

    return NextResponse.json({
      success: true,
      message: "Owner photograph registered successfully",
      photo: newPhoto
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
