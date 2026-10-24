import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { screenKey, useSupport } from '../../context/SupportContext.jsx';
import { useBreakpoint } from '../../hooks/useMediaQuery.js';
import SupportArticle from './SupportArticle.jsx';
import { SupportCategory, SupportHelp } from './SupportHelp.jsx';
import SupportHome from './SupportHome.jsx';
import { SupportChat, SupportMessages } from './SupportMessages.jsx';
import SupportNav from './SupportNav.jsx';

// Visible element that opened the panel, or the drawer burger when Support sits in a closed drawer.
const returnFocus = () => {
  const toggle = document.getElementById('supportToggle');
  const target = toggle && toggle.offsetParent && !toggle.closest('[inert]') ? toggle : document.getElementById('menuToggle');
  target?.focus({ preventScroll: true });
};

// Floating support panel (bottom right; full screen on phones). Opened by Support in the sidebar.
// The page stays usable behind it on larger screens; Escape or the close button hides it.
export default function SupportWidget() {
  const { open, close, state } = useSupport();
  const { mobile } = useBreakpoint();
  const panel = useRef(null);

  const stack = state.stacks[state.tab];
  const screen = stack[stack.length - 1] ?? { type: 'root' };
  const key = screenKey(state.tab, stack);

  useEffect(() => {
    if (!open) return;
    panel.current.focus({ preventScroll: true });
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      returnFocus();
    };
  }, [open, close]);

  // A screen change removes the focused button: keep focus inside the panel.
  useEffect(() => {
    if (open && !panel.current.contains(document.activeElement)) panel.current.focus({ preventScroll: true });
  }, [open, key]);

  // Phones: lock the page and fit the panel to the visible viewport, so the keyboard never covers the composer.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('support-open', open);
    if (!open || !mobile) return () => root.classList.remove('support-open');
    const viewport = window.visualViewport;
    const fit = () => {
      if (!viewport) return;
      panel.current.style.setProperty('--support-top', viewport.offsetTop + 'px');
      panel.current.style.setProperty('--support-height', viewport.height + 'px');
    };
    fit();
    viewport?.addEventListener('resize', fit);
    viewport?.addEventListener('scroll', fit);
    return () => {
      viewport?.removeEventListener('resize', fit);
      viewport?.removeEventListener('scroll', fit);
      root.classList.remove('support-open');
    };
  }, [open, mobile]);

  if (!open) return null;

  const showNav = screen.type !== 'article' && screen.type !== 'chat';
  let content;
  if (screen.type === 'article') content = <SupportArticle key={key} id={screen.id} screenKey={key} />;
  else if (screen.type === 'category') content = <SupportCategory key={key} id={screen.id} screenKey={key} />;
  else if (screen.type === 'chat') content = <SupportChat />;
  else if (state.tab === 'messages') content = <SupportMessages screenKey={key} />;
  else if (state.tab === 'help') content = <SupportHelp screenKey={key} />;
  else content = <SupportHome screenKey={key} />;

  return createPortal(
    <section ref={panel} className="nv-support" id="supportPanel" role="dialog" aria-modal={mobile || undefined} aria-labelledby="nv-support-title" tabIndex={-1}>
      {content}
      {showNav && <SupportNav />}
    </section>,
    document.body,
  );
}
