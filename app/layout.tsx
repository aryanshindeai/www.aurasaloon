import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aura The Salon | Feel Good. Look Your Best. | Chandrapur',
  description: 'Welcome to Aura The Salon in Civil Lines, Chandrapur. A place to discover your style, enjoy a refreshing salon experience and feel your best.',
  keywords: [
    'Aura The Salon',
    'Salon Chandrapur',
    'Haircut Chandrapur',
    'Hair Spa Chandrapur',
    'Bridal Makeup Chandrapur',
    'Civil Lines Chandrapur Salon',
    'Nagpur Road Salon Chandrapur'
  ],
  metadataBase: new URL('https://aurathesalon.in'),
  openGraph: {
    title: 'Aura The Salon | Luxury Hair, Bridal & Beauty Sanctuary in Chandrapur',
    description: 'Beside SBI, Nagpur Road, Bapat Nagar Square, Civil Lines, Chandrapur. Experience world-class hair artistry, bridal couture & restorative skincare.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${cormorant.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#F8F5F0] text-[#302C29] antialiased selection:bg-[#E9E0D5] selection:text-[#302C29] min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
