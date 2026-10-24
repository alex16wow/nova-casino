import { useRef } from 'react';
import { useScrollThumb } from '../../hooks/useScrollThumb.js';

// Passive scroll indicator shown under horizontally scrolling rows on touch layouts.
export default function ScrollIndicator({ targetRef, className = '', label, controls, hideWhenFits, observe }) {
  const bar = useRef(null), thumb = useRef(null);
  useScrollThumb(targetRef, bar, thumb, { hideWhenFits, observe });
  return (
    <div
      ref={bar}
      className={`category-scrollbar ${className}`.trim()}
      aria-hidden="true"
      aria-label={label}
      aria-orientation="horizontal"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-controls={controls}
      tabIndex={-1}
    >
      <span ref={thumb} className="category-scrollbar-thumb" />
    </div>
  );
}
