import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Close } from './icons.jsx';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Dialog over a blurred page. Traps focus, closes on Escape or a backdrop click,
// and returns focus to whatever opened it. Full screen on phones.
export default function Modal({ open, onClose, title, subtitle, children, size = 'md', labelledBy, focusKey }) {
  const dialog = useRef(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    const root = document.documentElement;
    root.classList.add('modal-open');
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current(); return; }
      if (e.key !== 'Tab') return;
      const items = [...dialog.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const firstItem = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstItem) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); firstItem.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      root.classList.remove('modal-open');
      if (opener instanceof HTMLElement && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open]);

  // Focus the preferred field on open and whenever the dialog switches content.
  useEffect(() => {
    if (!open) return;
    (dialog.current.querySelector('[data-autofocus]') ?? dialog.current.querySelector(FOCUSABLE))?.focus();
  }, [open, focusKey]);

  if (!open) return null;
  return createPortal(
    <div className="nv-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={dialog} className={`nv-modal nv-modal--${size}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy ?? titleId}>
        <button type="button" className="nv-modal-close" aria-label="Close" onClick={onClose}><Close /></button>
        {title && (
          <header className="nv-modal-head">
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
