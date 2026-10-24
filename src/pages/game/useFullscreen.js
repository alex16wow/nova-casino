import { useCallback, useEffect, useState } from 'react';

// Native fullscreen for the game frame. Where the browser refuses (iOS Safari, embedded previews)
// the frame is pinned over the page with CSS instead.
export function useFullscreen(ref) {
  const [native, setNative] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const onChange = () => setNative(document.fullscreenElement === ref.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [ref]);

  useEffect(() => {
    if (!pinned) return;
    document.documentElement.classList.add('nv-game-pinned');
    const onKey = (e) => e.key === 'Escape' && setPinned(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('nv-game-pinned');
      document.removeEventListener('keydown', onKey);
    };
  }, [pinned]);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) return document.exitFullscreen();
    if (pinned) return setPinned(false);
    const el = ref.current;
    if (el?.requestFullscreen) el.requestFullscreen().catch(() => setPinned(true));
    else setPinned(true);
  }, [ref, pinned]);

  const exit = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    setPinned(false);
  }, []);

  return { active: native || pinned, pinned, toggle, exit };
}
