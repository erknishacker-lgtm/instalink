import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminSidebar from './components/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/admin-login');
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}