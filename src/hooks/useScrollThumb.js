import { useEffect } from 'react';

// Drives a passive horizontal scroll indicator (.category-scrollbar) for a scrolling element.
export function useScrollThumb(targetRef, barRef, thumbRef, { enabled = true, hideWhenFits = false, observe = [] } = {}) {
  useEffect(() => {
    const target = targetRef.current, bar = barRef.current, thumb = thumbRef.current;
    if (!enabled || !target || !bar || !thumb) return;
    const update = () => {
      const max = Math.max(0, target.scrollWidth - target.clientWidth), track = bar.clientWidth;
      const width = max ? Math.max(24, (track * target.clientWidth) / target.scrollWidth) : track;
      bar.hidden = hideWhenFits && max <= 1;
      thumb.style.width = width + 'px';
      thumb.style.transform = `translateX(${max ? ((track - width) * target.scrollLeft) / max : 0}px)`;
      bar.setAttribute('aria-valuenow', String(Math.round(max ? (100 * target.scrollLeft) / max : 0)));
    };
    const frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(target);
    observe.forEach((ref) => ref.current && observer.observe(ref.current));
    target.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      target.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [enabled, hideWhenFits, targetRef, barRef, thumbRef]);
}
