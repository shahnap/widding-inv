import { EB_Garamond, Allura, Cinzel } from 'next/font/google';
import './globals.css';

const serif = EB_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--serif' });
const script = Allura({ subsets: ['latin'], weight: '400', variable: '--script' });
const sans = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--sans' });

export const metadata = {
  title: 'Akhil & Smrithi | Wedding Reception',
  description: 'You are warmly invited to the wedding reception of Akhil and Smrithi.',
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#fbfaf7' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${script.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}