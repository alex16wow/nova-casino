import { useEffect, useRef } from 'react';
import { asset } from '../../lib/asset.js';

// Looping background video; paused while the tab is hidden.
export default function AmbientVideo() {
  const video = useRef(null);
  useEffect(() => {
    const v = video.current;
    v.muted = true;
    v.volume = 0;
    const onVisibility = () => (document.hidden ? v.pause() : v.play().catch(() => {}));
    document.addEventListener('visibilitychange', onVisibility);
    v.play().catch(() => {});
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);
  return (
    <video ref={video} id="ambientVideo" className="ambient-video" autoPlay loop muted playsInline preload="auto" aria-hidden="true" tabIndex={-1} disablePictureInPicture>
      <source src={asset('ambient-nebula-pingpong.mp4')} type="video/mp4" />
    </video>
  );
}
