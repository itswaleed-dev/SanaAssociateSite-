import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], display: 'swap', weight: ['300','400','500','600','700','800'] });

export const metadata: Metadata = {
  title: { default: 'Sana Associates — Architecture & Home Design', template: '%s — Sana Associates' },
  description: 'Premium architecture, interior, and exterior design studio based in Lahore, Pakistan.',
  keywords: 'architecture, home design, interior design, exterior design, Lahore, Pakistan',
  openGraph: { title: 'Sana Associates — Architecture & Home Design', description: 'Premium architecture and home design studio in Lahore.', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
