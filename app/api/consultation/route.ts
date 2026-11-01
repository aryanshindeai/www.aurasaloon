import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { SALON_CONFIG } from '@/config/salon-config';

export const dynamic = 'force-dynamic';

// Rate Limiter: 30 requests per minute per IP
const consultationRateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = consultationRateLimit.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    consultationRateLimit.set(ip, validTimestamps);
    return { allowed: false, remaining: 0 };
  }

  validTimestamps.push(now);
  consultationRateLimit.set(ip, validTimestamps);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - validTimestamps.length };
}

// Periodic cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of consultationRateLimit.entries()) {
      const active = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) {
        consultationRateLimit.delete(ip);
      } else {
        consultationRateLimit.set(ip, active);
      }
    }
  }, 5 * 60 * 1000);
}

export interface ConsultationPreferences {
  styleGoal?: string;
  changeLevel?: string;
  maintenance?: string;
  occasion?: string;
}

export interface ConsultationTurn {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

const CONSULTATION_SYSTEM_PROMPT = `You are "Aura AI", the personal beauty concierge and senior styling consultant for Aura The Salon in Chandrapur, Maharashtra.
Your tagline is "Your Personal Beauty Concierge".

You are conducting a personalized, thoughtful, and luxurious interactive beauty consultation.
Your mission is to help visitors discover what haircut, color, treatment, or beauty routine best complements their features, routine, and lifestyle.

SALON IDENTITY & CONTEXT:
- Salon Name: ${SALON_CONFIG.brand.name}
- Tagline: "Feel Good. Look Your Best."
- Location: Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401.
- Phone / WhatsApp: +91 86688 06851
- Hours: 10:00 AM – 10:00 PM Daily

CONFIRMED SALON SERVICES:
1. Hair Cut & Styling (Precision haircut tailored to face shape, hair wash, blowout, styling)
2. Hair Color & Highlights (Global hair color, root touch-ups, grey coverage, dimension highlights, balayage)
3. Deep Nourishing Hair Spa (Hydrating scalp therapy, deep conditioning, restorative care)
4. Skin Care & Facials (Gentle cleansing, facial massage, hydrating masks, radiance therapy)
5. Bridal & Special Occasion Styling (Bridal hair artistry, occasion makeup, saree & lehenga draping)

STRICT ACCURACY & PROFESSIONAL BOUNDARIES:
- NEVER invent prices or discounts. Explain that pricing depends on individual hair length, texture, and consultation, and the salon team provides clear quotes in person or on WhatsApp.
- NEVER invent fictional staff names or false claims.
- Do NOT provide medical diagnosis for scalp or skin ailments (e.g. alopecia, psoriasis, severe dermatitis). Always recommend seeing a dermatologist for medical concerns.
- If an uploaded photo is provided, examine the visible hairstyle, tone, texture, cut, and volume thoughtfully, explaining how the style could be adapted for the client's hair type and face shape.
- If asked about an unconfirmed service (e.g., permanent tattoo, cosmetic surgery, acrylic extensions if unverified), politely explain that it is not in the confirmed salon catalog and offer confirmed hair and beauty care instead.

TONE & STYLE:
- Warm, welcoming, discerning, encouraging, knowledgeable, and elegant.
- Structure your consultation recommendations with clear, inviting sections:
  1. ✨ **Style Direction & Concept**
  2. 🌿 **Why This Works For You** (face framing, lifestyle alignment, texture)
  3. ⏱️ **Maintenance & Home Care Reality**
  4. ✂️ **Recommended Aura Salon Service**
  5. 💬 **What to Discuss with Your Stylist**
`;

// Grounded fallback response generator when LLM API is unavailable
function generateGroundedConsultation(
  interests: string[],
  preferences: ConsultationPreferences,
  message?: string
): string {
  const chosenInterests = interests.length > 0 ? interests.join(' & ') : 'Hair Cut & Styling';
  const changeLevel = preferences.changeLevel || 'Soft Enhancement';
  const maintenance = preferences.maintenance || 'Low maintenance (effortless at-home care)';
  const occasion = preferences.occasion || 'Everyday lifestyle';
  const goal = preferences.styleGoal || 'A fresh, flattering look tailored to my routine';

  if (message && message.toLowerCase().includes('price')) {
    return `### Price & Estimation Guidelines at Aura The Salon\n\nAt Aura The Salon in Chandrapur, our service prices are customized based on individual hair length, density, texture, and specific treatment requirements.\n\n* **Transparent Consultation:** Before beginning any cut, color, or spa ritual, our stylists provide a clear, upfront quote after inspecting your hair in person.\n* **Direct Inquiries:** For a quick estimate, feel free to send a photo and your hair length to our team on WhatsApp (+91 86688 06851).\n\nWould you like to explore style suggestions or view our confirmed service catalog?`;
  }

  return `### ✨ Personalized Style Recommendation for ${chosenInterests}

Thank you for sharing your preferences with Aura AI! Based on your goal (**"${goal}"**) with a preference for **${changeLevel}** and **${maintenance}** for **${occasion}**, here is our tailored consultation roadmap:

#### 1. ✨ Recommended Style Direction
* **Shape & Movement:** A face-framing, soft-layered cut that adds natural movement without requiring hours of daily hot-tool styling.
* **Texture Harmony:** We recommend accentuating your natural hair flow with soft point-cutting at the ends to prevent heaviness while keeping the silhouette effortlessly polished.
${interests.some(i => i.toLowerCase().includes('colour') || i.toLowerCase().includes('color')) ? '* **Dimensional Tones:** Since you prefer ' + changeLevel + ', soft multi-tonal balayage or delicate babylights around the crown will illuminate your features without harsh root regrowth lines.' : ''}

#### 2. 🌿 Why This Works For Your Routine
* Designed specifically around your preference for **${maintenance}**. You can let it air-dry with light serum for a relaxed everyday feel, or blow-dry smoothly in minutes for ${occasion}.
* Keeps the perimeter healthy and thick while removing excess bulk through interior layering.

#### 3. ⏱️ Maintenance & Home Care Reality
* **Salon Visits:** Refresh layers and ends every 8 to 10 weeks to prevent split ends and maintain structure.
* **At-Home Care:** Use a sulfate-free hydrating shampoo, lightweight conditioner, and a thermal protectant serum before heat styling.

#### 4. ✂️ Confirmed Aura Salon Service
* **Primary Recommendation:** *${interests[0] || 'Precision Hair Cut & Tailored Blowout'}*
* **Complementary Care:** *Deep Nourishing Hair Spa* to infuse lasting moisture and mirror-like shine into the lengths.

#### 5. 💬 What to Discuss With Your Stylist at Aura
* Bring your inspiration notes to your appointment.
* Ask the stylist to analyze your natural crown growth direction and face shape before trimming.
* Request a brief walkthrough on how to replicate the blowout at home with minimal effort.

*Would you like to refine this direction, discuss color undertones, or proceed to your consultation summary?*`;
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const configured = Boolean(apiKey && apiKey.trim().length > 5 && !apiKey.includes('MY_GEMINI_API_KEY'));

  return NextResponse.json({
    feature: 'AURA AI Consultation',
    version: '2.0.0',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    configured,
    maxUploadSizeMb: 5,
    supportedCategories: [
      'Haircut & styling',
      'Hair colour',
      'Hair treatment',
      'Beauty services',
      'Nail services',
      'Other enquiries'
    ],
    privacyPolicy: 'Uploaded inspiration photos are processed in memory and never persisted on disk.'
  });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit reached. Please wait a moment before sending another consultation request.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await req.json();
    const {
      interests = [],
      preferences = {},
      history = [],
      message = '',
      uploadedImage = null,
      mode = 'consult',
      stream = true
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    const isApiKeyValid = Boolean(apiKey && apiKey.trim().length > 5 && !apiKey.includes('MY_GEMINI_API_KEY'));

    // Construct Contextual Prompt
    const interestsStr = Array.isArray(interests) && interests.length > 0 ? interests.join(', ') : 'Hair Cut & Styling';
    const prefsStr = `Interests: ${interestsStr}\nGoal: ${preferences.styleGoal || 'Not specified'}\nChange level: ${preferences.changeLevel || 'Soft Enhancement'}\nMaintenance commitment: ${preferences.maintenance || 'Moderate'}\nOccasion: ${preferences.occasion || 'Everyday lifestyle'}`;

    const userMessageContent = message
      ? `User question / follow-up: "${message}"\n\nClient Profile:\n${prefsStr}`
      : `Client has submitted their beauty consultation profile:\n${prefsStr}\n\nPlease provide a comprehensive, tailored, and luxurious style recommendation for them following the 5-step consultation framework.`;

    // Fallback if API key is not configured or in testing environment
    if (!isApiKeyValid) {
      const fallbackResponse = generateGroundedConsultation(interests, preferences, message);
      
      if (stream) {
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
          async start(controller) {
            const chunks = fallbackResponse.split(/(?<=\n\n|\.\s+)/);
            for (const chunk of chunks) {
              controller.enqueue(encoder.encode(chunk));
              await new Promise((r) => setTimeout(r, 25));
            }
            controller.close();
          }
        });

        return new Response(readableStream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'X-Aura-Model': 'Aura Grounded Engine'
          }
        });
      }

      return NextResponse.json({
        content: fallbackResponse,
        model: 'Aura Grounded Engine',
        mode
      });
    }

    // Call Official Google GenAI SDK
    const ai = new GoogleGenAI({ apiKey });
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    // Build chat contents from history
    const contents: any[] = [];

    // Prior conversation turns
    for (const item of history) {
      const role = item.role === 'model' || item.role === 'assistant' ? 'model' : 'user';
      contents.push({
        role,
        parts: [{ text: item.content }]
      });
    }

    // Current turn parts
    const currentParts: any[] = [{ text: userMessageContent }];

    // If an inspiration photo was uploaded, attach it as an inline part
    if (uploadedImage && typeof uploadedImage === 'string' && uploadedImage.startsWith('data:image/')) {
      const [header, base64Data] = uploadedImage.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
      if (base64Data) {
        currentParts.unshift({
          inlineData: {
            mimeType,
            data: base64Data
          }
        });
      }
    }

    contents.push({
      role: 'user',
      parts: currentParts
    });

    if (stream) {
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents,
        config: {
          systemInstruction: CONSULTATION_SYSTEM_PROMPT,
          temperature: 0.7,
          maxOutputTokens: 1200
        }
      });

      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of responseStream) {
              const text = chunk.text;
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
          } catch (err) {
            console.error('Error during consultation streaming:', err);
            controller.enqueue(encoder.encode('\n\n*(Aura AI consultation stream completed)*'));
          } finally {
            controller.close();
          }
        }
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'X-Aura-Model': modelName
        }
      });
    } else {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: CONSULTATION_SYSTEM_PROMPT,
          temperature: 0.7,
          maxOutputTokens: 1200
        }
      });

      return NextResponse.json({
        content: response.text || '',
        model: modelName,
        mode
      });
    }
  } catch (error: any) {
    console.error('Aura Consultation API Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'An error occurred during the beauty consultation.',
        fallback: generateGroundedConsultation([], {})
      },
      { status: 500 }
    );
  }
}
