import { motion } from 'framer-motion';
import TestPanel from './components/TestPanel';
import Anatomy from './components/Anatomy';
import { GlassesSvg } from './components/Glasses';
import { Head, HowItWorks, Features, Demo, About, Final } from './components/Sections';

const S = ({ id, children }: { id?: string; children: React.ReactNode }) => <section id={id} className="mx-auto max-w-6xl px-4 py-24">{children}</section>;

export default function App() {
  return (
    <main className="overflow-x-hidden">
      <section className="relative grid min-h-screen place-items-center px-6 pt-10 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_35%,rgba(37,99,235,.3),transparent_60%)]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <p className="mb-4 text-xs tracking-[.4em] text-cyan-300">SEE THE WORLD THROUGH AI.</p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-8xl">STARK VISION</h1>
          <p className="mx-auto mt-5 max-w-xl text-white/70">An intelligent vision assistant designed to make the world more accessible.</p>
          <div className="mx-auto my-6 max-w-lg"><GlassesSvg view="persp" /></div>
          <p className="mx-auto mb-6 max-w-xl text-sm text-white/50">Powered by artificial intelligence, STARK VISION helps visually impaired people understand their surroundings through visual analysis and natural voice interaction.</p>
          <div className="flex justify-center gap-3">
            <a href="#tech" className="rounded-full border border-white/20 px-6 py-3">Explore Technology</a>
            <a href="#test" className="rounded-full bg-blue-600 px-6 py-3">Test AI Assistant</a>
          </div>
          <p className="mt-6 text-xs italic text-white/40">Your eyes may not see. AI can help you understand.</p>
        </motion.div>
      </section>
      <S id="tech"><Head k="ANATOMY" t="Inside the glasses" /><Anatomy /></S>
      <S><Head k="PIPELINE" t="How it works" /><HowItWorks /></S>
      <S><Head k="CAPABILITIES" t="Built to understand" /><Features /></S>
      <S id="test"><Head k="LIVE PROTOTYPE" t="TEST STARK VISION" /><TestPanel /></S>
      <S><Head k="SCENARIO" t="A conversation" /><Demo /></S>
      <S><Head k="MISSION" t="About the project" /><About /></S>
      <S><Final /></S>
    </main>
  );
}
