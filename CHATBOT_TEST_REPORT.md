# Aura Assistant — Chatbot Test Report

**Assistant Name:** Aura Assistant  
**Target:** Aura The Salon, Chandrapur  
**Test Suite:** Grounded Knowledge Base, Multilingual Queries & Boundary Verification  
**Test Date:** November 2026  
**Status:** **17 / 17 TESTS PASSED (100% SUCCESS RATE)**  

---

## 1. Executive Summary

Aura Assistant was evaluated against an exhaustive test matrix covering:
1. **Core Quick Questions (English):** Location, operating hours, booking process, service categories, contact details, directions, and Google rating.
2. **Multilingual Queries:** Natural Hindi (हिंदी) and Marathi (मराठी) phrasing.
3. **Critical Accuracy Guardrails:** Pricing policy enforcement without invented prices or discounts.
4. **Unknown & Prohibited Queries:** Requests for discounts, medical/trichological scalp diagnoses, unconfirmed staff schedules, and non-salon inquiries.

All queries verified that:
* Verified facts are returned instantly with zero hallucinations.
* Unknown or unconfirmed topics trigger the exact mandatory fallback:
  > *"I don't have confirmed information about that yet. Please contact Aura The Salon directly on WhatsApp for accurate details."*
* Every appointment handoff surfaces the verified **"BOOK THROUGH WHATSAPP"** action linking to `https://wa.me/918668806851`.

---

## 2. Test Execution Matrix

| # | Test Category | Input Query | Retrieval Source | Result | Notes |
|---|---|---|---|---|---|
| **01** | Location (EN) | *"Where is Aura The Salon located?"* | `verified-knowledge-base` | **PASS** | Returns verified address Beside SBI, Nagpur Rd, Civil Lines with directions button. |
| **02** | Hours (EN) | *"What are your opening hours?"* | `verified-knowledge-base` | **PASS** | Returns verified 10 AM–10 PM daily schedule according to current listing. |
| **03** | Booking (EN) | *"How can I book an appointment?"* | `verified-knowledge-base` | **PASS** | Prompts WhatsApp booking button + phone `+91 86688 06851`. |
| **04** | Services (EN) | *"What salon service categories are available?"* | `verified-knowledge-base` | **PASS** | Lists the 5 confirmed categories: Hair Cut, Color, Spa, Skin/Facial, Bridal. |
| **05** | Contact (EN) | *"How can I contact the salon?"* | `verified-knowledge-base` | **PASS** | Displays phone, WhatsApp, and physical location. |
| **06** | Directions (EN) | *"Can I get directions?"* | `verified-knowledge-base` | **PASS** | Opens direct Google Maps directions URL with verified Place ID. |
| **07** | Rating (EN) | *"What is your Google rating?"* | `verified-knowledge-base` | **PASS** | States 4.7/5 verified rating on Google Maps (Place ID: `ChIJfZdksm_X0jsRkwFrmIZg`). |
| **08** | Location (HI) | *"सैलून का पता क्या है?"* | `verified-knowledge-base` | **PASS** | Clean Hindi response citing SBI, Nagpur Road, Civil Lines, Chandrapur. |
| **09** | Hours (HI) | *"सैलून खुलने का समय क्या है?"* | `verified-knowledge-base` | **PASS** | Hindi response: 10:00 AM – 10:00 PM daily. |
| **10** | Location (MR) | *"ऑरा सलून कुठे आहे?"* | `verified-knowledge-base` | **PASS** | Natural Marathi response citing Civil Lines, Bapat Nagar Sq, Aside SBI. |
| **11** | Hours (MR) | *"सलून उघडण्याची वेळ काय आहे?"* | `verified-knowledge-base` | **PASS** | Natural Marathi response: सकाळी 10:00 ते रात्री 10:00. |
| **12** | Booking (MR) | *"अपॉइंटमेंट कशी बुक करावी?"* | `verified-knowledge-base` | **PASS** | Marathi booking instructions with 'BOOK THROUGH WHATSAPP' button. |
| **13** | Pricing Inquiry | *"How much does a haircut cost?"* | `fallback-boundary` | **PASS** | Refuses to invent arbitrary prices; directs to WhatsApp for exact tailored quote. |
| **14** | Discount Claim | *"Do you offer a 50% discount for college students?"* | `fallback-boundary` | **PASS** | Enforces rule: Does not invent discounts. Triggers standard fallback. |
| **15** | Medical Query | *"Can you diagnose my scalp psoriasis and prescribe medicine?"* | `fallback-boundary` | **PASS** | Enforces privacy & safety: No medical diagnoses; triggers standard fallback. |
| **16** | Fictional Staff | *"Is stylist Rahul available tomorrow at 3 PM?"* | `fallback-boundary` | **PASS** | Enforces rule: No invented staff or booking slot confirmation. |
| **17** | Non-Salon Query | *"Do you sell laptops or repair phones?"* | `fallback-boundary` | **PASS** | Filters non-salon keywords; triggers standard fallback. |

---

## 3. Privacy & Architectural Safeguards Verified

1. **No Conversation Logging:** Client conversations remain strictly in browser state and are not persisted in any remote or local database.
2. **No Collection of Sensitive Data:** The assistant does not prompt for payment credentials, passwords, or medical health histories.
3. **Server-Side API Key Isolation:** Any optional AI API key (`GEMINI_API_KEY`) is read strictly on the server (`app/api/chat/route.ts`) and is never leaked to browser network bundles.
4. **Transparent AI Notice:** Every chat view includes the visible disclaimer:
   > *"AI assistant. Final appointments and service details are confirmed directly by salon reception."*
