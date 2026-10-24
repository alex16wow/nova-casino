import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { livePages, pageHref, sidebarGroups, supportLink } from '../../data/navigation.js';
import { NavIcon } from '../ui/icons.jsx';

// Links to pages that don't exist yet stay inert.
const ignore = (e) => e.preventDefault();

function NavLink({ link }) {
  const { pathname } = useLocation();
  if (livePages.has(link.page)) {
    const active = pathname === `/${link.page}`;
    return (
      <Link className={`nav-link${active ? ' active' : ''}`} to={`/${link.page}`} aria-current={active ? 'page' : undefined}>
        <NavIcon name={link.icon} />
        {link.wrap ? <span>{link.label}</span> : link.label}
      </Link>
    );
  }
  return (
    <a className="nav-link" href={pageHref(link.page)} data-future-page={link.page} onClick={ignore}>
      <NavIcon name={link.icon} />
      {link.wrap ? <span>{link.label}</span> : link.label}
    </a>
  );
}

// Sidebar on desktop, slide-in drawer on touch layouts.
export default function Sidebar({ touch, open, setOpen }) {
  const drawer = useRef(null);
  const swipe = useRef(null);
  const hidden = touch && !open;

  useEffect(() => { drawer.current.inert = hidden; }, [hidden]);

  // Swiping left closes the drawer.
  const start = (x, y, id) => { if (open) swipe.current = { x, y, id }; };
  const end = (x, y, id) => {
    const s = swipe.current;
    if (!s || (id !== undefined && id !== s.id)) return;
    swipe.current = null;
    const dx = x - s.x, dy = y - s.y;
    if (dx < -55 && Math.abs(dx) > Math.abs(dy) * 1.25) setOpen(false);
  };

  return (
    <aside
      ref={drawer}
      className={`sidebar${touch && open ? ' is-mobile-open' : ''}`}
      id="sidebar"
      aria-hidden={touch ? String(!open) : undefined}
      onClick={(e) => { if (touch && e.target.closest('a')) setOpen(false); }}
      onPointerDown={(e) => start(e.clientX, e.clientY, e.pointerId)}
      onPointerUp={(e) => end(e.clientX, e.clientY, e.pointerId)}
      onPointerCancel={() => { swipe.current = null; }}
      onTouchStart={(e) => { if (e.touches.length === 1) start(e.touches[0].clientX, e.touches[0].clientY); }}
      onTouchEnd={(e) => { if (e.changedTouches.length) end(e.changedTouches[0].clientX, e.changedTouches[0].clientY); }}
    >
      {sidebarGroups.map((group) => (
        <nav key={group.label} className={`nav-group${group.className ? ' ' + group.className : ''}`} aria-label={group.label}>
          {group.links.map((link) => <NavLink key={link.page} link={link} />)}
        </nav>
      ))}
      <NavLink link={supportLink} />
      <div className="sidebar-note"><b>Play brighter. Play <span>responsibly.</span></b>Set a limit and keep every session in balance.</div>
    </aside>
  );
}

// Thin passive scroll indicator for the mobile drawer.
export function DrawerScrollIndicator({ open }) {
  const indicator = useRef(null), thumb = useRef(null);
  useEffect(() => {
    const drawer = document.getElementById('sidebar'), header = document.querySelector('.topbar');
    const mobile = matchMedia('(max-width:680px)'), viewport = window.visualViewport;
    const el = indicator.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!mobile.matches) { drawer.style.removeProperty('--mobile-drawer-scroll-height'); el.hidden = true; return; }
      const available = (viewport ? viewport.height : innerHeight) - header.offsetHeight - 73;
      drawer.style.setProperty('--mobile-drawer-scroll-height', Math.max(0, available) + 'px');
      const max = drawer.scrollHeight - drawer.clientHeight;
      el.hidden = !drawer.classList.contains('is-mobile-open') || max <= 1;
      if (el.hidden) return;
      const rect = drawer.getBoundingClientRect(), track = Math.max(0, rect.height - 16);
      const size = Math.min(track, Math.max(24, (track * drawer.clientHeight) / drawer.scrollHeight));
      el.style.left = rect.right - 6 + 'px';
      el.style.top = rect.top + 8 + 'px';
      el.style.height = track + 'px';
      thumb.current.style.height = size + 'px';
      thumb.current.style.transform = 'translateY(' + ((track - size) * drawer.scrollTop) / max + 'px)';
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(drawer);
    drawer.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    viewport?.addEventListener('resize', schedule, { passive: true });
    mobile.addEventListener('change', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      drawer.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      viewport?.removeEventListener('resize', schedule);
      mobile.removeEventListener('change', schedule);
    };
  }, [open]);
  return <div ref={indicator} className="mobile-drawer-scroll-indicator" aria-hidden="true" hidden><span ref={thumb} /></div>;
}
