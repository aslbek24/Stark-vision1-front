import { analyze } from './ai';
import { captureFrame } from './camera';
import { detect, UZ } from './detector';
import { speak, stopSpeaking } from './speech';

const say = (t: string) => new Promise<void>((res) => { const to = setTimeout(res, 12000); speak(t, () => { clearTimeout(to); res(); }); });
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const PROMPT = (t: string) =>
  `Men "${t}" qidiryapman. Faqat rasmda aniq ko'ringan narsani ayting: ${t} ko'rinyaptimi va kadrning chap, markaz yoki o'ng qismidami? ` +
  `Ko'rinmasa, kamerani joyida sekin burishni ayting. Foydalanuvchiga oldinga yurishni buyurmang. Aniq bo'lmasa: "To'xtang, yordamchidan yordam so'rang." deng.`;

/** Repeated observe→speak loop (max 20 rounds). Local detector can pre-empt Grok with a stop warning. */
export function startNavigation(o: { video: HTMLVideoElement; target: string; onStatus: (s: string) => void; onDone: () => void }) {
  let stopped = false;
  (async () => {
    try {
      await say("Eshikni qidiryapman. Joyingizda turing va kamerani sekin buring.");
      for (let i = 0; i < 20 && !stopped; i++) {
        o.onStatus(`Checking surroundings (${i + 1}/20)…`);
        const dets = await detect(o.video).catch(() => []);
        const block = dets.find((d) => d.pos === 'oldingizda' && d.area > 0.2);
        let msg: string;
        if (block) msg = `Oldingizda ${UZ[block.label] ?? block.label} juda yaqin ko'rinmoqda. To'xtang.`;
        else {
          const f = captureFrame(o.video);
          if (!f) { o.onStatus('No camera frame.'); break; }
          const r = await analyze(PROMPT(o.target), f);
          if (r.demo) { o.onStatus('Demo mode: navigation needs a live API key.'); break; }
          msg = r.text;
        }
        if (stopped) break;
        o.onStatus(msg); await say(msg); await wait(2500);
      }
    } catch (e: any) {
      o.onStatus('Navigation error: ' + e.message);
      await say("Xatolik. To'xtang va yordamchidan yordam so'rang.");
    } finally { o.onDone(); }
  })();
  return () => { stopped = true; stopSpeaking(); o.onStatus('Stopped.'); };
}
