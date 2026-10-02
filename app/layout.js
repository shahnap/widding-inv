import { Cormorant_Garamond, Great_Vibes, Jost } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--serif' });
const script = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--script' });
const sans = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--sans' });

export const metadata = {
  title: 'Akhil & Smrithi | Wedding Reception',
  description: 'You are warmly invited to the wedding reception of Akhil and Smrithi.',
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#a9b79a' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${script.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
