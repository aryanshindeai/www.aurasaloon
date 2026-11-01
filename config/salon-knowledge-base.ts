export interface SalonKnowledgeBase {
  name: string;
  phone: string;
  phoneClean: string;
  address: string;
  landmark: string;
  hours: string;
  rating: string;
  placeId: string;
  whatsappUrl: string;
  googleMapsUrl: string;
  directionsUrl: string;
  services: {
    category: string;
    description: string;
  }[];
}

export const SALON_KB: SalonKnowledgeBase = {
  name: "Aura The Salon",
  phone: "+91 86688 06851",
  phoneClean: "918668806851",
  address: "Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401",
  landmark: "Beside State Bank of India (SBI), Nagpur Road, Bapat Nagar Square",
  hours: "10:00 AM – 10:00 PM Daily (Monday through Sunday), according to the current business listing",
  rating: "4.7 / 5 on Google Maps, subject to live listing updates",
  placeId: "ChIJfZdksm_X0jsRkwFrmIZg",
  whatsappUrl: "https://wa.me/918668806851",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Aura+The+Salon+Chandrapur&query_place_id=ChIJfZdksm_X0jsRkwFrmIZg",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Beside+SBI+Nagpur+Road+Bapat+Nagar+Square+Civil+Lines+Chandrapur+Maharashtra+442401",
  services: [
    {
      category: "Hair Cut & Styling",
      description: "Precision cutting tailored to your face shape, refreshing hair wash, blowout, and everyday styling."
    },
    {
      category: "Hair Color & Highlights",
      description: "Root touch-ups, global coloring, grey coverage, and dimensional highlighting tailored to your hair texture."
    },
    {
      category: "Hair Spa & Treatments",
      description: "Deep nourishing hair spa, relaxing scalp massage, steam treatment, and restorative hydration for dry or treated hair."
    },
    {
      category: "Skin Care & Facials",
      description: "Gentle facial cleansing, pore care, revitalizing face massage, and hydrating radiance masks."
    },
    {
      category: "Bridal & Special Occasions",
      description: "Bridal hair styling, occasion makeup, and saree or lehenga draping for weddings and celebrations."
    }
  ]
};

export const QUICK_QUESTIONS = [
  "Where is Aura The Salon located?",
  "What are your opening hours?",
  "How can I book an appointment?",
  "What salon service categories are available?",
  "How can I contact the salon?",
  "Can I get directions?",
  "What is your Google rating?"
];

export interface AnswerPayload {
  answer: string;
  showWhatsAppButton?: boolean;
  showDirectionsButton?: boolean;
  serviceContext?: string;
  whatsappMessage?: string;
  source: 'verified-knowledge-base' | 'ai-retrieval' | 'fallback-boundary';
}

export function detectLanguage(text: string): 'en' | 'hi' | 'mr' {
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (!hasDevanagari) return 'en';

  // Marathi markers
  if (/(कुठे|काय|कसे|कशी|करावी|करावे|वेळ|आहे|पत्ता|संपर्क|सलून|रस्ता|कधी|नाही|होय)/i.test(text)) {
    return 'mr';
  }
  return 'hi';
}

/**
 * Strict Grounded Retrieval from the Verified Salon Knowledge Base
 */
export function getKnowledgeBaseAnswer(query: string): AnswerPayload | null {
  const q = query.trim().toLowerCase();
  const lang = detectLanguage(query);

  // Guardrail check: If asking for discounts, offers, or unconfirmed packages -> trigger unavailable fallback!
  if (
    q.includes("discount") ||
    q.includes("offer") ||
    q.includes("coupon") ||
    q.includes("promo") ||
    q.includes("ऑफर") ||
    q.includes("सूट")
  ) {
    return null; // Triggers official unavailable fallback
  }

  // Guardrail check: Non-salon irrelevant queries (electronics, medicine, diagnostics, laptops)
  if (
    q.includes("laptop") ||
    q.includes("diagnose") ||
    q.includes("psoriasis") ||
    q.includes("medicine") ||
    q.includes("doctor") ||
    q.includes("repair")
  ) {
    return null; // Triggers official unavailable fallback
  }

  // 1. Location / Address / Where
  if (
    q.includes("located") ||
    q.includes("where") ||
    q.includes("address") ||
    q.includes("location") ||
    q.includes("kahan") ||
    q.includes("kidhar") ||
    q.includes("पत्ता") ||
    q.includes("पता") ||
    q.includes("कुठे") ||
    q.includes("कहाँ") ||
    q.includes("स्थान")
  ) {
    if (lang === 'mr') {
      return {
        answer: `ऑरा द सलून (Aura The Salon) चंद्रपूर येथील सिव्हिल लाइन्स, बापट नगर चौक, नागपूर रोडवर स्टेट बँक ऑफ इंडियाच्या (SBI) अगदी शेजारी स्थित आहे.\n\nपत्ता: Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401.`,
        showDirectionsButton: true,
        source: 'verified-knowledge-base'
      };
    }
    if (lang === 'hi') {
      return {
        answer: `ऑरा द सैलून (Aura The Salon) चंद्रपुर में सिविल लाइंस, बापट नगर स्क्वायर, नागपुर रोड पर स्टेट बैंक ऑफ इंडिया (SBI) के ठीक बगल में स्थित है।\n\nपता: Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401.`,
        showDirectionsButton: true,
        source: 'verified-knowledge-base'
      };
    }
    return {
      answer: `Aura The Salon is located Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401.`,
      showDirectionsButton: true,
      source: 'verified-knowledge-base'
    };
  }

  // 2. Opening Hours / Timing / Schedule
  if (
    q.includes("opening hours") ||
    q.includes("hours") ||
    q.includes("timing") ||
    q.includes("timings") ||
    q.includes("what time") ||
    q.includes("open") ||
    q.includes("close") ||
    q.includes("samay") ||
    q.includes("वेळ") ||
    q.includes("कधी") ||
    q.includes("समय")
  ) {
    if (lang === 'mr') {
      return {
        answer: `आमचे सलून आठवड्याचे सातही दिवस (सोमवार ते रविवार) सकाळी 10:00 ते रात्री 10:00 वाजेपर्यंत सुरू असते, सध्याच्या बिझनेस लिस्टिंगनुसार.`,
        showWhatsAppButton: true,
        source: 'verified-knowledge-base'
      };
    }
    if (lang === 'hi') {
      return {
        answer: `वर्तमान बिज़नेस लिस्टिंग के अनुसार, हमारा सैलून सप्ताह के सातों दिन (सोमवार से रविवार) सुबह 10:00 बजे से रात 10:00 बजे तक खुला रहता है।`,
        showWhatsAppButton: true,
        source: 'verified-knowledge-base'
      };
    }
    return {
      answer: `Aura The Salon is open from 10:00 AM to 10:00 PM daily (Monday through Sunday), according to the current business listing.`,
      showWhatsAppButton: true,
      source: 'verified-knowledge-base'
    };
  }

  // 3. Appointment / Booking
  if (
    q.includes("book") ||
    q.includes("appointment") ||
    q.includes("reserve") ||
    q.includes("booking") ||
    q.includes("अपॉइंटमेंट") ||
    q.includes("बुकिंग")
  ) {
    if (lang === 'mr') {
      return {
        answer: `तुम्ही खाली दिलेल्या 'BOOK THROUGH WHATSAPP' बटनावर क्लिक करून थेट व्हॉट्सॲपवर अपॉइंटमेंट बुक करू शकता किंवा आम्हाला +91 86688 06851 वर कॉल करू शकता. सलून रिसेप्शनकडून वेळ निश्चित केली जाईल.`,
        showWhatsAppButton: true,
        whatsappMessage: "Hello Aura The Salon, I would like to book an appointment.",
        source: 'verified-knowledge-base'
      };
    }
    if (lang === 'hi') {
      return {
        answer: `आप नीचे दिए गए 'BOOK THROUGH WHATSAPP' बटन पर क्लिक करके सीधे व्हाट्सएप पर अपॉइंटमेंट बुक कर सकते हैं या हमें +91 86688 06851 पर कॉल कर सकते हैं। हमारी रिसेप्शन टीम तुरंत समय की पुष्टि करेगी।`,
        showWhatsAppButton: true,
        whatsappMessage: "Hello Aura The Salon, I would like to book an appointment.",
        source: 'verified-knowledge-base'
      };
    }
    return {
      answer: `You can book an appointment easily by clicking the 'BOOK THROUGH WHATSAPP' button below or calling us at +91 86688 06851. Our reception team will confirm your timing directly.`,
      showWhatsAppButton: true,
      whatsappMessage: "Hello Aura The Salon, I would like to book an appointment.",
      source: 'verified-knowledge-base'
    };
  }

  // 4. Service Categories / Available Services
  if (
    q.includes("service categories") ||
    q.includes("services are available") ||
    q.includes("services available") ||
    q.includes("what services") ||
    q.includes("list of services") ||
    q.includes("सेवा")
  ) {
    if (lang === 'mr') {
      return {
        answer: `ऑरा द सलूनमध्ये उपलब्ध असलेल्या अधिकृत सेवा:\n\n• हेअर कट आणि स्टाइलिंग\n• हेअर कलर आणि हायलाइट्स\n• डीप नरिशिंग हेअर स्पा\n• स्किन केअर आणि फेशियल\n• ब्राइडल व स्पेशल ओकेजन स्टाइलिंग\n\nतपशीलांसाठी किंवा बुकिंगसाठी आपण थेट व्हॉट्सॲपवर संपर्क करू शकता.`,
        showWhatsAppButton: true,
        source: 'verified-knowledge-base'
      };
    }
    if (lang === 'hi') {
      return {
        answer: `ऑरा द सैलून में उपलब्ध सेवा श्रेणियां:\n\n• हेयर कट और स्टाइलिंग\n• हेयर कलर और हाइलाइट्स\n• डीप नरिशिंग हेयर स्पा\n• स्किन केयर और फेशियल\n• ब्राइडल और स्पेशल ओकेजन स्टाइलिंग\n\nअधिक जानकारी या अपॉइंटमेंट के लिए नीचे दिए गए व्हाट्सएप बटन का उपयोग करें।`,
        showWhatsAppButton: true,
        source: 'verified-knowledge-base'
      };
    }
    return {
      answer: `Aura The Salon offers five confirmed service categories:\n\n• Hair Cut & Styling\n• Hair Color & Highlights\n• Deep Nourishing Hair Spa\n• Skin Care & Facials\n• Bridal & Special Occasion Styling\n\nYou can book any service directly through WhatsApp.`,
      showWhatsAppButton: true,
      source: 'verified-knowledge-base'
    };
  }

  // 5. Contact / Phone Number / Call
  if (
    q.includes("contact the salon") ||
    q.includes("contact") ||
    q.includes("phone number") ||
    q.includes("call the salon") ||
    q.includes("call you") ||
    q.includes("whatsapp number") ||
    q.includes("संपर्क") ||
    q.includes("फोन नंबर")
  ) {
    if (lang === 'mr') {
      return {
        answer: `तुम्ही ऑरा द सलूनशी खालीलप्रमाणे संपर्क साधू शकता:\n\n• थेट फोन: +91 86688 06851\n• व्हॉट्सॲप: +91 86688 06851\n• पत्ता: Beside SBI, Nagpur Road, Civil Lines, Chandrapur.`,
        showWhatsAppButton: true,
        source: 'verified-knowledge-base'
      };
    }
    if (lang === 'hi') {
      return {
        answer: `आप ऑरा द सैलून से इस प्रकार संपर्क कर सकते हैं:\n\n• फोन: +91 86688 06851\n• व्हाट्सएप: +91 86688 06851\n• पता: Beside SBI, Nagpur Road, Civil Lines, Chandrapur.`,
        showWhatsAppButton: true,
        source: 'verified-knowledge-base'
      };
    }
    return {
      answer: `You can reach Aura The Salon directly:\n\n• Phone: +91 86688 06851\n• WhatsApp: +91 86688 06851\n• Location: Beside SBI, Nagpur Road, Civil Lines, Chandrapur.`,
      showWhatsAppButton: true,
      source: 'verified-knowledge-base'
    };
  }

  // 6. Directions / Route / Map
  if (
    q.includes("directions") ||
    q.includes("get directions") ||
    q.includes("how to reach") ||
    q.includes("rasta") ||
    q.includes("मार्ग") ||
    q.includes("दिशा") ||
    q.includes("रस्ता")
  ) {
    if (lang === 'mr') {
      return {
        answer: `ऑरा द सलून चंद्रपूर येथील नागपूर रोडवर, बापट नगर चौक, सिव्हिल लाइन्स येथे स्टेट बँक ऑफ इंडियाच्या (SBI) शेजारी स्थित आहे. तुम्ही गुगल मॅप्सवरून थेट रस्ता पाहू शकता.`,
        showDirectionsButton: true,
        source: 'verified-knowledge-base'
      };
    }
    if (lang === 'hi') {
      return {
        answer: `ऑरा द सैलून चंद्रपुर में नागपुर रोड, बापट नगर स्क्वायर, सिविल लाइंस में SBI के ठीक बगल में स्थित है। आप नीचे दिए गए लिंक से गूगल मैप्स पर दिशानिर्देश देख सकते हैं।`,
        showDirectionsButton: true,
        source: 'verified-knowledge-base'
      };
    }
    return {
      answer: `Aura The Salon is located Beside SBI on Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur. You can open direct directions in Google Maps below.`,
      showDirectionsButton: true,
      source: 'verified-knowledge-base'
    };
  }

  // 7. Google Rating / Reviews
  if (
    q.includes("google rating") ||
    q.includes("rating") ||
    q.includes("stars") ||
    q.includes("रेटिंग") ||
    q.includes("रिव्ह्यू")
  ) {
    if (lang === 'mr') {
      return {
        answer: `गूगल मॅप्सवर ऑरा द सलूनचे व्हेरिफाईड रेटिंग 4.7/5 आहे (Place ID: ChIJfZdksm_X0jsRkwFrmIZg), जे थेट लिस्टिंगनुसार अपडेट होत असते.`,
        showDirectionsButton: true,
        source: 'verified-knowledge-base'
      };
    }
    if (lang === 'hi') {
      return {
        answer: `गूगल मैप्स पर ऑरा द सैलून की वेरिफाइड रेटिंग 4.7/5 है (Place ID: ChIJfZdksm_X0jsRkwFrmIZg), जो लाइव लिस्टिंग अपडेट्स के अनुसार मान्य है।`,
        showDirectionsButton: true,
        source: 'verified-knowledge-base'
      };
    }
    return {
      answer: `Aura The Salon has a verified Google rating of 4.7/5 on Google Maps (Verified Place ID: ChIJfZdksm_X0jsRkwFrmIZg), subject to live listing updates.`,
      showDirectionsButton: true,
      source: 'verified-knowledge-base'
    };
  }

  return null;
}

export function getUnavailableFallback(query: string): AnswerPayload {
  const lang = detectLanguage(query);

  if (lang === 'mr') {
    return {
      answer: `माझ्याकडे सध्या याबद्दल खात्रीशीर माहिती उपलब्ध नाही. अचूक माहितीसाठी कृपया व्हॉट्सॲपवर थेट ऑरा द सलूनशी संपर्क साधा.`,
      showWhatsAppButton: true,
      whatsappMessage: "Hello Aura The Salon, I have an inquiry.",
      source: 'fallback-boundary'
    };
  }

  if (lang === 'hi') {
    return {
      answer: `मेरे पास अभी इस बारे में पुष्टि की गई जानकारी नहीं है। सटीक विवरण के लिए कृपया व्हाट्सएप पर सीधे ऑरा द सैलून से संपर्क करें।`,
      showWhatsAppButton: true,
      whatsappMessage: "Hello Aura The Salon, I have an inquiry.",
      source: 'fallback-boundary'
    };
  }

  return {
    answer: `I don't have confirmed information about that yet. Please contact Aura The Salon directly on WhatsApp for accurate details.`,
    showWhatsAppButton: true,
    whatsappMessage: "Hello Aura The Salon, I have an inquiry.",
    source: 'fallback-boundary'
  };
}
