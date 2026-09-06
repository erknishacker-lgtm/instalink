'use client';

import { motion, useReducedMotion } from 'framer-motion';
import SafeImg from '../SafeImg';

interface CameoProps {
  picture: string;
  name: string;
  username: string;
  bio?: string;
}

export default function Cameo({ picture, name, username, bio }: CameoProps) {
  const reduce = useReducedMotion();
  const handle = username ? (username.startsWith('@') ? username : `@${username}`) : '';
  const initial = (name.trim()[0] || '?').toUpperCase();

  return (
    <header className="flex flex-col items-center text-center pt-6 pb-1">
      <motion.figure
        className="relative w-[40vw] max-w-[164px] aspect-square"
        initial={reduce ? false : { opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Anel duplo champanhe, como o filete de um camafeu impresso. */}
        <div aria-hidden className="absolute -inset-[6px] rounded-full border border-champagne-deep/70" />
        <div aria-hidden className="absolute -inset-[2px] rounded-full border border-champagne" />
        <div className="absolute inset-0 rounded-full overflow-hidden shadow-lift bg-paper-deep">
          <SafeImg
            src={picture}
            alt={name}
            className="h-full w-full object-cover"
            fallback={
              <div className="h-full w-full flex items-center justify-center" role="img" aria-label={name}>
                <span className="font-script text-[3.5rem] leading-none text-rose/70 translate-y-1">{initial}</span>
              </div>
            }
          />
          <div aria-hidden className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]" />
        </div>
      </motion.figure>

      <motion.h1
        className="mt-3 font-script text-[2.4rem] leading-[0.85] text-ink px-4 [text-wrap:balance]"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {name}
      </motion.h1>

      {(handle || bio) && (
        <motion.div
          className="mt-2 flex flex-col items-center gap-0.5"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {handle && <p className="card-label">{handle}</p>}
          {bio && <p className="text-[14px] text-ink-soft leading-snug max-w-[30ch] [text-wrap:balance]">{bio}</p>}
        </motion.div>
      )}
    </header>
  );
}
