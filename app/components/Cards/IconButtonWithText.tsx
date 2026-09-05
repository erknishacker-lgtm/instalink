'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

type IconButtonWithTextProps = {
  title: string;
  color: string | { start: string; end: string };
  link: string;
  icon: IconType;
  username?: string;
};

export default function IconButtonWithText({ title, color, link, icon: Icon, username }: IconButtonWithTextProps) {
  const bgStyle = typeof color === 'string'
    ? { backgroundColor: color }
    : { backgroundImage: `linear-gradient(135deg, ${color.start}, ${color.end})` };

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="glass-card group relative flex items-center gap-4 p-5 rounded-3xl shadow-card hover:shadow-soft transition-all duration-300 w-full max-w-md overflow-hidden"
    >
      <div
        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
        style={bgStyle}
      >
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <h3 className="font-semibold text-text-primary truncate leading-tight">{title}</h3>
        {username && (
          <p className="text-xs text-text-secondary mt-0.5 truncate">
            {username.startsWith('@') ? username : `@${username}`}
          </p>
        )}
      </div>

      <ExternalLink className="w-4 h-4 text-text-secondary/40 group-hover:text-accent-rose group-hover:opacity-100 opacity-0 transition-all duration-200 shrink-0" />
    </motion.a>
  );
}