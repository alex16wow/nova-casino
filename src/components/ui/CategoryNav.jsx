import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { lobbyCategories } from '../../data/lobby.jsx';
import { asset } from '../../lib/asset.js';
import ScrollIndicator from './ScrollIndicator.jsx';

// Category strip (home page and category pages). `current` marks the open page.
export default function CategoryNav({ touch, current }) {
  const nav = useRef(null), down = useRef(null), timer = useRef();
  // Brief highlight on tap, since touch has no hover.
  const flash = (el) => {
    if (!touch) return;
    clearTimeout(timer.current);
    nav.current.querySelectorAll('.is-tapped').forEach((e) => e.classList.remove('is-tapped'));
    el.classList.add('is-tapped');
    timer.current = setTimeout(() => el.classList.remove('is-tapped'), 240);
  };
  useEffect(() => { if (!touch) nav.current.querySelectorAll('.is-tapped').forEach((e) => e.classList.remove('is-tapped')); }, [touch]);
  // Scrolled strips keep the open category in view.
  useEffect(() => {
    const el = nav.current, item = el.querySelector('.current');
    if (touch && item) el.scrollLeft = item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2;
  }, [touch, current]);

  const categories = (
    <nav
      ref={nav}
      className="categories"
      aria-label="Game categories"
      id="gameCategories"
      onPointerDown={(e) => { if (touch) down.current = { x: e.clientX, y: e.clientY, target: e.target.closest('.category') }; }}
      onPointerUp={(e) => {
        const d = down.current;
        if (!d) return;
        down.current = null;
        if (Math.abs(e.clientX - d.x) < 12 && Math.abs(e.clientY - d.y) < 12 && d.target) flash(d.target);
      }}
      onPointerCancel={() => { down.current = null; }}
      onClick={(e) => { if (e.detail === 0) { const el = e.target.closest('.category'); if (el) flash(el); } }}
    >
      {lobbyCategories.map((c) => (
        <Link key={c.page} className={`category${c.page === current ? ' current' : ''}`} to={`/${c.page}`} aria-current={c.page === current ? 'page' : undefined}>
          <span className="category-icon-frame"><img className="category-icon" src={asset(c.icon)} alt="" width="60" height="60" /></span>
          {c.label}
        </Link>
      ))}
    </nav>
  );

  if (!touch) return categories;
  return (
    <div className="mobile-category-scroll">
      {categories}
      <ScrollIndicator targetRef={nav} label="Scroll game categories" controls="gameCategories" />
    </div>
  );
}
