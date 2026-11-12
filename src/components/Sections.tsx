import { motion } from 'framer-motion';
import { Camera, Cpu, Brain, Search, MessageSquare, Volume2, Eye, Users, Boxes, AlertTriangle, Mic, Navigation, FileText, Globe, Languages } from 'lucide-react';
import { GlassesSvg } from './Glasses';

const rv = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.7 } };
export const Head = ({ k, t }: { k: string; t: string }) => (
  <motion.div {...rv} className="mb-10"><p className="text-xs tracking-[.4em] text-cyan-300">{k}</p><h2 className="mt-2 text-3xl font-bold sm:text-5xl">{t}</h2></motion.div>
);

const STEPS = [
  [Camera, 'Camera', 'Captures the environment'], [Cpu, 'Processing', 'Frame is compressed and prepared'], [Brain, 'Gemini AI', 'Analyzes the scene'],
  [Search, 'Detection', 'Objects, people, doors, obstacles, text'], [MessageSquare, 'Guidance', 'Contextual short instructions'], [Volume2, 'Voice', 'Spoken to the user in Uzbek'],
] as const;
export function HowItWorks() {
  return (
    <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
      <div className="absolute left-0 right-0 top-8 -z-10 hidden h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent lg:block" />
      {STEPS.map(([I, t, d], i) => (
        <motion.div key={t} {...rv} transition={{ duration: 0.6, delay: i * 0.12 }} className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-cyan-400/40 bg-black shadow-[0_0_25px_rgba(34,211,238,.25)]"><I className="text-cyan-300" /></div>
          <p className="mt-3 text-xs text-white/40">STEP {i + 1}</p><p className="font-semibold">{t}</p><p className="text-sm text-white/60">{d}</p>
        </motion.div>
      ))}
    </div>
  );
}

const FEATS = [
  [Eye, 'Real-Time AI Vision', 'Controlled frame analysis, not constant video upload.'], [Users, 'Human Detection', 'Reports where people are in view. Never who they are.'],
  [Boxes, 'Object Recognition', 'Tables, chairs, cars, doors and more.'], [AlertTriangle, 'Obstacle Awareness', 'Warns and asks to stop when something is close or unclear.'],
  [Mic, 'Voice Interaction', 'Hands-free, natural conversation.'], [Navigation, 'Smart Navigation', 'Experimental guidance from repeated observations.'],
  [FileText, 'Text Reading', 'Reads visible signs and labels aloud.'], [Globe, 'Environmental Description', 'Short summaries of what the camera sees.'],
  [Languages, 'Uzbek Language Support', 'Understands and answers in Uzbek.'],
] as const;
export function Features() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FEATS.map(([I, t, d], i) => (
        <motion.div key={t} {...rv} transition={{ duration: 0.5, delay: (i % 3) * 0.1 }} whileHover={{ y: -6 }}
          className="group rounded-2xl border border-white/10 bg-white/[.03] p-6 transition hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(37,99,235,.25)]">
          <I className="mb-4 text-blue-400 transition group-hover:scale-110 group-hover:text-cyan-300" />
          <h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm text-white/60">{d}</p>
        </motion.div>
      ))}
    </div>
  );
}

const CONVO = [['u', 'What is in front of me?'], ['a', 'There is a table directly in front of you.'], ['u', 'Is there anyone nearby?'], ['a', 'Yes. A person is standing on your left.'], ['u', 'Find the door.'], ['a', 'I can see a door slightly to your right.']];
export function Demo() {
  return (
    <div className="mx-auto max-w-xl space-y-3">
      <p className="text-center text-xs text-amber-300">Illustrative example. Not live AI output.</p>
      {CONVO.map(([w, t], i) => (
        <motion.div key={i} initial={{ opacity: 0, x: w === 'u' ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${w === 'u' ? 'ml-auto bg-blue-600' : 'border border-cyan-400/30 bg-white/5'}`}>
          <b className="mb-1 block text-[10px] tracking-widest opacity-60">{w === 'u' ? 'USER' : 'STARK AI'}</b>{t}
        </motion.div>
      ))}
    </div>
  );
}

export function About() {
  const pts = ['Greater environmental awareness', 'More accessible communication', 'Better access to written information', 'Support for everyday activities', 'Independence when used alongside established mobility aids'];
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <motion.p {...rv} className="text-xl text-white/80">STARK VISION is designed to make everyday environments more understandable and accessible for visually impaired people through artificial intelligence.</motion.p>
      <ul className="space-y-2">{pts.map((p) => <li key={p} className="border-l-2 border-cyan-400 pl-3 text-white/70">{p}</li>)}</ul>
      <p className="text-xs text-white/40 md:col-span-2">Experimental university prototype. Not a medical device or certified mobility aid; it cannot detect every hazard.</p>
    </div>
  );
}

export function Final() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <motion.h2 {...rv} className="text-4xl font-bold sm:text-6xl">THE FUTURE OF ACCESSIBILITY STARTS HERE.</motion.h2>
      <p className="mt-4 text-white/60">Technology should not leave anyone behind.</p>
      <div className="mx-auto my-8 max-w-md"><GlassesSvg view="persp" /></div>
      <a href="#test" className="rounded-full bg-blue-600 px-8 py-3 shadow-[0_0_30px_rgba(37,99,235,.6)]">TRY STARK VISION</a>
    </div>
  );
}
