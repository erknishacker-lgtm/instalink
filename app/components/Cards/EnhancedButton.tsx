'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

type EnhancedButtonProps = {
  title: string;
  color: string | { start: string; end: string };
  isNew?: boolean;
  link: string;
  icon?: IconType;
};

export default function EnhancedButton({ title, color, isNew, link, icon: Icon }: EnhancedButtonProps) {
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
      {isNew && (
        <div className="absolute top-0 right-0 bg-accent-rose text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-xl rounded-tr-2xl flex items-center gap-1 z-10">
          <Sparkles className="w-3 h-3" />
          Novo
        </div>
      )}

      {Icon && (
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
          style={bgStyle}
        >
          <Icon className="w-5 h-5" />
        </div>
      )}

      <span className={`flex-1 font-semibold text-text-primary leading-tight ${!Icon ? 'pl-1' : ''}`}>
        {title}
      </span>

      <ArrowRight className="w-4 h-4 text-text-secondary/30 group-hover:text-accent-rose group-hover:translate-x-1 transition-all duration-200 shrink-0" />
    </motion.a>
  );
}