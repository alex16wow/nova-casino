import { useLayoutEffect, useRef } from 'react';
import { useSupport } from '../../context/SupportContext.jsx';
import { ChevronLeft, Close } from '../ui/icons.jsx';

// Building blocks shared by every support screen: header, scroll area and the close button.

export function CloseButton({ className = '' }) {
  const { close } = useSupport();
  return (
    <button type="button" className={`nv-support-icon-btn ${className}`} aria-label="Close support" onClick={close}>
      <Close />
    </button>
  );
}

export function SupportHeader({ title, subtitle, back = false, titleId }) {
  const support = useSupport();
  return (
    <header className={`nv-support-head${back ? ' has-back' : ''}`}>
      {back && (
        <button type="button" className="nv-support-icon-btn" aria-label="Back" onClick={support.back}>
          <ChevronLeft />
        </button>
      )}
      <div className="nv-support-head-title">
        {title && <h2 id={titleId}>{title}</h2>}
        {subtitle && <p>{subtitle}</p>}
      </div>
      <CloseButton />
    </header>
  );
}

// The only scrolling part of a screen. Remembers its position per screen, so closing the panel
// or coming back from a deeper screen returns to the same place. `bottomKey` pins it to the end
// whenever the value changes (chat).
export function SupportScroll({ screenKey, bottomKey, className = '', children }) {
  const { getScroll, saveScroll } = useSupport();
  const el = useRef(null);

  useLayoutEffect(() => {
    if (bottomKey === undefined) el.current.scrollTop = getScroll(screenKey);
  }, [screenKey, bottomKey, getScroll]);

  useLayoutEffect(() => {
    if (bottomKey !== undefined) el.current.scrollTop = el.current.scrollHeight;
  }, [bottomKey]);

  return (
    <div ref={el} className={`nv-support-scroll ${className}`} onScroll={(e) => saveScroll(screenKey, e.currentTarget.scrollTop)}>
      {children}
    </div>
  );
}
