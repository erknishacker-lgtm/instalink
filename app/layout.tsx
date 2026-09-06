import type { Metadata } from 'next';
import { Sacramento, Figtree } from 'next/font/google';
import { getSiteConfig } from '@/lib/db';
import './globals.css';

// Script para o nome dela (a assinatura do cartão) e uma humanista para todo o resto.
const script = Sacramento({ subsets: ['latin'], weight: '400', variable: '--font-script', display: 'swap' });
const sans = Figtree({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await getSiteConfig();
    return {
      title: config.name,
      description: config.bio || `Agende um tratamento com ${config.name} pelo WhatsApp.`,
    };
  } catch {
    return { title: 'InstaLink' };
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${script.variable} ${sans.variable}`}>
      <body className="font-sans bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
