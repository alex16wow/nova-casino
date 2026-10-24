import { useEffect, useRef, useState } from 'react';

// Cycles panels horizontally: the next panel slides in while the old one slides out.
export default function RotatingStage({ id, items, period, panelClass, render, onChange }) {
  const [panels, setPanels] = useState([{ key: 0, index: 0, phase: 'current' }]);
  const state = useRef({ index: 0, key: 0, busy: false });
  const changed = useRef(onChange);
  changed.current = onChange;

  useEffect(() => {
    let cleanup;
    const timer = setInterval(() => {
      const s = state.current;
      if (s.busy) return;
      s.busy = true;
      s.index = (s.index + 1) % items.length;
      const key = ++s.key;
      setPanels((list) => [...list.map((p) => ({ ...p, phase: 'leave' })), { key, index: s.index, phase: 'enter' }]);
      changed.current?.(s.index);
      cleanup = setTimeout(() => {
        setPanels([{ key, index: s.index, phase: 'current' }]);
        s.busy = false;
      }, 820);
    }, period);
    return () => { clearInterval(timer); clearTimeout(cleanup); };
  }, [items.length, period]);

  return (
    <div className="rotation-stage" id={id}>
      {panels.map((p) => (
        <div
          key={p.key}
          className={`rotating-slide ${panelClass}${p.phase === 'enter' ? ' panel-enter' : p.phase === 'leave' ? ' panel-leave' : ''}`}
          aria-hidden={p.phase === 'leave' ? 'true' : undefined}
        >
          {render(items[p.index])}
        </div>
      ))}
    </div>
  );
}
