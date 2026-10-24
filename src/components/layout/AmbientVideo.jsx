import { useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext.jsx';
import { asset } from '../../lib/asset.js';

// Looping background video; paused while the tab is hidden and held still with reduced motion.
export default function AmbientVideo() {
  const video = useRef(null);
  const { reduceMotion } = useSettings();
  useEffect(() => {
    const v = video.current;
    v.muted = true;
    v.volume = 0;
    const sync = () => (document.hidden || reduceMotion ? v.pause() : v.play().catch(() => {}));
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => document.removeEventListener('visibilitychange', sync);
  }, [reduceMotion]);
  return (
    <video ref={video} id="ambientVideo" className="ambient-video" autoPlay={!reduceMotion} loop muted playsInline preload="auto" aria-hidden="true" tabIndex={-1} disablePictureInPicture>
      <source src={asset('ambient-nebula-pingpong.mp4')} type="video/mp4" />
    </video>
  );
}
