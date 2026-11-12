import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
export type View = 'front' | 'side' | 'persp';
const F = '#0a0c10', E = '#2b3a52';

export function GlassesSvg({ view, children, float = true }: { view: View; children?: ReactNode; float?: boolean }) {
  const p = view === 'persp';
  return (
    <div style={{ perspective: 1200 }} className="w-full">
      <motion.div
        animate={float ? { y: [0, -10, 0], rotateY: p ? [-32, -22, -32] : 0 } : { rotateY: p ? -26 : 0 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', rotateX: p ? 8 : 0 }}>
        <svg viewBox="0 0 400 200" className="w-full drop-shadow-[0_0_40px_rgba(37,99,235,.35)]" role="img" aria-label="Smart glasses">
          <defs><linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0e2a55" stopOpacity=".7" /><stop offset="1" stopColor="#031018" stopOpacity=".9" />
          </linearGradient></defs>
          {view === 'side' ? (
            <g>
              <path d="M60 80 H330 Q372 80 372 125" fill="none" stroke={F} strokeWidth="14" strokeLinecap="round" />
              <path d="M70 76 H330" stroke={E} strokeWidth="2" />
              <rect x="34" y="52" width="52" height="80" rx="22" fill="url(#lens)" stroke={F} strokeWidth="8" />
            </g>
          ) : (
            <g>
              <rect x="48" y="48" width="137" height="82" rx="36" fill="url(#lens)" stroke={F} strokeWidth="9" />
              <rect x="215" y="48" width="137" height="82" rx="36" fill="url(#lens)" stroke={F} strokeWidth="9" />
              <path d="M185 76 Q200 62 215 76" fill="none" stroke={F} strokeWidth="9" />
              <path d="M52 78 L16 72 M348 78 L384 72" stroke={F} strokeWidth="10" strokeLinecap="round" />
              <path d="M60 58 Q100 50 150 58" stroke={E} strokeWidth="2" fill="none" />
              <circle cx="200" cy="72" r="3" fill="#22d3ee"><animate attributeName="opacity" values="1;.2;1" dur="2s" repeatCount="indefinite" /></circle>
            </g>
          )}
          {children}
        </svg>
      </motion.div>
    </div>
  );
}
