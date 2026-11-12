import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassesSvg, type View } from './Glasses';

type P = [number, number];
type Part = { id: string; name: string; loc: string; fn: string; more: string; f: P; s: P };
const PARTS: Part[] = [
  { id: 'camera', name: 'AI CAMERA', loc: 'Front bridge', fn: "Captures images of the user's surroundings and sends visual information for AI analysis.", more: 'Sits at eye level so it sees what the wearer faces. It only sees its field of view.', f: [200, 72], s: [58, 92] },
  { id: 'mic', name: 'MICROPHONE', loc: 'Lower frame, toward the mouth', fn: "Captures the user's voice commands.", more: 'Lets the wearer talk naturally, with no screen or buttons.', f: [310, 136], s: [110, 118] },
  { id: 'speaker', name: 'MINI SPEAKER', loc: 'Temple arms, near the ears', fn: 'Delivers spoken AI instructions without blocking environmental sounds.', more: 'Open-ear audio keeps real-world sounds audible.', f: [385, 98], s: [335, 96] },
  { id: 'ai', name: 'AI PROCESSING SYSTEM', loc: 'Inside the frame or the connected smartphone', fn: 'Processes information and communicates with Gemini AI.', more: 'Prepares frames and voice, then relays results to the speaker.', f: [110, 72], s: [150, 76] },
  { id: 'battery', name: 'BATTERY', loc: 'Inside the temple arms', fn: 'Supplies power to the device.', more: 'Distributed along the arms to balance weight.', f: [30, 88], s: [265, 80] },
  { id: 'conn', name: 'CONNECTIVITY MODULE', loc: 'Inside the frame', fn: 'Connects the glasses to the smartphone and AI service.', more: 'Bluetooth to the phone; the phone reaches Gemini over the internet.', f: [372, 64], s: [205, 80] },
];

export default function Anatomy() {
  const [view, setView] = useState<View>('front');
  const [sel, setSel] = useState(PARTS[0]);
  const pos = (p: Part) => (view === 'side' ? p.s : p.f);
  const ai = PARTS[3];
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900 to-black p-4 sm:p-8">
        <div className="mb-4 flex justify-center gap-2">
          {(['front', 'side', 'persp'] as View[]).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`rounded-full px-4 py-1 text-xs uppercase tracking-widest ${view === v ? 'bg-blue-600' : 'bg-white/10'}`}>
              {v === 'persp' ? 'perspective' : v}
            </button>
          ))}
        </div>
        <GlassesSvg view={view}>
          {PARTS.filter((p) => p.id !== 'ai').map((p) => (
            <line key={p.id} className="flow" x1={pos(ai)[0]} y1={pos(ai)[1]} x2={pos(p)[0]} y2={pos(p)[1]} />
          ))}
          {PARTS.map((p) => (
            <g key={p.id} onClick={() => setSel(p)} className="cursor-pointer" role="button" tabIndex={0} aria-label={p.name}
              onKeyDown={(e) => e.key === 'Enter' && setSel(p)}>
              <circle cx={pos(p)[0]} cy={pos(p)[1]} r="10" fill="rgba(34,211,238,.18)">
                <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={pos(p)[0]} cy={pos(p)[1]} r="5" fill={sel.id === p.id ? '#22d3ee' : '#3b82f6'} stroke="#fff" strokeWidth="1" />
            </g>
          ))}
        </GlassesSvg>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {PARTS.map((p) => (
            <button key={p.id} onClick={() => setSel(p)} className={`rounded-full border px-3 py-1 text-[11px] ${sel.id === p.id ? 'border-cyan-400 text-cyan-300' : 'border-white/15 text-white/60'}`}>{p.name}</button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sel.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="rounded-2xl border border-cyan-400/20 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs tracking-[.3em] text-cyan-300">COMPONENT</p>
          <h3 className="mt-1 text-2xl font-bold">{sel.name}</h3>
          <p className="mt-4 text-sm text-white/50">Location</p><p>{sel.loc}</p>
          <p className="mt-3 text-sm text-white/50">Function</p><p>{sel.fn}</p>
          <p className="mt-3 text-sm text-white/60">{sel.more}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
