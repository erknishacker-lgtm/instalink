'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SafeImg from '../SafeImg';

interface Partner {
  id: string;
  name: string;
  role: string;
  link: string;
  logoUrl?: string;
}

// Selo redondo de embaixadora: texto circular girando devagar em volta do logo da marca.
function Seal({ partner }: { partner: Partner }) {
  const reduce = useReducedMotion();
  // Circunferência do anel ≈ 251 unidades; ~38 caracteres cabem. Repete até
  // chegar perto disso e deixa o SVG fechar o círculo ajustando o espaçamento.
  const ring = `${partner.role.toUpperCase()} · ${partner.name.toUpperCase()} · `;
  const repeats = Math.max(1, Math.round(38 / ring.length));
  const repeated = ring.repeat(repeats);
  return (
    <div className="relative h-[108px] w-[108px] shrink-0">
      <svg
        viewBox="0 0 100 100"
        className={`absolute inset-0 h-full w-full ${reduce ? '' : 'animate-spin-slow'} text-rose`}
        aria-hidden
      >
        <defs>
          <path id={`ring-${partner.id}`} d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
        </defs>
        <text fontSize="8.4" fontWeight="600" letterSpacing="1.6" fill="currentColor">
          <textPath href={`#ring-${partner.id}`} textLength="251" lengthAdjust="spacing">{repeated}</textPath>
        </text>
      </svg>
      <div className="absolute inset-[22px] rounded-full border border-champagne-deep bg-paper-lift shadow-card flex items-center justify-center overflow-hidden">
        <SafeImg
          src={partner.logoUrl}
          alt={partner.name}
          className="h-full w-full object-contain p-2"
          fallback={<span className="font-script text-[2rem] leading-none text-rose translate-y-1">{partner.name[0]}</span>}
        />
      </div>
    </div>
  );
}

export default function PartnerSeal({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;
  return (
    <section aria-labelledby="parcerias" className="w-full">
      <h2 id="parcerias" className="card-label px-1">Parcerias</h2>
      <ul className="mt-3 flex flex-col gap-3">
        {partners.map((p) => (
          <li key={p.id}>
            <motion.a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center gap-4 rounded-card border border-champagne bg-paper-lift/85 p-4 pr-5 shadow-card hover:shadow-lift transition-shadow duration-300"
            >
              <Seal partner={p} />
              <div className="min-w-0 flex-1">
                {/* O papel dela já circula no anel do selo; repetir aqui seria um kicker. */}
                <p className="text-[22px] font-semibold leading-tight text-ink">{p.name}</p>
                <p className="mt-1.5 inline-flex items-center gap-1 text-[13.5px] text-rose underline decoration-rose/40 underline-offset-4 group-hover:decoration-rose">
                  Conhecer a loja <ArrowUpRight className="h-3.5 w-3.5" />
                </p>
              </div>
            </motion.a>
          </li>
        ))}
      </ul>
    </section>
  );
}
