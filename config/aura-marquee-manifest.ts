/**
 * AURA THE SALON — AUTHENTIC IMAGE MANIFEST
 * 
 * 16 Named Image Slots representing genuine photographs of Aura The Salon
 * Beside SBI, Nagpur Road, Civil Lines, Chandrapur (Place ID: ChIJfZdksm_X0jsRkwFrmIZg).
 * 
 * CRITICAL RULE:
 * Every displayed image must be a verified photograph of Aura The Salon or its genuine work.
 * No generic stock, no AI-generated people, no other salons.
 * Unfilled slots are kept in manifest as pending owner capture rather than filled with fake images.
 */

export interface MarqueeImageSlot {
  slotId: string;
  slotNumber: string;
  name: string;
  description: string;
  category: 'Interior' | 'Exterior' | 'Work' | 'Team' | 'Consultation';
  status: 'verified-active' | 'pending-owner-file';
  imageUrl?: string;
  originalWidth?: number;
  originalHeight?: number;
  focalPoint?: string; // CSS object-position e.g. 'center center'
  attribution: string;
  sourceType: 'owner-original' | 'google-places';
  authorUri?: string;
  googleMapsUri?: string;
  license: string;
  altText: string;
}

export const AURA_16_IMAGE_MANIFEST: MarqueeImageSlot[] = [
  {
    slotId: 'aura-exterior',
    slotNumber: '01',
    name: 'Aura Salon Exterior',
    description: 'Actual exterior facade of Aura The Salon on Nagpur Road, beside State Bank of India, Chandrapur.',
    category: 'Exterior',
    status: 'pending-owner-file',
    attribution: 'Aura The Salon, Chandrapur',
    sourceType: 'owner-original',
    license: 'Owner Approved / Direct Permission',
    altText: 'Exterior facade of Aura The Salon beside SBI, Civil Lines, Chandrapur'
  },
  {
    slotId: 'aura-entrance',
    slotNumber: '02',
    name: 'Salon Entrance & Signage',
    description: 'Genuine entrance and business signage welcoming visitors into the salon atelier.',
    category: 'Exterior',
    status: 'pending-owner-file',
    attribution: 'Aura The Salon, Chandrapur',
    sourceType: 'owner-original',
    license: 'Owner Approved / Direct Permission',
    altText: 'Entrance signage of Aura The Salon, Bapat Nagar Square'
  },
  {
    slotId: 'aura-reception',
    slotNumber: '03',
    name: 'Aura Reception Desk',
    description: 'Actual salon reception counter where client arrivals, bookings, and inquiries are received.',
    category: 'Interior',
    status: 'pending-owner-file',
    attribution: 'Aura The Salon, Chandrapur',
    sourceType: 'owner-original',
    license: 'Owner Approved / Direct Permission',
    altText: 'Reception and guest arrival lounge at Aura The Salon Chandrapur'
  },
  {
    slotId: 'aura-main-interior',
    slotNumber: '04',
    name: 'Nails Speak Before Words — Luxury Nail Artistry',
    description: 'Signature metallic chrome nail artistry and manicure elegance: elegance at your fingertips, confidence in every shade.',
    category: 'Work',
    status: 'verified-active',
    imageUrl: '/images/marquee_nails_speak.jpg',
    originalWidth: 681,
    originalHeight: 1024,
    focalPoint: 'center center',
    attribution: 'Aura The Salon Nail Atelier',
    sourceType: 'owner-original',
    license: 'Owner Verified Original File',
    altText: 'Nails Speak Before Words luxury metallic purple nail artistry at Aura The Salon'
  },
  {
    slotId: 'aura-styling-stations',
    slotNumber: '05',
    name: 'Styling Workstations & Mirrors',
    description: 'Actual styling chairs and signature gold-framed halo oval mirrors inside the salon atelier.',
    category: 'Interior',
    status: 'pending-owner-file',
    attribution: 'Aura The Salon (Owner Verified Photography)',
    sourceType: 'owner-original',
    license: 'Owner Verified Original File',
    altText: 'Aura The Salon styling workstations with gold-rimmed mirrors and comfortable styling chairs'
  },
  {
    slotId: 'aura-wash-area',
    slotNumber: '06',
    name: 'Hair Washing Sanctuary',
    description: 'Actual hair-washing area with reclining wash basin chairs for relaxing shampoo rituals.',
    category: 'Interior',
    status: 'pending-owner-file',
    attribution: 'Aura The Salon, Chandrapur',
    sourceType: 'owner-original',
    license: 'Owner Approved / Direct Permission',
    altText: 'Hair wash station and reclining basin at Aura The Salon'
  },
  {
    slotId: 'aura-haircut-process',
    slotNumber: '07',
    name: 'The Butterfly Cut — Curtain Bangs & Layering',
    description: 'Signature Butterfly Cut styling guide featuring soft face-framing curtain bangs, feathered layers, and voluminous cascading movement.',
    category: 'Work',
    status: 'verified-active',
    imageUrl: '/images/marquee_butterfly_cut.jpg',
    originalWidth: 768,
    originalHeight: 1024,
    focalPoint: 'center center',
    attribution: 'Aura The Salon Hair Artistry',
    sourceType: 'owner-original',
    license: 'Owner Verified Original File',
    altText: 'The Butterfly Cut with soft face framing curtain bangs and feathered layers at Aura The Salon'
  },
  {
    slotId: 'aura-haircut-result',
    slotNumber: '08',
    name: 'V-Cut Long Layers — Fluid Movement & Dimension',
    description: 'Precision tapered V-cut long layers designed for natural volume, fluid movement, and multi-style versatility.',
    category: 'Work',
    status: 'verified-active',
    imageUrl: '/images/marquee_v_cut_layers.jpg',
    originalWidth: 796,
    originalHeight: 1024,
    focalPoint: 'center center',
    attribution: 'Aura The Salon Hair Artistry',
    sourceType: 'owner-original',
    license: 'Owner Verified Original File',
    altText: 'V-Cut Long Layers front and back view styling showcase by Aura The Salon'
  },
  {
    slotId: 'aura-colour-process',
    slotNumber: '09',
    name: 'Hair Colouring Application',
    description: 'Genuine hair-colouring and balayage application work in progress.',
    category: 'Work',
    status: 'pending-owner-file',
    attribution: 'Aura The Salon, Chandrapur',
    sourceType: 'owner-original',
    license: 'Owner Approved / Direct Permission',
    altText: 'Hair colorist applying foils and dimensional color at Aura The Salon'
  },
  {
    slotId: 'aura-colour-result',
    slotNumber: '10',
    name: 'Dimensional Color & Highlights Result',
    description: 'Actual finished hair color result displaying rich dimensional tone and soft transition.',
    category: 'Work',
    status: 'pending-owner-file',
    attribution: 'Aura The Salon (Owner Verified Photography)',
    sourceType: 'owner-original',
    license: 'Owner Verified Original File',
    altText: 'Finished dimensional hair color and balayage result by Aura The Salon'
  },
  {
    slotId: 'aura-styling-process',
    slotNumber: '11',
    name: 'Styling & Care in Progress',
    description: 'Actual stylist performing personalized client consultation, hair analysis, and sectioning.',
    category: 'Work',
    status: 'pending-owner-file',
    attribution: 'Aura The Salon (Client Consultation & Care Photography)',
    sourceType: 'owner-original',
    license: 'Owner Verified Original File',
    altText: 'Stylist consulting with client and tailoring treatment at Aura The Salon'
  },
  {
    slotId: 'aura-styling-result',
    slotNumber: '12',
    name: 'Heritage Bridal & Traditional Occasion Artistry',
    description: 'Exquisite traditional bridal makeover featuring classic floral adornment, royal gold jewellery, and timeless saree styling.',
    category: 'Work',
    status: 'verified-active',
    imageUrl: '/images/marquee_bridal_traditional.jpg',
    originalWidth: 735,
    originalHeight: 916,
    focalPoint: 'center 20%',
    attribution: 'Aura The Salon Bridal Couture',
    sourceType: 'owner-original',
    license: 'Owner Verified Original File',
    altText: 'Aura The Salon heritage bridal styling with gold jewelry and floral hair adornment'
  },
  {
    slotId: 'aura-treatment',
    slotNumber: '13',
    name: 'Deep Nourishing Hair Spa Treatment',
    description: 'Actual hair spa restorative hydration ritual in progress.',
    category: 'Work',
    status: 'pending-owner-file',
    attribution: 'Aura The Salon, Chandrapur',
    sourceType: 'owner-original',
    license: 'Owner Approved / Direct Permission',
    altText: 'Deep conditioning hair spa treatment at Aura The Salon'
  },
  {
    slotId: 'aura-nail-art',
    slotNumber: '14',
    name: 'Pampered Feet Ritual & Pedicure Care',
    description: 'Luxurious restorative pedicure ritual, gentle exfoliation, and soothing foot care in the tranquil Aura sanctuary.',
    category: 'Work',
    status: 'verified-active',
    imageUrl: '/images/marquee_pedicure_feet.png',
    originalWidth: 796,
    originalHeight: 1024,
    focalPoint: 'center center',
    attribution: 'Aura The Salon Spa Sanctuary',
    sourceType: 'owner-original',
    license: 'Owner Verified Original File',
    altText: 'Perfect pampered feet and pedicure spa ritual at Aura The Salon'
  },
  {
    slotId: 'aura-staff',
    slotNumber: '15',
    name: 'Salon Stylist Team at Work',
    description: 'Actual salon team members at work inside the Civil Lines salon, with permission.',
    category: 'Team',
    status: 'pending-owner-file',
    attribution: 'Aura The Salon Team (Owner Verified)',
    sourceType: 'owner-original',
    license: 'Owner Verified Original File',
    altText: 'Aura The Salon creative team member providing styling consultation'
  },
  {
    slotId: 'aura-beauty-work',
    slotNumber: '16',
    name: 'Aura Jewels — Timeless Luxury Bridal Couture',
    description: 'Bespoke bridal couture and jewellery elegance — timeless luxury crafted for unforgettable wedding celebrations.',
    category: 'Work',
    status: 'verified-active',
    imageUrl: '/images/marquee_aura_jewels_timeless.png',
    originalWidth: 796,
    originalHeight: 1024,
    focalPoint: 'center 25%',
    attribution: 'Aura The Salon Bridal Couture (Client Signature Collection)',
    sourceType: 'owner-original',
    license: 'Owner Verified Original File',
    altText: 'Aura Jewels timeless bridal couture and heirloom jewelry styling at Aura The Salon'
  }
];

/**
 * Returns strictly the unique, verified, active authentic photographs
 * for the infinite marquee. Never duplicates unique items in the source array.
 */
export function getUniqueVerifiedMarqueeImages(): MarqueeImageSlot[] {
  // Deduplicate by imageUrl to guarantee every single image in the active list is distinct!
  const seenUrls = new Set<string>();
  const verifiedUnique: MarqueeImageSlot[] = [];

  // Prioritize user's favourite signature bridal couture and new authentic works
  const prioritySlotIds = [
    'aura-beauty-work',     // User's favourite: Aura Jewels / Timeless Like You
    'aura-haircut-process', // The Butterfly Cut
    'aura-haircut-result',  // V-Cut Long Layers
    'aura-styling-result',  // Heritage Bridal Traditional
    'aura-nail-art',        // Pampered Feet & Pedicure Care
    'aura-main-interior'    // Main Salon Sanctuary Interior
  ];

  for (const id of prioritySlotIds) {
    const slot = AURA_16_IMAGE_MANIFEST.find((s) => s.slotId === id);
    if (slot && slot.status === 'verified-active' && slot.imageUrl && !seenUrls.has(slot.imageUrl)) {
      seenUrls.add(slot.imageUrl);
      verifiedUnique.push(slot);
    }
  }

  // Any other active slots
  for (const slot of AURA_16_IMAGE_MANIFEST) {
    if (slot.status === 'verified-active' && slot.imageUrl && !seenUrls.has(slot.imageUrl)) {
      seenUrls.add(slot.imageUrl);
      verifiedUnique.push(slot);
    }
  }

  return verifiedUnique;
}
