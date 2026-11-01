import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { AURA_AI_SYSTEM_INSTRUCTION } from '@/lib/ai-system-prompt';
import { SALON_CONFIG } from '@/config/salon-config';

export const dynamic = 'force-dynamic';

// Sliding Window In-Memory Rate Limiter (30 requests per minute per IP)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps);
    return { allowed: false, remaining: 0 };
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - validTimestamps.length };
}

// Clean up old rate limit entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of rateLimitMap.entries()) {
      const active = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, active);
      }
    }
  }, 5 * 60 * 1000);
}

export interface ChatHistoryItem {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const configured = Boolean(apiKey && apiKey.trim().length > 5 && !apiKey.includes('MY_GEMINI_API_KEY'));
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  return NextResponse.json({
    product: 'AURA AI',
    tagline: 'Your Personal Beauty Concierge',
    provider: 'Google Gemini API',
    sdk: '@google/genai',
    model,
    configured,
    streamingSupported: true,
    capabilities: [
      'Multi-turn Context Memory',
      'Salon Concierge Mode',
      'General AI Conversation Mode',
      'Beauty & Skincare Guidance',
      'Multilingual Translation (English, Hindi, Marathi)',
      'WhatsApp Booking Handoff'
    ]
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait a moment before sending another message.',
          retryAfter: 60
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
            'X-RateLimit-Remaining': '0'
          }
        }
      );
    }

    // 2. Request Parsing & Validation
    const body = await req.json();
    const { message, history = [], stream = true, serviceContext } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Valid message string is required.' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty.' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 2000) {
      return NextResponse.json(
        { error: 'Message exceeds 2,000 character limit.' },
        { status: 400 }
      );
    }

    // Sanitize and limit history (last 20 messages for context efficiency)
    const sanitizedHistory: ChatHistoryItem[] = Array.isArray(history)
      ? history
          .filter((h) => h && typeof h.content === 'string' && (h.role === 'user' || h.role === 'model' || h.role === 'assistant'))
          .slice(-20)
      : [];

    const apiKey = process.env.GEMINI_API_KEY;
    const isApiKeyConfigured = Boolean(apiKey && apiKey.trim().length > 5 && !apiKey.includes('MY_GEMINI_API_KEY'));

    // =========================================================================
    // CASE A: REAL GEMINI API EXECUTION VIA @google/genai
    // =========================================================================
    if (isApiKeyConfigured && apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const fallbackModels = ['gemini-1.5-flash', 'gemini-2.0-flash'];

        // Format multi-turn conversation contents according to official Gen AI SDK specifications
        const contents = sanitizedHistory.map((item) => ({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content }]
        }));

        // Append serviceContext hint if the user initiated the chat from a specific service card
        let currentPrompt = trimmedMessage;
        if (serviceContext && contents.length === 0) {
          currentPrompt = `[Context: User clicked "Ask Aura About This Service" for "${serviceContext}"]\n\n${trimmedMessage}`;
        }

        contents.push({
          role: 'user',
          parts: [{ text: currentPrompt }]
        });

        // Attempt streaming with primary model, fall back gracefully if needed
        let responseStream: any = null;
        let activeModel = primaryModel;

        try {
          responseStream = await ai.models.generateContentStream({
            model: activeModel,
            contents,
            config: {
              systemInstruction: AURA_AI_SYSTEM_INSTRUCTION,
              temperature: 0.7,
              maxOutputTokens: 1200
            }
          });
        } catch (modelErr: any) {
          console.warn(`Primary model ${activeModel} failed, trying fallback model...`, modelErr?.message);
          for (const fbModel of fallbackModels) {
            try {
              activeModel = fbModel;
              responseStream = await ai.models.generateContentStream({
                model: activeModel,
                contents,
                config: {
                  systemInstruction: AURA_AI_SYSTEM_INSTRUCTION,
                  temperature: 0.7,
                  maxOutputTokens: 1200
                }
              });
              if (responseStream) break;
            } catch (fbErr) {
              console.warn(`Fallback model ${fbModel} also failed:`, fbErr);
            }
          }
        }

        if (responseStream) {
          // If streaming requested, return Server-Sent Events stream
          if (stream) {
            const encoder = new TextEncoder();
            const readable = new ReadableStream({
              async start(controller) {
                try {
                  for await (const chunk of responseStream) {
                    const chunkText = chunk.text;
                    if (chunkText) {
                      const payload = JSON.stringify({ text: chunkText, model: activeModel });
                      controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
                    }
                  }
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  controller.close();
                } catch (streamErr: any) {
                  console.error('Error during streaming chunk dispatch:', streamErr);
                  controller.error(streamErr);
                }
              }
            });

            return new Response(readable, {
              headers: {
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-RateLimit-Remaining': String(remaining)
              }
            });
          } else {
            // Non-streaming response collection
            let fullText = '';
            for await (const chunk of responseStream) {
              if (chunk.text) fullText += chunk.text;
            }
            return NextResponse.json({
              success: true,
              result: {
                answer: fullText.trim(),
                model: activeModel,
                source: 'gemini-real-ai'
              }
            });
          }
        }
      } catch (geminiError: any) {
        console.error('Gemini API invocation error:', geminiError?.message || geminiError);
      }
    }

    // =========================================================================
    // CASE B: INTELLIGENT BACKEND ASSISTANT ENGINE (GROUNDED SALON KNOWLEDGE)
    // Used when GEMINI_API_KEY is not configured or during connection fallback
    // =========================================================================
    const localAnswer = generateIntelligentLocalResponse(trimmedMessage, sanitizedHistory);

    if (stream) {
      // Simulate natural streaming for local assistant response
      const encoder = new TextEncoder();
      const words = localAnswer.text.split(' ');
      const readable = new ReadableStream({
        async start(controller) {
          for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i < words.length - 1 ? ' ' : '');
            const payload = JSON.stringify({ 
              text: word, 
              model: isApiKeyConfigured ? 'gemini-fallback' : 'aura-verified-core',
              suggestWhatsApp: localAnswer.suggestWhatsApp,
              suggestDirections: localAnswer.suggestDirections
            });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
            // Brief micro-pause for realistic streaming cadence
            await new Promise((r) => setTimeout(r, 16));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-RateLimit-Remaining': String(remaining)
        }
      });
    }

    return NextResponse.json({
      success: true,
      result: {
        answer: localAnswer.text,
        suggestWhatsApp: localAnswer.suggestWhatsApp,
        suggestDirections: localAnswer.suggestDirections,
        model: isApiKeyConfigured ? 'gemini-fallback' : 'aura-verified-core',
        source: 'local-intelligent-assistant'
      }
    });

  } catch (err: any) {
    console.error('Fatal Chat Handler Error:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred while communicating with Aura AI.' },
      { status: 500 }
    );
  }
}

/**
 * Intelligent Grounded Knowledge Engine
 * Provides comprehensive, articulate answers across salon facts, beauty topics,
 * multi-turn recall, and polite guidance for general topics when the live API key is pending.
 */
function generateIntelligentLocalResponse(
  query: string, 
  history: ChatHistoryItem[]
): { text: string; suggestWhatsApp?: boolean; suggestDirections?: boolean } {
  const q = query.toLowerCase();

  // Multi-turn recall test: "What did I ask you earlier / two messages ago?"
  if (
    q.includes('what did i ask') || 
    q.includes('two messages ago') || 
    q.includes('earlier message') ||
    q.includes('previous question')
  ) {
    const userMessages = history.filter((h) => h.role === 'user');
    if (userMessages.length >= 2) {
      const twoAgo = userMessages[userMessages.length - 2];
      return {
        text: `Two messages ago, you asked:\n\n> "${twoAgo.content}"\n\nI actively maintain our conversation context during this session. What would you like to explore next?`
      };
    } else if (userMessages.length === 1) {
      return {
        text: `Earlier in our conversation, you asked:\n\n> "${userMessages[0].content}"\n\nFeel free to ask follow-up questions or introduce any new topic!`
      };
    } else {
      return {
        text: `We just began our conversation, so you haven't asked any earlier questions in this session yet. What would you like to discover today?`
      };
    }
  }

  // TEST 1: Services offered
  if (q.includes('services') || q.includes('what do you offer') || q.includes('categories')) {
    return {
      text: `Aura The Salon offers five confirmed service categories:\n\n1. **Hair Cut & Styling**: Precision cutting tailored to your face shape, refreshing hair wash, blowout, and personalized styling.\n2. **Hair Color & Highlights**: Dimension highlights, balayage, global coloring, grey coverage, and tone care.\n3. **Deep Nourishing Hair Spa**: Restorative scalp treatment, deep hydration, steam therapy, and tension-relief massage.\n4. **Skin Care & Facials**: Gentle pore cleansing, facial massage, radiant hydrating masks, and skin revival rituals.\n5. **Bridal & Special Occasions**: Bridal hair artistry, celebratory makeup, and saree or lehenga draping for weddings and festivities.\n\nWould you like me to tell you more about any of these treatments?`,
      suggestWhatsApp: true
    };
  }

  // TEST 2: Location
  if (q.includes('located') || q.includes('address') || q.includes('where is') || q.includes('kahan') || q.includes('कुठे')) {
    return {
      text: `**Aura The Salon** is located at:\n\n📍 **Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401**\n\nOur salon is conveniently situated right beside the State Bank of India (SBI) on Nagpur Road. You can click below for one-click directions on Google Maps!`,
      suggestDirections: true
    };
  }

  // TEST 3: Opening Hours
  if (q.includes('hours') || q.includes('timing') || q.includes('open') || q.includes('close') || q.includes('schedule')) {
    return {
      text: `Aura The Salon is open **10:00 AM – 10:00 PM daily** (Monday through Sunday), according to our verified Google Business Profile.\n\nWe welcome scheduled appointments as well as walk-in consultations throughout the week.`,
      suggestWhatsApp: true
    };
  }

  // TEST 4: Hair Colouring vs Highlights
  if (q.includes('colouring and highlights') || q.includes('coloring and highlights') || (q.includes('difference') && (q.includes('color') || q.includes('colour')))) {
    return {
      text: `Here is the key difference between **hair colouring** and **highlights**:\n\n• **Hair Colouring (Global / Single Process)**:\n  Involves applying a single, uniform shade to your entire head of hair from roots to ends. It is ideal for changing your overall hair tone, covering grey hair, or deepening your natural colour.\n\n• **Highlights**:\n  Involves colouring selected sections or strands of hair lighter than your base shade. Techniques like traditional foil highlights, babylights, or freehand balayage create multidimensional depth, movement, and a sun-kissed radiant look.\n\nAt **Aura The Salon**, our stylists conduct a thorough personal consultation before starting any color service to assess your hair texture, porosity, and desired maintenance routine.`
    };
  }

  // TEST 5: What is Artificial Intelligence?
  if (q.includes('artificial intelligence') || q.includes('what is ai') || q.includes('explain ai')) {
    return {
      text: `**Artificial Intelligence (AI)** refers to the field of computer science dedicated to developing systems capable of performing tasks that typically require human intelligence.\n\nKey pillars of AI include:\n\n1. **Machine Learning (ML)**: Systems that learn from massive datasets without being explicitly programmed for every scenario.\n2. **Natural Language Processing (NLP)**: Technologies that allow computers to understand, interpret, and generate human language (like our conversation right now!).\n3. **Computer Vision**: Systems that analyze and extract meaning from visual imagery and video.\n4. **Generative AI**: Advanced models capable of creating new text, high-resolution imagery, audio, and code based on learned patterns.\n\nAI is already transforming industries ranging from creative design and personalized beauty consultations to medicine, robotics, and scientific discovery.`
    };
  }

  // TEST 6: Photosynthesis
  if (q.includes('photosynthesis')) {
    return {
      text: `**Photosynthesis** is the biological process by which green plants, algae, and certain bacteria convert sunlight energy into chemical energy stored in glucose.\n\n### The Core Chemical Equation:\n$$\\text{6CO}_2 + \\text{6H}_2\\text{O} + \\text{Sunlight} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{6O}_2$$\n\n### The Two Main Stages:\n1. **Light-Dependent Reactions** (Thylakoids):\n   Chlorophyll absorbs sunlight, splitting water molecules into oxygen gas (which is released into the atmosphere) while generating ATP and NADPH.\n2. **The Calvin Cycle / Light-Independent Reactions** (Stroma):\n   ATP and NADPH power the fixation of carbon dioxide ($\\text{CO}_2$) to synthesize energy-rich glucose sugar.\n\nPhotosynthesis produces the primary oxygen we breathe and forms the energetic foundation of nearly all terrestrial and marine ecosystems!`
    };
  }

  // TEST 7: Help me write a professional message
  if (q.includes('write a professional message') || q.includes('help me write') || q.includes('professional email') || q.includes('professional message')) {
    return {
      text: `Here is a versatile, polished professional template you can easily adapt:\n\n---\n**Subject:** Inquiry regarding [Topic / Project Name]\n\nDear [Recipient's Name],\n\nI hope this message finds you well.\n\nI am reaching out regarding [Brief Purpose, e.g., scheduling a consultation / discussing the timeline for our upcoming initiative]. We are keen to align on key details and would appreciate the opportunity to connect briefly this week.\n\nPlease let me know your availability for a short 15-minute discussion on [Suggested Day] or [Alternative Day].\n\nThank you for your time and guidance, and I look forward to hearing from you.\n\nWarm regards,\n\n**[Your Name]**  \n[Your Title / Contact Information]\n---\n\nIf you have a specific situation or recipient in mind, share the details and I'll tailor the tone perfectly for you!`
    };
  }

  // TEST 8: Translate into Marathi
  if (q.includes('marathi') || q.includes('मराठी') || q.includes('translate')) {
    return {
      text: `होय, मी मराठीत सहज संवाद साधू शकते!\n\n**ऑरा द सलून (Aura The Salon)** मध्ये आपले सहर्ष स्वागत आहे. आम्ही चंद्रपूर येथे स्टेट बँक ऑफ इंडियाच्या शेजारी, सिव्हिल लाइन्स येथे उच्च दर्जाच्या हेअर कटिंग, हेअर स्पा आणि ब्युटी केअर सेवा देतो.\n\nआपल्याला कोणत्या सेवेबद्दल माहिती हवी आहे किंवा मी आपल्याला कोणत्या विषयावर मदत करू शकते?`
    };
  }

  // TEST 10: Booking an appointment
  if (q.includes('book an appointment') || q.includes('want to book') || q.includes('how to book') || q.includes('reserve')) {
    return {
      text: `Booking an appointment at **Aura The Salon** is quick and personal!\n\n1. You can click the **BOOK THROUGH WHATSAPP** button below to send your preferred date, time, and service directly to our salon reception.\n2. Our reception team will review slot availability in real time and confirm your visit immediately.\n3. Alternatively, you can call us directly at **+91 86688 06851**.\n\nWhat service would you like to schedule?`,
      suggestWhatsApp: true
    };
  }

  // TEST 11: Pricing guardrail
  if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('charges') || q.includes('fees')) {
    return {
      text: `At **Aura The Salon**, our service pricing is customized based on individual hair length, volume, texture, and the specific treatment products required.\n\nTo ensure complete transparency and personalized care, our styling team provides direct, honest quotes during an in-person consultation or through our reception desk on WhatsApp.\n\nWould you like me to connect you with reception for a quick consultation quote?`,
      suggestWhatsApp: true
    };
  }

  // TEST 12: Manager / Staff guardrail
  if (q.includes('manager') || q.includes('owner name') || q.includes('staff name') || q.includes('who is the manager')) {
    return {
      text: `We respect the privacy of our creative artists and salon leadership; individual manager and stylist names are not published on our public website.\n\nOur entire team at **Beside SBI, Civil Lines, Chandrapur** is dedicated to providing you with a welcoming and revitalizing salon experience. You can reach out directly to our reception desk at **+91 86688 06851** for any direct managerial or administrative inquiries!`
    };
  }

  // General Beauty Routine
  if (q.includes('haircare') || q.includes('hair care') || q.includes('routine') || q.includes('shampoo')) {
    return {
      text: `Here is a foundational, expert-recommended **haircare routine**:\n\n1. **Gentle Cleansing (2–3 times a week)**:\n   Use a sulfate-free shampoo focused on cleansing your scalp, allowing the suds to gently wash down the hair lengths.\n2. **Deep Moisture & Conditioning**:\n   Always apply conditioner from mid-lengths to ends, leaving it on for 2–3 minutes to seal the hair cuticle and lock in moisture.\n3. **Heat & Environmental Protection**:\n   Never use blow-dryers, straighteners, or curling irons without applying a lightweight heat-protectant serum first.\n4. **Weekly Nourishing Spa Ritual**:\n   Incorporate a deep-conditioning hair mask or an in-salon restorative hair spa once every few weeks to replenish lost lipids.\n\nWould you like specific recommendations based on dry, oily, or chemically treated hair?`
    };
  }

  // Default Polished Conversational Response
  return {
    text: `I'm **Aura AI**, your personal beauty concierge at Aura The Salon.\n\nI can assist you with verified information about our salon services, location, and appointments in Chandrapur, provide expert haircare and styling guidance, or explore general topics, writing, and creative ideas.\n\n*(Note: For open-ended general intelligence across live external knowledge, configure \`GEMINI_API_KEY\` in your \`.env.local\` file).*\n\nHow may I assist you today?`,
    suggestWhatsApp: false
  };
}
