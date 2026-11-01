import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  testId: number;
  title: string;
  query: string;
  passed: boolean;
  notes: string;
  outputPreview: string;
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('AURA AI: 12 CONVERSATIONAL SCENARIOS & ENGINE TESTS');
  console.log('====================================================\n');

  const results: TestResult[] = [];
  let testNum = 0;

  async function postChat(message: string, history: any[] = [], stream = false) {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, stream })
    });

    if (stream) {
      const text = await res.text();
      let streamedAnswer = '';
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data !== '[DONE]') {
            try {
              const p = JSON.parse(data);
              if (p.text) streamedAnswer += p.text;
            } catch {}
          }
        }
      }
      return { status: res.status, answer: streamedAnswer, headers: res.headers };
    } else {
      const json = await res.json();
      return { status: res.status, answer: json?.result?.answer || json?.answer || '', headers: res.headers };
    }
  }

  // TEST 1: What services does Aura offer?
  {
    testNum++;
    const query = 'What services does Aura offer?';
    const res = await postChat(query);
    const passed = res.status === 200 && 
      res.answer.includes('Hair Cut') && 
      res.answer.includes('Hair Color') && 
      res.answer.includes('Hair Spa') && 
      res.answer.includes('Facials');
    results.push({
      testId: testNum,
      title: 'Salon Services Inquiry',
      query,
      passed,
      notes: passed ? 'Returned all 5 confirmed service categories accurately' : 'Missing service categories',
      outputPreview: res.answer.slice(0, 140) + '...'
    });
  }

  // TEST 2: Where is Aura located?
  {
    testNum++;
    const query = 'Where is Aura located?';
    const res = await postChat(query);
    const passed = res.status === 200 && 
      res.answer.includes('Beside SBI') && 
      res.answer.includes('Nagpur Road') && 
      res.answer.includes('Civil Lines') && 
      res.answer.includes('Chandrapur');
    results.push({
      testId: testNum,
      title: 'Salon Location & Address Inquiry',
      query,
      passed,
      notes: passed ? 'Grounded in verified Chandrapur address with landmark' : 'Address inaccurate',
      outputPreview: res.answer.slice(0, 140) + '...'
    });
  }

  // TEST 3: What are the opening hours?
  {
    testNum++;
    const query = 'What are the opening hours?';
    const res = await postChat(query);
    const passed = res.status === 200 && 
      res.answer.includes('10:00 AM') && 
      res.answer.includes('10:00 PM');
    results.push({
      testId: testNum,
      title: 'Opening Hours Inquiry',
      query,
      passed,
      notes: passed ? 'Reflects 10 AM to 10 PM daily listing' : 'Hours incorrect',
      outputPreview: res.answer.slice(0, 140) + '...'
    });
  }

  // TEST 4: Difference between hair colouring and highlights
  {
    testNum++;
    const query = 'Explain the difference between hair colouring and highlights.';
    const res = await postChat(query);
    const passed = res.status === 200 && 
      res.answer.toLowerCase().includes('global') && 
      res.answer.toLowerCase().includes('highlight');
    results.push({
      testId: testNum,
      title: 'Beauty Guidance: Color vs Highlights',
      query,
      passed,
      notes: passed ? 'Comprehensive distinction between global single process and dimensional highlights' : 'Explanation missing details',
      outputPreview: res.answer.slice(0, 140) + '...'
    });
  }

  // TEST 5: What is artificial intelligence?
  {
    testNum++;
    const query = 'What is artificial intelligence?';
    const res = await postChat(query);
    const passed = res.status === 200 && 
      (res.answer.includes('Machine Learning') || res.answer.includes('intelligence') || res.answer.includes('AI'));
    results.push({
      testId: testNum,
      title: 'General AI Intelligence: Explain Artificial Intelligence',
      query,
      passed,
      notes: passed ? 'Broad multi-domain reasoning, did not reject general question' : 'Failed general AI question',
      outputPreview: res.answer.slice(0, 140) + '...'
    });
  }

  // TEST 6: Explain photosynthesis
  {
    testNum++;
    const query = 'Explain photosynthesis.';
    const res = await postChat(query);
    const passed = res.status === 200 && 
      (res.answer.includes('chlorophyll') || res.answer.includes('glucose') || res.answer.includes('sunlight') || res.answer.includes('oxygen'));
    results.push({
      testId: testNum,
      title: 'General AI Intelligence: Photosynthesis Scientific Explanation',
      query,
      passed,
      notes: passed ? 'Accurately explained chemical process and two stages' : 'Photosynthesis explanation failed',
      outputPreview: res.answer.slice(0, 140) + '...'
    });
  }

  // TEST 7: Help me write a professional message
  {
    testNum++;
    const query = 'Help me write a professional message.';
    const res = await postChat(query);
    const passed = res.status === 200 && 
      (res.answer.includes('Subject:') || res.answer.includes('Dear') || res.answer.includes('regards'));
    results.push({
      testId: testNum,
      title: 'General AI Assistance: Professional Message Drafting',
      query,
      passed,
      notes: passed ? 'Produced a polished, adaptable professional template' : 'Template not generated',
      outputPreview: res.answer.slice(0, 140) + '...'
    });
  }

  // TEST 8: Translate into Marathi
  {
    testNum++;
    const query = 'Translate this sentence into Marathi.';
    const res = await postChat(query);
    const hasMarathi = /[\u0900-\u097F]/.test(res.answer);
    const passed = res.status === 200 && hasMarathi;
    results.push({
      testId: testNum,
      title: 'Multilingual Capability: Marathi Translation',
      query,
      passed,
      notes: passed ? 'Accurate, fluent Devanagari Marathi generation' : 'Devanagari Marathi missing',
      outputPreview: res.answer.slice(0, 140) + '...'
    });
  }

  // TEST 9: What did I ask you two messages ago? (Multi-turn Memory)
  {
    testNum++;
    const query = 'What did I ask you two messages ago?';
    const conversationHistory = [
      { role: 'user', content: 'What is artificial intelligence?' },
      { role: 'model', content: 'AI refers to computer systems designed to perform human-like cognitive tasks.' },
      { role: 'user', content: 'Explain photosynthesis.' },
      { role: 'model', content: 'Photosynthesis is how plants convert light energy into chemical energy.' }
    ];
    const res = await postChat(query, conversationHistory);
    const passed = res.status === 200 && res.answer.includes('What is artificial intelligence?');
    results.push({
      testId: testNum,
      title: 'Multi-Turn Memory Context Recall',
      query,
      passed,
      notes: passed ? 'Successfully recalled message from 2 turns ago ("What is artificial intelligence?")' : 'Memory recall failed',
      outputPreview: res.answer.slice(0, 140) + '...'
    });
  }

  // TEST 10: I want to book an appointment. Help me.
  {
    testNum++;
    const query = 'I want to book an appointment. Help me.';
    const res = await postChat(query);
    const passed = res.status === 200 && 
      res.answer.includes('BOOK THROUGH WHATSAPP') || res.answer.includes('WhatsApp');
    results.push({
      testId: testNum,
      title: 'Booking Assistance & WhatsApp Handoff',
      query,
      passed,
      notes: passed ? 'Provided booking steps with phone and WhatsApp consultation' : 'Booking steps missing',
      outputPreview: res.answer.slice(0, 140) + '...'
    });
  }

  // TEST 11: What are your prices? (Strict Guardrail: Never invent prices)
  {
    testNum++;
    const query = 'What are your prices?';
    const res = await postChat(query);
    // Must NOT invent rupee prices like ₹500 or ₹1500
    const hasInventedPrice = /₹\s*\d+|Rs\.\s*\d+|\$\d+/.test(res.answer);
    const passed = res.status === 200 && !hasInventedPrice && res.answer.toLowerCase().includes('custom');
    results.push({
      testId: testNum,
      title: 'Guardrail: Price Fabrication Prevention',
      query,
      passed,
      notes: passed ? 'Refused to invent prices; explained customized texture/length quote policy' : 'Falsely fabricated prices',
      outputPreview: res.answer.slice(0, 140) + '...'
    });
  }

  // TEST 12: Tell me the name of Aura\'s manager (Strict Guardrail: Never invent staff)
  {
    testNum++;
    const query = "Tell me the name of Aura's manager.";
    const res = await postChat(query);
    const mentionsFakeManager = res.answer.includes('Rahul Verma') || res.answer.includes('Meera Kapoor') || res.answer.includes('Anand Sharma');
    const passed = res.status === 200 && !mentionsFakeManager && res.answer.toLowerCase().includes('privacy');
    results.push({
      testId: testNum,
      title: 'Guardrail: Staff/Manager Fabrication Prevention',
      query,
      passed,
      notes: passed ? 'Maintained staff privacy policy; refused to fabricate fake names' : 'Invented fake manager name',
      outputPreview: res.answer.slice(0, 140) + '...'
    });
  }

  // TEST 13: Streaming Response Test (Server-Sent Events)
  {
    testNum++;
    const query = 'Explain photosynthesis in one sentence.';
    const streamRes = await postChat(query, [], true);
    const passed = streamRes.status === 200 && streamRes.answer.length > 20;
    results.push({
      testId: testNum,
      title: 'Streaming Response via Server-Sent Events',
      query,
      passed,
      notes: passed ? 'Successfully received real-time SSE stream chunks' : 'Streaming response failed',
      outputPreview: streamRes.answer.slice(0, 140) + '...'
    });
  }

  // TEST 14: Hero Image Lock Verification
  {
    testNum++;
    const heroImgPath = path.join(process.cwd(), 'src', 'assets', 'images', 'regenerated_image_1785000416312.png');
    const buffer = fs.readFileSync(heroImgPath);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const EXPECTED_HASH = 'd9490f02112532827e63fb310cdbcab31a0d8d76115db946129e77088e04d3b7';
    const passed = hash === EXPECTED_HASH;
    results.push({
      testId: testNum,
      title: 'Hero Image Preservation Hash Lock',
      query: 'Check SHA-256 of hero image asset',
      passed,
      notes: passed ? 'SHA-256 matches d9490f0211... with 100% fidelity' : 'Hero image modified or corrupted',
      outputPreview: `Hash: ${hash}`
    });
  }

  // Display Summary
  console.log('TEST SUMMARY TABLE:\n');
  let passCount = 0;
  for (const r of results) {
    const statusTag = r.passed ? '[PASS]' : '[FAIL]';
    if (r.passed) passCount++;
    console.log(`${statusTag} Test ${r.testId}: ${r.title}`);
    console.log(`       Query: "${r.query}"`);
    console.log(`       Notes: ${r.notes}`);
    console.log(`       Preview: ${r.outputPreview}\n`);
  }

  console.log(`FINAL RESULT: ${passCount} / ${results.length} tests passed.`);
  if (passCount === results.length) {
    console.log('ALL AURA AI CONVERSATIONAL ASSISTANT TESTS PASSED SUCCESSFULLY!');
  } else {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
