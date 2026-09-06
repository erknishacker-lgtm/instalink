'use client';

import { Sparkles } from 'lucide-react';

export default function Announcement({ badge, text }: { badge?: string; text: string }) {
  if (!text) return null;
  return (
    <aside className="relative mx-auto max-w-[24rem] -rotate-1">
      <div className="flex items-start gap-3 rounded-2xl border border-champagne bg-paper-lift/90 px-4 py-3 shadow-card backdrop-blur-[2px]">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-pale text-rose">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
        </span>
        <p className="text-[14.5px] leading-snug text-ink">
          {badge && <span className="card-label mr-2 align-[1px]">{badge}</span>}
          {text}
        </p>
      </div>
    </aside>
  );
}
