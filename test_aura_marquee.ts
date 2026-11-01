import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { AURA_16_IMAGE_MANIFEST, getUniqueVerifiedMarqueeImages } from './config/aura-marquee-manifest';

function runMarqueeTests() {
  console.log('====================================================');
  console.log('AURA THE SALON: IMAGE MARQUEE & PHYSICS VERIFICATION');
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

  // 1. Verify 16 Named Image Slots
  assert(AURA_16_IMAGE_MANIFEST.length === 16, 'Exact 16 image slots exist in manifest');

  const expectedSlotIds = [
    'aura-exterior',
    'aura-entrance',
    'aura-reception',
    'aura-main-interior',
    'aura-styling-stations',
    'aura-wash-area',
    'aura-haircut-process',
    'aura-haircut-result',
    'aura-colour-process',
    'aura-colour-result',
    'aura-styling-process',
    'aura-styling-result',
    'aura-treatment',
    'aura-nail-art',
    'aura-staff',
    'aura-beauty-work'
  ];

  expectedSlotIds.forEach((expectedId, idx) => {
    const slot = AURA_16_IMAGE_MANIFEST.find((s) => s.slotId === expectedId);
    assert(Boolean(slot), `Slot ${idx + 1} (${expectedId}) correctly defined`);
  });

  // 2. Verify Deduplication in Unique Verified Images
  const uniqueActiveImages = getUniqueVerifiedMarqueeImages();
  const activeUrls = uniqueActiveImages.map((img) => img.imageUrl);
  const distinctUrls = new Set(activeUrls);
  assert(activeUrls.length === distinctUrls.size, 'All active displayed marquee images are 100% unique with zero duplication in the initial sequence');

  // 3. Inspect Component Code for Exact Physics & Interaction Specs
  const componentPath = path.join(process.cwd(), 'components', 'AuraImageMarquee.tsx');
  const code = fs.readFileSync(componentPath, 'utf8');

  assert(code.includes('AUTO_SCROLL_SPEED = 0.8'), 'Auto-scroll speed is strictly 0.8 pixels per frame');
  assert(code.includes('offsetRef.current -= AUTO_SCROLL_SPEED'), 'Auto-scroll direction is strictly left (decreasing offset)');
  assert(code.includes('requestAnimationFrame'), 'Infinite animation engine uses requestAnimationFrame');
  assert(!code.includes('@keyframes marquee'), 'Does NOT use CSS @keyframes for marquee movement');
  assert(code.includes('[...images, ...images]'), 'Internally duplicates unique manifest once: [...images, ...images]');
  assert(code.includes('halfWidthRef.current = track.scrollWidth / 2'), 'Loop calculation uses halfWidth = track.scrollWidth / 2');
  assert(code.includes('offsetRef.current <= -halfWidth') && code.includes('offsetRef.current += halfWidth'), 'Loop wrap-around on left boundary handled correctly');
  assert(code.includes('offsetRef.current > 0') && code.includes('offsetRef.current -= halfWidth'), 'Loop wrap-around on right boundary handled correctly');

  // 4. Verify Drag Physics & Pointer Event Handlers
  assert(code.includes('handlePointerDown') && code.includes('setPointerCapture'), 'Pointer down captures pointer via setPointerCapture');
  assert(code.includes('velocityRef.current = (dx / dt) * 16'), 'Drag velocity calculated with (dx / dt) * 16 formula');
  assert(code.includes('velocityRef.current *= 0.95'), 'Momentum release uses 0.95 inertial decay multiplier');
  assert(code.includes('cursor-grab') && code.includes('cursor-grabbing'), 'Provides cursor-grab and cursor-grabbing styling');
  assert(code.includes('ResizeObserver'), 'Tracks dynamic track width changes using ResizeObserver');
  assert(code.includes('prefers-reduced-motion'), 'Respects user accessibility preference for reduced motion');

  // 5. Verify Curved SVG Mask Paths & Section Typography
  assert(code.includes('A closer look at') && code.includes('Aura.'), 'Section title is "A closer look at Aura."');
  assert(code.includes('Beauty in every detail. Discover the people, spaces and work behind Aura The Salon.'), 'Section subtitle matches requirement');
  assert(code.includes('M0 0H1440V50C1440 50 1200 100 720 100C240 100 0 50 0 50V0Z'), 'Top mask matches exact parabolic curve SVG path');
  assert(code.includes('M0 100H1440V50C1440 50 1200 0 720 0C240 0 0 50 0 50V100Z'), 'Bottom mask matches exact inverted curve SVG path');
  assert(code.includes('h-[80px] md:h-[100px]'), 'Curved masks responsive heights: 80px mobile, 100px desktop');
  assert(code.includes('w-[240px] h-[320px] md:w-[320px] md:h-[512px]'), 'Image dimensions: 240x320 mobile, 320x512 desktop');
  assert(code.includes('rounded-[16px]'), 'Border radius is 16px');
  assert(code.includes('gap-[12px] md:gap-[16px]'), 'Marquee gaps: 12px mobile, 16px desktop');

  // 6. Verify Hero Image Hash Lock
  const heroImgPath = path.join(process.cwd(), 'src', 'assets', 'images', 'regenerated_image_1785000416312.png');
  const heroBuffer = fs.readFileSync(heroImgPath);
  const heroHash = crypto.createHash('sha256').update(heroBuffer).digest('hex');
  const EXPECTED_HERO_HASH = 'd9490f02112532827e63fb310cdbcab31a0d8d76115db946129e77088e04d3b7';
  assert(heroHash === EXPECTED_HERO_HASH, 'Hero Image SHA-256 hash strictly preserved with zero modification');

  console.log(`\nResults: ${passed} / ${total} tests passed.`);
  if (passed === total) {
    console.log('ALL AURA IMAGE MARQUEE & PHYSICS VERIFICATION TESTS PASSED!\n');
  } else {
    process.exit(1);
  }
}

runMarqueeTests();
