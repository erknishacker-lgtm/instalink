import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getSiteConfig } from '@/lib/db';
import AdminNav from './components/AdminNav';
import AdminToaster from './components/AdminToaster';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin-login');
  const config = await getSiteConfig();

  return (
    <div className="flex min-h-screen bg-paper">
      <AdminNav siteName={config.name} />
      <main className="flex-1 min-w-0 px-4 pt-6 pb-28 md:px-10 md:py-10 md:pb-16">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </main>
      <AdminToaster />
    </div>
  );
}
