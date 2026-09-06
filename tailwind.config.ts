import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        // O cartão: papel blush, tinta ameixa, rosa para nomes, um rosa quente só para a ação.
        paper: { DEFAULT: '#FBEFF2', deep: '#F5E4EC', lift: '#FFF7F9' },
        ink: { DEFAULT: '#3A1F2E', soft: '#6E4A5C', mute: '#7E5468' },
        rose: { DEFAULT: '#B3446C', soft: '#D98BA6', pale: '#F0CBD8' },
        // superfície cheia que carrega texto ou ícone branco (5.18:1).
        hot: { DEFAULT: '#E8457A', deep: '#C92E62', press: '#B02754' },
        champagne: { DEFAULT: '#EAD9C8', deep: '#D9BFA6' },
        wa: '#25D366',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.14em' }],
      },
      boxShadow: {
        card: '0 1px 2px rgba(58,31,46,0.06), 0 12px 32px -12px rgba(179,68,108,0.22)',
        lift: '0 2px 4px rgba(58,31,46,0.06), 0 20px 48px -16px rgba(179,68,108,0.32)',
        hot: '0 8px 24px -8px rgba(232,69,122,0.55)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.7)',
      },
      borderRadius: { card: '1.75rem' },
      keyframes: {
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        caret: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
      animation: {
        'spin-slow': 'spinSlow 28s linear infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        caret: 'caret 0.9s steps(1) infinite',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
