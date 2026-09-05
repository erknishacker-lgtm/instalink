'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header/header';
import Announcement from './components/Cards/Announcement';
import IconButtonWithText from './components/Cards/IconButtonWithText';
import EnhancedButton from './components/Cards/EnhancedButton';
import SchedulingButton from './components/Cards/SchedulingButton';
import Achadinhos from './components/Sections/Achadinhos';
import { iconMap } from './icons';

interface SiteData {
  config: {
    name: string;
    username: string;
    profilePictureUrl: string;
    announcementBadge: string;
    announcementText: string;
    whatsappPhone: string;
  };
  socialLinks: Array<{
    id: string;
    title: string;
    link: string;
    icon: string;
    username?: string;
    color: string | { start: string; end: string };
  }>;
  usefulLinks: Array<{
    id: string;
    title: string;
    link: string;
    isNew?: boolean;
    color: string | { start: string; end: string };
    icon?: string;
  }>;
  services: Array<{
    id: string;
    name: string;
    whatsappMessageTemplate: string;
  }>;
  products: Array<{
    id: string;
    name: string;
    imageUrl: string;
    affiliateLink: string;
    description?: string;
  }>;
}

export default function Home() {
  const [data, setData] = useState<SiteData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [config, socialLinks, usefulLinks, services, products] = await Promise.all([
          fetch('/api/site').then(r => r.json()),
          fetch('/api/social-links').then(r => r.json()),
          fetch('/api/useful-links').then(r => r.json()),
          fetch('/api/services').then(r => r.json()).catch(() => []),
          fetch('/api/products').then(r => r.json()).catch(() => []),
        ]);
        setData({ config, socialLinks, usefulLinks, services, products });
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    }
    load();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center grain-overlay relative">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-accent-rose/30 border-t-accent-rose animate-spin" />
          <span className="text-sm font-medium text-text-secondary tracking-wide">Carregando...</span>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.23, 0.48, 0.38, 0.96] },
    },
  };

  return (
    <main className="min-h-screen bg-bg-primary py-12 px-4 grain-overlay relative" style={{ WebkitTapHighlightColor: 'transparent' }}>
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-70"
        style={{
          backgroundImage: "url('/screenmobile.png')"
        }}
      />

      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-accent-rose/[0.04] blur-[100px]" />
        <div className="absolute top-[20%] -right-[15%] w-[40vw] h-[40vw] rounded-full bg-accent-warm/[0.03] blur-[80px]" />
        <div className="absolute bottom-[5%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-accent-rose/[0.03] blur-[70px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-md mx-auto flex flex-col items-center gap-5 z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="w-full">
          <Header
            picture={data.config.profilePictureUrl}
            name={data.config.name}
            username={data.config.username}
          />
        </motion.div>

        {/* Announcement */}
        {(data.config.announcementBadge || data.config.announcementText) && (
          <motion.div variants={itemVariants} className="w-full">
            <Announcement
              badgeName={data.config.announcementBadge}
              text={data.config.announcementText}
            />
          </motion.div>
        )}

        {/* Social Links */}
        <div className="flex flex-col items-center gap-3 w-full">
          {data.socialLinks.map((link) => (
            <motion.div key={link.id} variants={itemVariants} className="w-full">
              <IconButtonWithText
                title={link.title}
                color={link.color}
                link={link.link}
                icon={iconMap[link.icon]}
                username={link.username}
              />
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        {data.usefulLinks.length > 0 && data.socialLinks.length > 0 && (
          <motion.div variants={itemVariants} className="w-full px-8">
            <div className="h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
          </motion.div>
        )}

        {/* Useful Links */}
        <div className="flex flex-col items-center gap-3 w-full">
          {data.usefulLinks.map((link) => (
            <motion.div key={link.id} variants={itemVariants} className="w-full">
              <EnhancedButton
                title={link.title}
                color={link.color}
                link={link.link}
                isNew={link.isNew}
                icon={link.icon ? iconMap[link.icon] : undefined}
              />
            </motion.div>
          ))}
        </div>

        {/* Scheduling Button */}
        {data.services.length > 0 && (
          <motion.div variants={itemVariants} className="w-full">
            <SchedulingButton
              services={data.services}
              whatsappPhone={data.config.whatsappPhone}
            />
          </motion.div>
        )}

        {/* Achadinhos */}
        <motion.div variants={itemVariants} className="w-full">
          <Achadinhos products={data.products} />
        </motion.div>

        {/* Footer spacer */}
        <div className="h-8" />
      </motion.div>
    </main>
  );
}