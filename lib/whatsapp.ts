export interface AppointmentDetails {
  name: string;
  service: string;
  date: string;
  time: string;
  message?: string;
}

export const WHATSAPP_NUMBER = "918668806851";
export const CALL_NUMBER = "+918668806851";
export const CALL_HREF = "tel:+918668806851";
export const MAP_URL = "https://www.google.com/maps/search/?api=1&query=Aura+The+Salon+Chandrapur";

/**
 * Constructs the standardized WhatsApp appointment request URL
 * following the exact required business message format.
 */
export function createWhatsAppAppointmentUrl(details: AppointmentDetails): string {
  const formattedMessage = `Hello Aura The Salon!

I would like to request an appointment.

Name: ${details.name.trim() || 'Guest'}
Service: ${details.service.trim() || 'General Consultation'}
Preferred date: ${details.date.trim() || 'Flexible'}
Preferred time: ${details.time.trim() || 'Flexible'}
Message: ${details.message?.trim() || 'None'}

Please confirm the availability and appointment details.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;
}

/**
 * Constructs a pre-filled direct WhatsApp appointment inquiry URL
 * with standardized 5 fields for quick 1-click actions across headers, cards, and chatbots.
 */
export function createQuickWhatsAppUrl(serviceName?: string, customNote?: string): string {
  const formattedMessage = `Hello Aura The Salon!

I would like to request an appointment.

Name: Guest Inquiry
Service: ${serviceName?.trim() || 'General Consultation'}
Preferred date: Flexible
Preferred time: Flexible
Message: ${customNote?.trim() || 'Inquiring about appointment availability'}

Please confirm the availability and appointment details.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;
}
