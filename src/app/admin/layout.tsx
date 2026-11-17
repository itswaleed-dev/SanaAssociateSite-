import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/admin-auth';

export const metadata: Metadata = { title: 'Admin Panel | Sana Associates' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSession(session)) {
    redirect('/login');
  }

  return <>{children}</>;
}
