'use client';

import type { PublicData } from '@/lib/db';
import Backdrop from './Backdrop';
import Cameo from './Cameo';
import Announcement from './Announcement';
import ServiceMenu from './ServiceMenu';
import PartnerSeal from './PartnerSeal';
import CatalogRibbon from './CatalogRibbon';
import SocialRow from './SocialRow';
import LinkLines from './LinkLines';
import AchadinhosPreview from './AchadinhosPreview';
import Reveal from './Reveal';

export default function HomeView({ data }: { data: PublicData }) {
  const { config } = data;
  const hasPartnersOrProducts = data.partners.length > 0 || data.products.length > 0;
  return (
    <main className="paper-grain relative min-h-screen">
      <Backdrop imageUrl={config.backgroundImageUrl} />

      {/* O cartão: uma coluna de celular; no desktop vira uma folha com filete champanhe. */}
      <div className="relative z-10 mx-auto w-full max-w-[26.5rem] px-4 pb-16 md:my-10 md:rounded-[2.25rem] md:border md:border-champagne md:bg-paper/70 md:px-8 md:shadow-lift md:backdrop-blur-sm">
        <Cameo picture={config.profilePictureUrl} name={config.name} username={config.username} bio={config.bio} />

        <div className="mt-6 flex flex-col gap-9">
          {config.announcementText && (
            <Reveal><Announcement badge={config.announcementBadge} text={config.announcementText} /></Reveal>
          )}

          {data.services.length > 0 && (
            <Reveal><ServiceMenu services={data.services} whatsappPhone={config.whatsappPhone} /></Reveal>
          )}

          {hasPartnersOrProducts && (
            <div className="flex flex-col gap-4">
              {data.partners.length > 0 && (
                <Reveal gesture="turn"><PartnerSeal partners={data.partners} /></Reveal>
              )}
              {data.products.length > 0 && (
                <Reveal gesture="settle"><CatalogRibbon count={data.products.length} /></Reveal>
              )}
            </div>
          )}

          {data.products.length > 0 && (
            <Reveal gesture="drift"><AchadinhosPreview products={data.products} /></Reveal>
          )}

          <LinkLines links={data.usefulLinks} />

          <SocialRow links={data.socialLinks} />

          <Reveal>
            <footer className="mt-4 flex flex-col items-center gap-2 pt-6">
              <div className="rule-champagne w-full" aria-hidden />
              <p className="mt-4 font-script text-[2rem] leading-none text-rose/80">{config.name}</p>
              <p className="text-2xs uppercase tracking-[0.16em] text-ink-mute">{config.username}</p>
            </footer>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
