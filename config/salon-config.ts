import regeneratedSalonImg from '@/src/assets/images/regenerated_image_1785000416312.png';
import service1Img from '@/src/assets/images/regenerated_image_1785002876784.jpg';
import bridalStylingImg from '@/src/assets/images/bridal_occasion_styling.jpg';
import hairColorImg from '@/src/assets/images/hair_color_highlights.jpg';
import hairSpaImg from '@/src/assets/images/deep_nourishing_hair_spa.jpg';
import precisionHaircutImg from '@/src/assets/images/precision_haircut_styling.jpg';
import facialImg from '@/src/assets/images/refreshing_radiance_facial.jpg';
import service2Img from '@/src/assets/images/regenerated_image_1785002880851.jpg';
import modelBeforeImg from '@/src/assets/images/regenerated_image_1785009577668.jpg';

export const getImgSrc = (img: any): string => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && typeof img.src === 'string') return img.src;
  return String(img);
};

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  duration: string;
  image: string;
  keyBenefits: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Salon' | 'Hair' | 'Bridal' | 'Care';
  image: string;
  description: string;
}

export const SALON_CONFIG = {
  brand: {
    name: "Aura The Salon",
    shortName: "AURA",
    tagline: "Feel Good. Look Your Best.",
    welcomeMessage: "Welcome to Aura The Salon. A place to discover your style, enjoy a refreshing salon experience and feel your best.",
    phone: "86688 06851",
    phoneClean: "8668806851",
    whatsappNumber: "918668806851",
    address: {
      line1: "Beside SBI, Nagpur Road",
      line2: "Bapat Nagar Square, Civil Lines",
      city: "Chandrapur",
      state: "Maharashtra",
      pincode: "442401",
      full: "Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401"
    },
    landmark: "Beside SBI",
    plusCode: "X7GM+9C, Chandrapur",
    hours: "10:00 AM – 10:00 PM Daily",
    hoursNote: "Please contact the salon to confirm today's availability.",
    rating: "4.7/5",
    placeId: "ChIJfZdksm_X0jsRkwFrmIZg",
    coordinates: {
      lat: 19.9614,
      lng: 79.2962
    },
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Aura+The+Salon%2C+Chandrapur&query_place_id=ChIJfZdksm_X0jsRkwFrmIZg",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Aura+The+Salon%2C+Chandrapur&destination_place_id=ChIJfZdksm_X0jsRkwFrmIZg"
  },

  hero: {
    headline: "Feel Good. Look Your Best.",
    subheadline: "Welcome to Aura The Salon. A place to discover your style, enjoy a refreshing salon experience and feel your best.",
    videoFallbackImg: getImgSrc(regeneratedSalonImg),
    badgeText: "Aura The Salon • Chandrapur",
    highlights: [
      { label: "Prime Location", desc: "Beside SBI, Nagpur Road, Civil Lines" },
      { label: "Welcoming Hours", desc: "10:00 AM – 10:00 PM Daily" },
      { label: "Personalized Care", desc: "Tailored Hair, Skin & Bridal Services" }
    ]
  },

  about: {
    title: "About Aura The Salon",
    subtitle: "A FRESH, WELCOMING SALON EXPERIENCE",
    headline: "A sanctuary dedicated to your confidence and style.",
    paragraphs: [
      "Welcome to Aura The Salon, conveniently situated aside SBI on Nagpur Road at Bapat Nagar Square, Civil Lines, Chandrapur.",
      "Our philosophy is simple: when you take time for yourself, it shows. We offer a calm, welcoming environment where you can relax, refresh, and receive thoughtful care from passionate stylists and beauty professionals.",
      "Whether you are visiting for an everyday haircut, a nourishing hair spa, a radiant facial, or complete bridal and occasion styling, our team is dedicated to listening to what you want and helping you feel good and look your best."
    ]
  },

  navigation: [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Gallery", href: "#gallery" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" }
  ],

  serviceCategories: [
    "All Services",
    "Hair Cut & Styling",
    "Hair Color & Highlights",
    "Hair Spa & Treatments",
    "Skin Care & Facials",
    "Bridal & Special Occasions"
  ],

  services: [
    {
      id: "hair-cut-styling",
      name: "Precision Haircut & Styling",
      category: "Hair Cut & Styling",
      shortDesc: "Personalized consultation, refreshing wash, customized precision cut, and blow-dry finish.",
      fullDesc: "Designed around your personal style, hair texture, and face shape. Includes a relaxing scalp wash, customized precision cut, and a blow-dry finish so you walk out looking and feeling your best.",
      duration: "45 - 60 mins",
      image: getImgSrc(precisionHaircutImg),
      keyBenefits: ["Consultation tailored to your hair texture", "Refreshing scalp wash", "Blow-dry styling included"]
    },
    {
      id: "hair-color-highlights",
      name: "Hair Color & Highlights",
      category: "Hair Color & Highlights",
      shortDesc: "Complete hair coloring, root touch-ups, and dimensional highlighting tailored to your style.",
      fullDesc: "From natural tone-on-tone color and gray coverage to dimensional highlights and balayage. We carefully select the right shades to complement your look while keeping your hair feeling healthy and soft.",
      duration: "90 - 180 mins",
      image: getImgSrc(hairColorImg),
      keyBenefits: ["Customized shade matching", "Even, vibrant coverage", "Nourishing post-color treatment"]
    },
    {
      id: "deep-nourishing-hair-spa",
      name: "Deep Nourishing Hair Spa",
      category: "Hair Spa & Treatments",
      shortDesc: "Intense moisture infusion, scalp massage, steam therapy, and restorative hair mask.",
      fullDesc: "A relaxing treatment designed to revive dry, stressed, or treated hair. Combines a soothing scalp massage with intensive nutrient conditioning and gentle steam to restore natural softness and shine.",
      duration: "60 mins",
      image: getImgSrc(hairSpaImg),
      keyBenefits: ["Deep hydration for dry hair", "Gentle scalp massage", "Restores natural softness"]
    },
    {
      id: "refreshing-radiance-facial",
      name: "Refreshing Radiance Facial",
      category: "Skin Care & Facials",
      shortDesc: "Deep cleansing, gentle exfoliation, pore care, relaxing facial massage, and hydrating mask.",
      fullDesc: "A revitalizing facial care session to cleanse, refresh, and hydrate your skin. Leaves your complexion feeling thoroughly cleansed, smooth, and naturally luminous.",
      duration: "60 - 75 mins",
      image: getImgSrc(facialImg),
      keyBenefits: ["Thorough gentle cleansing", "Relaxing facial massage", "Instant hydration and natural glow"]
    },
    {
      id: "bridal-occasion-styling",
      name: "Bridal & Occasion Styling",
      category: "Bridal & Special Occasions",
      shortDesc: "Specialized hair styling, makeup artistry, and draping for weddings, celebrations, and events.",
      fullDesc: "Carefully designed for your most memorable moments. Our team works with you to craft a cohesive, elegant bridal or celebration look that stays comfortable and looks beautiful all day.",
      duration: "120 - 240 mins",
      image: getImgSrc(bridalStylingImg),
      keyBenefits: ["Personalized pre-consultation", "Long-lasting occasion makeup", "Hair styling & saree/lehenga draping"]
    }
  ] as ServiceItem[],

  gallery: [
    {
      id: "g1",
      title: "Salon Ambience & Styling Stations",
      category: "Salon",
      image: getImgSrc(regeneratedSalonImg),
      description: "Our comfortable, welcoming salon space with signature mirrors and modern styling stations."
    },
    {
      id: "g2",
      title: "Bridal Styling & Artistry",
      category: "Bridal",
      image: getImgSrc(bridalStylingImg),
      description: "Elegantly finished bridal hair, makeup, and draping for special wedding moments."
    },
    {
      id: "g3",
      title: "Hair Styling & Color Services",
      category: "Hair",
      image: getImgSrc(hairColorImg),
      description: "Personalized haircutting, multidimensional color, and smooth blowout finishing."
    },
    {
      id: "g4",
      title: "Client Care & Consultations",
      category: "Care",
      image: getImgSrc(modelBeforeImg),
      description: "Dedicated attention to your individual style and comfort during every visit."
    }
  ] as GalleryItem[]
};
