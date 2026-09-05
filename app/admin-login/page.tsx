'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, pass }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        setError('Credenciais inválidas');
      }
    } catch {
      setError('Erro ao conectar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-pink-100">
        <h1 className="text-2xl font-bold text-center text-[#4A1942] mb-2">Painel Admin</h1>
        <p className="text-center text-pink-400 mb-6 text-sm">InstaLink</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4A1942] mb-1">Usuário</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4A1942] mb-1">Senha</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-[#F9A8D4] to-[#EC4899] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}