import { 
  WHATSAPP_NUMBER, 
  CALL_NUMBER, 
  CALL_HREF, 
  MAP_URL, 
  createWhatsAppAppointmentUrl, 
  createQuickWhatsAppUrl 
} from './lib/whatsapp';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

function runTests() {
  console.log('====================================================');
  console.log('AURA THE SALON - WHATSAPP BOOKING SYSTEM VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`[PASS] Test ${total}: ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] Test ${total}: ${testName}`);
      if (detail) console.error(`       Detail: ${detail}`);
    }
  }

  // 1. WhatsApp Number & Call Number Accuracy
  assert(WHATSAPP_NUMBER === '918668806851', 'WhatsApp phone number is strictly 918668806851');
  assert(CALL_NUMBER === '+918668806851', 'Direct call phone number is +918668806851');
  assert(CALL_HREF === 'tel:+918668806851', 'Call href is tel:+918668806851');
  assert(MAP_URL.includes('Aura+The+Salon+Chandrapur'), 'Map URL points to Aura The Salon Chandrapur');

  // 2. Standardized Message Structure for Form Submission
  const sampleAppointment = {
    name: 'Ananya Deshmukh',
    service: 'Hair Cut & Styling',
    date: '2026-11-05',
    time: '11:45 AM',
    message: 'Need layers and framing'
  };
  const apptUrl = createWhatsAppAppointmentUrl(sampleAppointment);
  const parsedApptUrl = new URL(apptUrl);
  const textParam = parsedApptUrl.searchParams.get('text') || '';

  assert(apptUrl.startsWith('https://wa.me/918668806851?text='), 'Appointment URL targets correct WhatsApp endpoint');
  assert(textParam.includes('Hello Aura The Salon!'), 'Message includes greeting "Hello Aura The Salon!"');
  assert(textParam.includes('I would like to request an appointment.'), 'Message includes request statement');
  assert(textParam.includes('Name: Ananya Deshmukh'), 'Message correctly contains Customer Name');
  assert(textParam.includes('Service: Hair Cut & Styling'), 'Message correctly contains Selected Service');
  assert(textParam.includes('Preferred date: 2026-11-05'), 'Message correctly contains Preferred Date');
  assert(textParam.includes('Preferred time: 11:45 AM'), 'Message correctly contains Preferred Time');
  assert(textParam.includes('Message: Need layers and framing'), 'Message correctly contains Optional Message');
  assert(textParam.includes('Please confirm the availability and appointment details.'), 'Message includes polite confirmation closing');

  // 3. Quick 1-Click WhatsApp URL (for Buttons across site)
  const quickUrl = createQuickWhatsAppUrl('Skin Care & Facials', 'Inquiring for evening slot');
  const quickText = new URL(quickUrl).searchParams.get('text') || '';
  assert(quickUrl.startsWith('https://wa.me/918668806851?text='), 'Quick 1-Click URL targets correct WhatsApp number');
  assert(quickText.includes('Service: Skin Care & Facials'), 'Quick URL formats service correctly');
  assert(quickText.includes('Message: Inquiring for evening slot'), 'Quick URL includes custom message');

  // 4. Test Service Card Prefilling for all confirmed services
  const confirmedServices = [
    'Hair Cut & Styling',
    'Hair Color & Highlights',
    'Deep Nourishing Hair Spa',
    'Skin Care & Facials',
    'Bridal & Special Occasions'
  ];

  confirmedServices.forEach((s) => {
    const sUrl = createQuickWhatsAppUrl(s);
    const decoded = decodeURIComponent(sUrl);
    assert(decoded.includes(`Service: ${s}`), `Service Card pre-fill works for "${s}"`);
  });

  // 5. Test Chatbot Service Context Passing
  const chatbotHairSpa = createQuickWhatsAppUrl('Hair Spa & Treatments', 'Customer inquired about deep conditioning in chat');
  const chatbotDecoded = decodeURIComponent(chatbotHairSpa);
  assert(chatbotDecoded.includes('Service: Hair Spa & Treatments'), 'Chatbot passes specific service context');
  assert(chatbotDecoded.includes('Customer inquired about deep conditioning in chat'), 'Chatbot includes chat inquiry context');

  // 6. Test Gallery Inquiry Prefilling
  const galleryInquiry = createQuickWhatsAppUrl('Salon Service', 'Inquiring about style/facility from photo: Aura Reception & Lounge');
  const galleryDecoded = decodeURIComponent(galleryInquiry);
  assert(galleryDecoded.includes('Aura Reception & Lounge'), 'Gallery Lightbox inquiry pre-fills photo context');

  // 7. Verify Hero Image Lock Integrity
  const heroImagePath = path.join(process.cwd(), 'src', 'assets', 'images', 'regenerated_image_1785000416312.png');
  const heroBuffer = fs.readFileSync(heroImagePath);
  const hash = crypto.createHash('sha256').update(heroBuffer).digest('hex');
  const EXPECTED_HASH = 'd9490f02112532827e63fb310cdbcab31a0d8d76115db946129e77088e04d3b7';
  assert(hash === EXPECTED_HASH, 'Hero Image SHA-256 hash is 100% strictly preserved');

  console.log(`\nResults: ${passed} / ${total} tests passed.`);
  if (passed === total) {
    console.log('ALL WHATSAPP BOOKING SYSTEM VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
  } else {
    process.exit(1);
  }
}

runTests();
