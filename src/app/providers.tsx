'use client';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/ui/toast';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { WhatsAppButton } from '@/components/contact/whatsapp-button';

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <ToastProvider>
      {!isAdmin && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && <Footer />}
    </ToastProvider>
  );
}
