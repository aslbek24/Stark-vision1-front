// Local, fast detection layer (COCO-SSD lite). Runs in-browser; separate from Grok reasoning.
// NOTE: COCO has no door/wall/stairs/window classes. Those come from Grok vision only.
import type { ObjectDetection } from '@tensorflow-models/coco-ssd';
let model: Promise<ObjectDetection> | null = null;
const load = () => (model ??= (async () => {
  await import('@tensorflow/tfjs');
  const m = await import('@tensorflow-models/coco-ssd');
  return m.load({ base: 'lite_mobilenet_v2' });
})());
export const UZ: Record<string, string> = {
  person: 'odam', chair: 'stul', 'dining table': 'stol', car: 'mashina', couch: 'divan', tv: 'televizor',
  laptop: 'noutbuk', bottle: 'shisha', bench: 'skameyka', 'potted plant': "o'simlik", bicycle: 'velosiped', truck: 'yuk mashinasi', bus: 'avtobus',
};
export type Det = { label: string; score: number; pos: 'chap' | 'oldingizda' | "o'ng"; area: number };
export async function detect(v: HTMLVideoElement): Promise<Det[]> {
  const W = v.videoWidth, H = v.videoHeight;
  if (!W) return [];
  const m = await load();
  return (await m.detect(v, 8, 0.55)).map((r) => {
    const cx = (r.bbox[0] + r.bbox[2] / 2) / W;
    return { label: r.class, score: r.score, pos: cx < 0.35 ? 'chap' : cx > 0.65 ? "o'ng" : 'oldingizda', area: (r.bbox[2] * r.bbox[3]) / (W * H) };
  });
}
