'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaLink, FaCalendarAlt, FaShoppingBag, FaCog, FaSignOutAlt } from 'react-icons/fa';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FaHome },
  { href: '/admin/links', label: 'Links', icon: FaLink },
  { href: '/admin/services', label: 'Serviços', icon: FaCalendarAlt },
  { href: '/admin/products', label: 'Achadinhos', icon: FaShoppingBag },
  { href: '/admin/settings', label: 'Configurações', icon: FaCog },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <aside className="w-64 bg-white border-r border-pink-100 flex flex-col min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#EC4899]">InstaLink</h2>
        <p className="text-xs text-pink-300 mt-1">Painel Admin</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-[#F9A8D4] to-[#EC4899] text-white'
                  : 'text-[#4A1942] hover:bg-pink-50'
              }`}
            >
              <item.icon className="text-sm" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-pink-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-50 w-full transition-colors"
        >
          <FaSignOutAlt className="text-sm" />
          <span className="font-medium text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
}