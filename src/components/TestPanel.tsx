import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, Send, Square, Repeat, Loader2, ShieldAlert } from 'lucide-react';
import { startCamera, stopCamera, captureFrame } from '../services/camera';
import { listen, speak, stopSpeaking, speechRecognitionSupported } from '../services/speech';
import { analyze, getMode } from '../services/ai';
import { detect, UZ, type Det } from '../services/detector';
import NavPanel from './NavPanel';

type Msg = { who: 'user' | 'ai'; text: string; demo?: boolean };
type State = 'idle' | 'listening' | 'thinking' | 'speaking';
type RecognitionHandle = { stop(): void; abort(): void };

export default function TestPanel() {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const recognition = useRef<RecognitionHandle | null>(null);
  const [camOn, setCamOn] = useState(false);
  const [state, setState] = useState<State>('idle');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'live' | 'demo' | 'offline'>('offline');
  const [cont, setCont] = useState(false), [detOn, setDetOn] = useState(false), [dets, setDets] = useState<Det[]>([]);
  const contRef = useRef(false);
  contRef.current = cont;

  useEffect(() => {
    getMode().then(setMode);
    return () => {
      recognition.current?.abort();
      stopSpeaking();
      stopCamera(stream.current);
    };
  }, []);

  const toggleCam = async () => {
    setError('');
    if (camOn) {
      stopCamera(stream.current); stream.current = null; setCamOn(false); return;
    }
    try {
      stream.current = await startCamera(video.current!);
      setCamOn(true);
    } catch (e: any) {
      setError(e.name === 'NotAllowedError' ? 'Kameraga ruxsat berilmadi. Brauzer sozlamalaridan ruxsat bering.' : e.message);
    }
  };

  const ask = async (question: string) => {
    if (!question.trim()) return;
    recognition.current = null;
    setMsgs((messages) => [...messages, { who: 'user', text: question }]);
    setState('thinking'); setError('');
    try {
      const frame = camOn && video.current ? captureFrame(video.current) : null;
      const prompt = frame ? question : `${question} (Kamera yoqilmagan, rasm yo‘q — buni aniq ayting.)`;
      const result = await analyze(prompt, frame);
      setMsgs((messages) => [...messages, { who: 'ai', text: result.text, demo: result.demo }]);
      setState('speaking');
      speak(result.text, () => {
        setState('idle');
        if (contRef.current) window.setTimeout(() => startListening(), 500);
      });
    } catch (e: any) {
      setError(e.message || 'AI so‘rovini bajarib bo‘lmadi.');
      setState('idle');
    }
  };

  const startListening = () => {
    if (!speechRecognitionSupported) {
      setError('Brauzer ovozli kiritishni qo‘llamaydi. Chrome yoki Edge’dan foydalaning, yoki pastdagi maydonga yozing.');
      return;
    }
    stopSpeaking();
    setError(''); setState('listening');
    recognition.current = listen(
      (transcript) => { recognition.current = null; void ask(transcript); },
      (message) => setError(message),
      () => setState((current) => current === 'listening' ? 'idle' : current),
    );
  };

  const toggleMic = () => {
    if (state === 'listening') {
      recognition.current?.stop(); recognition.current = null; setState('idle'); return;
    }
    if (state === 'speaking') { stopSpeaking(); setState('idle'); return; }
    if (state === 'thinking') return;
    startListening();
  };

  const last = [...msgs].reverse().find((message) => message.who === 'ai');
  useEffect(() => {
    if (!detOn || !camOn) { setDets([]); return; }
    let alive = true, busy = false;
    const timer = window.setInterval(async () => {
      if (busy || !video.current) return;
      busy = true;
      try { const detections = await detect(video.current); if (alive) setDets(detections); }
      catch { if (alive) { setError('Mahalliy obyekt aniqlash modeli yuklanmadi. Internetni tekshiring.'); setDetOn(false); } }
      finally { busy = false; }
    }, 1500);
    return () => { alive = false; window.clearInterval(timer); };
  }, [detOn, camOn]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 lg:aspect-video">
        <video ref={video} playsInline muted className="h-full w-full object-cover" />
        {!camOn && <div className="absolute inset-0 grid place-items-center text-white/50">Camera is off</div>}
        {state === 'thinking' && <div className="absolute inset-x-0 top-0 h-1 animate-pulse bg-cyan-400" />}
        <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs">
          API: {mode === 'live' ? '🟢 Live Gemini' : mode === 'demo' ? '🟡 Demo mode' : '🔴 Backend offline'}
        </div>
        <div className="absolute bottom-3 left-3 flex max-w-[70%] flex-wrap gap-1">
          {dets.map((d, index) => <span key={index} className="rounded bg-cyan-500/80 px-2 py-0.5 text-[11px] text-black">{UZ[d.label] ?? d.label} · {d.pos}</span>)}
        </div>
        <button onClick={toggleCam} className="absolute bottom-3 right-3 rounded-full bg-black/60 p-3 hover:bg-blue-600" aria-label="Kamerani yoqish yoki o‘chirish">
          {camOn ? <CameraOff size={20} /> : <Camera size={20} />}
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-neutral-950 p-4">
        <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-200">
          <ShieldAlert size={16} className="shrink-0" />
          Tajriba prototipi. Sertifikatlangan harakatlanish vositasi emas. Taqdimotchi joyida tursin yoki ko‘zi ko‘radigan nazoratchi yonida bo‘lsin.
        </div>
        <div className="min-h-40 flex-1 space-y-2 overflow-y-auto">
          {msgs.map((message, index) => (
            <div key={index} className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${message.who === 'user' ? 'ml-auto bg-blue-600' : 'bg-white/10'}`}>
              {message.demo && <b className="mr-1 text-amber-300">[DEMO]</b>}{message.text}
            </div>
          ))}
          {state === 'thinking' && <div className="flex items-center gap-2 text-sm text-cyan-300"><Loader2 className="animate-spin" size={16} />Tahlil qilyapman…</div>}
        </div>
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={toggleMic}
            disabled={!speechRecognitionSupported || state === 'thinking'}
            className={`grid h-16 w-16 place-items-center rounded-full ${state === 'listening' ? 'animate-pulse bg-cyan-500' : 'bg-blue-600'} disabled:cursor-not-allowed disabled:opacity-40`}
            aria-label={state === 'listening' ? 'Ovoz yozishni to‘xtatish' : 'Mikrofon'}
            title={!speechRecognitionSupported ? 'Bu brauzer SpeechRecognition’ni qo‘llamaydi' : 'Gapirish uchun bosing'}
          >
            {state === 'speaking' ? <Square /> : <Mic />}
          </button>
          <button onClick={() => last && speak(last.text)} disabled={!last} className="rounded-full bg-white/10 p-3 disabled:opacity-40" aria-label="Oxirgi javobni qayta eshittirish"><Repeat size={18} /></button>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-white/70">
          <label className="flex gap-1"><input type="checkbox" checked={cont} onChange={(e) => setCont(e.target.checked)} />Davomli suhbat</label>
          <label className="flex gap-1"><input type="checkbox" checked={detOn} onChange={(e) => setDetOn(e.target.checked)} />Mahalliy aniqlash</label>
        </div>
        {!speechRecognitionSupported && <p className="text-xs text-amber-300">Ovozli kiritish bu brauzerda mavjud emas. Google Chrome yoki Microsoft Edge’dan foydalaning; matn maydoni ham ishlaydi.</p>}
        <NavPanel video={video} camOn={camOn} />
        <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); const question = text; setText(''); void ask(question); }}>
          <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Oldimda nima bor?" className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm outline-none" />
          <button type="submit" disabled={!text.trim() || state === 'thinking'} className="rounded-lg bg-blue-600 px-3 disabled:opacity-40"><Send size={16} /></button>
        </form>
      </div>
    </div>
  );
}
