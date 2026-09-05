'use client';

import { useEffect, useState } from 'react';
import { FaLink, FaCalendarAlt, FaShoppingBag } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ links: 0, services: 0, products: 0 });

  useEffect(() => {
    async function load() {
      const [links, services, products] = await Promise.all([
        fetch('/api/useful-links').then(r => r.json()),
        fetch('/api/services').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
      ]);
      setStats({
        links: links.length,
        services: services.length,
        products: products.length,
      });
    }
    load();
  }, []);

  const cards = [
    { label: 'Links', value: stats.links, icon: FaLink, color: 'from-pink-300 to-pink-500' },
    { label: 'Serviços', value: stats.services, icon: FaCalendarAlt, color: 'from-rose-300 to-rose-500' },
    { label: 'Achadinhos', value: stats.products, icon: FaShoppingBag, color: 'from-fuchsia-300 to-fuchsia-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#4A1942] mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-6 border border-pink-100 shadow-sm">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3`}>
              <card.icon />
            </div>
            <p className="text-3xl font-bold text-[#4A1942]">{card.value}</p>
            <p className="text-pink-400 text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}