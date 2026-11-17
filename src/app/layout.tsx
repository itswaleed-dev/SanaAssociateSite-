
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Sana Associates – Architecture & Design',
    template: '%s — Sana Associates',
  },

  description:
    'Premium architecture, interior, and exterior design studio based in Lahore, Pakistan.',

  icons: {
    icon: 'https://res.cloudinary.com/do3bdamxv/image/upload/v1794899292/logo_sana001_njjftx.jpg',
    shortcut: 'https://res.cloudinary.com/do3bdamxv/image/upload/v1794899292/logo_sana001_njjftx.jpg',
    apple: 'https://res.cloudinary.com/do3bdamxv/image/upload/v1794899292/logo_sana001_njjftx.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
