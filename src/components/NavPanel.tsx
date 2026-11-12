import { useRef, useState, type RefObject } from 'react';
import { Navigation, Square } from 'lucide-react';
import { startNavigation } from '../services/navigation';

export default function NavPanel({ video, camOn }: { video: RefObject<HTMLVideoElement>; camOn: boolean }) {
  const [ok, setOk] = useState(false), [run, setRun] = useState(false), [st, setSt] = useState('');
  const stop = useRef<null | (() => void)>(null);
  const toggle = () => {
    if (run) { stop.current?.(); return; }
    if (!video.current) return;
    setRun(true);
    stop.current = startNavigation({ video: video.current, target: 'eshik', onStatus: setSt, onDone: () => setRun(false) });
  };
  return (
    <div className="space-y-2 rounded-lg border border-cyan-400/20 p-3 text-xs">
      <label className="flex gap-2"><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} />
        A sighted safety supervisor is present and the presenter stays stationary.</label>
      <button disabled={!camOn || (!ok && !run)} onClick={toggle}
        className="flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 disabled:opacity-40">
        {run ? <><Square size={14} /> Stop</> : <><Navigation size={14} /> Take me to the door</>}
      </button>
      {st && <p className="text-white/70">{st}</p>}
      <p className="text-white/40">Experimental. Cannot detect every hazard (drop-offs, glass, objects out of view).</p>
    </div>
  );
}
