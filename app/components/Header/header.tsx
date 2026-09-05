'use client';

import { motion } from 'framer-motion';

interface HeaderProps {
  picture: string;
  name: string;
  username: string;
}

export default function Header({ picture, name, username }: HeaderProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center py-8"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-br from-accent-rose/40 to-accent-warm/30 rounded-full opacity-20 group-hover:opacity-35 blur transition-opacity duration-300" />
        <img
          src={picture}
          alt={name}
          className="relative h-28 w-28 rounded-full border-[3px] border-white/90 shadow-soft object-cover"
        />
      </div>

      <h1 className="mt-5 font-serif text-2xl font-bold tracking-tight text-text-primary">
        {name}
      </h1>

      {username && (
        <p className="mt-1 text-sm font-medium text-text-secondary tracking-wide">
          {username.startsWith('@') ? username : `@${username}`}
        </p>
      )}
    </motion.div>
  );
}