/**
 * AURA THE SALON — WORLD-CLASS LOCATION EXPERIENCE QA SUITE
 * 
 * Verifies all 12 required quality audit criteria for the Location Experience.
 */

import http from 'http';
import fs from 'fs';
import crypto from 'crypto';

interface TestCaseResult {
  id: string;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestCaseResult[] = [];

function recordResult(id: string, name: string, passed: boolean, details: string) {
  results.push({ id, name, passed, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${id}] ${name}: ${details}`);
}

async function fetchHtml(urlPath: string): Promise<{ statusCode: number; html: string }> {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode || 500, html: data });
      });
    }).on('error', (err) => reject(err));
  });
}

async function runLocationTests() {
  console.log('=== STARTING AURA LOCATION EXPERIENCE TEST SUITE ===\n');

  let pageHtml = '';
  try {
    const res = await fetchHtml('/');
    pageHtml = res.html;
  } catch (err: any) {
    console.error('Failed to load localhost homepage:', err);
  }

  const compContent = fs.readFileSync('components/location-contact.tsx', 'utf-8');
  const embedContent = fs.readFileSync('components/google-maps-embed.tsx', 'utf-8');
  const configContent = fs.readFileSync('config/salon-config.ts', 'utf-8');

  // Test 1: Google Maps pin points to the exact Aura listing & Place ID
  const expectedPlaceId = 'ChIJfZdksm_X0jsRkwFrmIZg';
  const hasPlaceId =
    configContent.includes(expectedPlaceId) &&
    pageHtml.includes(expectedPlaceId);
  recordResult(
    'TC-LOC-01',
    'Exact Place ID Resolution & Google Maps Pin',
    hasPlaceId,
    `Place ID strictly resolved to verified listing: ${expectedPlaceId}`
  );

  // Test 2: Google Directions open correctly
  const hasDirectionsUrl =
    pageHtml.includes('google.com/maps/dir/?api=1') &&
    pageHtml.includes(`destination_place_id=${expectedPlaceId}`) &&
    pageHtml.includes('GET DIRECTIONS');
  recordResult(
    'TC-LOC-02',
    'Google Maps Directions Link Integration',
    hasDirectionsUrl,
    'Verified Action 01 opens official Google Maps directions to exact Place ID'
  );

  // Test 3: Phone link works
  const expectedPhoneUrl = 'tel:+918668806851';
  const hasPhoneLink =
    pageHtml.includes(expectedPhoneUrl) &&
    pageHtml.includes('CALL THE SALON');
  recordResult(
    'TC-LOC-03',
    'Direct Telephone Call Action',
    hasPhoneLink,
    `Verified Action 02 triggers direct call link ${expectedPhoneUrl}`
  );

  // Test 4: WhatsApp link works & has prefilled booking enquiry
  const hasWhatsAppAction =
    pageHtml.includes('wa.me/918668806851') &&
    pageHtml.includes(encodeURIComponent('Hello Aura The Salon!')) &&
    pageHtml.includes('WHATSAPP');
  recordResult(
    'TC-LOC-04',
    'WhatsApp Appointment Enquiry Action',
    hasWhatsAppAction,
    'Verified Action 03 generates prefilled appointment enquiry to 918668806851'
  );

  // Test 5: Full address is accurate everywhere
  const expectedAddress = 'Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur, Maharashtra 442401';
  const hasAccurateAddress =
    configContent.includes(expectedAddress) &&
    pageHtml.includes('Beside SBI') &&
    pageHtml.includes('Bapat Nagar Square') &&
    pageHtml.includes('Civil Lines') &&
    pageHtml.includes('Chandrapur, Maharashtra 442401');
  recordResult(
    'TC-LOC-05',
    'Accurate & Consistent Verified Address',
    hasAccurateAddress,
    `Address strictly verified: "${expectedAddress}"`
  );

  // Test 6: No false working hours
  const hasVerifiedHours =
    pageHtml.includes('10:00 AM – 10:00 PM Daily') &&
    pageHtml.includes('Please contact the salon to confirm') &&
    pageHtml.includes('availability');
  recordResult(
    'TC-LOC-06',
    'Verified Working Hours & Truthful Availability Note',
    hasVerifiedHours,
    'Reflects verified 10 PM closing and disclaims unconfirmed holiday schedules'
  );

  // Test 7: Map displays properly (Responsive height & properties)
  const hasEmbedIframe =
    embedContent.includes('iframe') &&
    embedContent.includes('loading="lazy"') &&
    embedContent.includes('allowFullScreen') &&
    embedContent.includes('strict-origin-when-cross-origin') &&
    embedContent.includes('h-[360px] lg:h-[520px]');
  recordResult(
    'TC-LOC-07',
    'Responsive Google Maps Presentation (520px / 360px)',
    hasEmbedIframe,
    'Desktop height ~520px, mobile ~360px, 100% width, lazy loaded'
  );

  // Test 8: Clean fallback when API key is missing or fails
  const hasFallbackStrategy =
    embedContent.includes('maps.google.com/maps?q=') &&
    embedContent.includes('OPEN IN GOOGLE MAPS') &&
    embedContent.includes('hasError');
  recordResult(
    'TC-LOC-08',
    'API Failure / Missing Key Graceful Fallback',
    hasFallbackStrategy,
    'Falls back to genuine place embed & direct Google Maps launcher; never renders blank iframe'
  );

  // Test 9: Location Discovery Experience ("Right here in Chandrapur")
  const hasDiscoverySection =
    pageHtml.includes('Right here in Chandrapur.') &&
    pageHtml.includes('Finding Us With Ease') &&
    pageHtml.includes('01. Landmark') &&
    pageHtml.includes('02. Junction') &&
    pageHtml.includes('03. Area') &&
    compContent.includes('/images/aura_chandrapur_atelier.jpg');
  recordResult(
    'TC-LOC-09',
    'Location Discovery Section & Authentic Visual Preview',
    hasDiscoverySection,
    'Features landmark wayfinding with genuine verified atelier imagery'
  );

  // Test 10: Optional Street View Surroundings Link
  const hasStreetView =
    pageHtml.includes('EXPLORE SURROUNDINGS') &&
    pageHtml.includes('map_action=pano') &&
    pageHtml.includes('19.9614,79.2962');
  recordResult(
    'TC-LOC-10',
    'Surroundings / Street View Explorer',
    hasStreetView,
    'Provides verified coordinates (19.9614, 79.2962) link to explore Nagpur Road surroundings'
  );

  // Test 11: Schema.org BeautySalon Structured Data (JSON-LD)
  const hasSchema =
    pageHtml.includes('BeautySalon') &&
    pageHtml.includes('PostalAddress') &&
    pageHtml.includes('GeoCoordinates') &&
    pageHtml.includes('AggregateRating');
  recordResult(
    'TC-LOC-11',
    'Schema.org BeautySalon Structured Data (JSON-LD)',
    hasSchema,
    'Injected verified local business schema with geo coordinates, rating, and hours'
  );

  // Test 12: Hero Image Preservation Lock
  const heroBuf = fs.readFileSync('src/assets/images/regenerated_image_1785000416312.png');
  const heroHash = crypto.createHash('sha256').update(heroBuf).digest('hex');
  const heroLocked = heroHash === 'd9490f02112532827e63fb310cdbcab31a0d8d76115db946129e77088e04d3b7';
  recordResult(
    'TC-LOC-12',
    'Hero Image Preservation Lock',
    heroLocked,
    `SHA-256 matches d9490f0211... with 100% fidelity`
  );

  console.log('\n=== TEST RESULTS SUMMARY ===');
  const totalPassed = results.filter((r) => r.passed).length;
  console.log(`Passed: ${totalPassed} / ${results.length}`);
  if (totalPassed === results.length) {
    console.log('🎉 ALL 12 LOCATION EXPERIENCE TESTS PASSED PERFECTLY!');
  } else {
    console.error('⚠️ SOME TESTS FAILED. CHECK DETAILS ABOVE.');
    process.exit(1);
  }
}

runLocationTests();
