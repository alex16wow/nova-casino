import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { categoryKeywords, gameSets } from '../../data/games.js';
import { useToast } from '../../context/ToastContext.jsx';
import { MOBILE, matches as mediaMatches } from '../../hooks/useMediaQuery.js';
import { asset } from '../../lib/asset.js';
import { Close, Search } from '../ui/icons.jsx';

const normalize = (value) => value.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

// One entry per unique game, with every shelf it appears on.
const catalogue = (() => {
  const unique = new Map();
  Object.entries(gameSets).forEach(([kind, games]) => games.forEach((game) => {
    const key = normalize(game.name) + '|' + normalize(game.provider);
    if (!unique.has(key)) unique.set(key, { name: game.name, provider: game.provider, image: game.image, kinds: [] });
    const item = unique.get(key);
    if (!item.kinds.includes(kind)) item.kinds.push(kind);
  }));
  return [...unique.values()].map((g) => ({
    ...g,
    titleKey: normalize(g.name),
    providerKey: normalize(g.provider),
    index: normalize([g.name, g.provider, ...g.kinds.flatMap((k) => categoryKeywords[k])].join(' ')),
  }));
})();

const search = (q) => {
  const tokens = q.split(' ').filter(Boolean);
  const score = (g) => (g.titleKey === q ? 100 : g.titleKey.startsWith(q) ? 60 : g.titleKey.includes(q) ? 40 : g.providerKey.includes(q) ? 20 : 0);
  return catalogue.filter((g) => tokens.every((t) => g.index.includes(t))).sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
};

// Expandable header search with a live game results listbox.
export default function HeaderSearch({ open, setOpen, wrapRef, slotRef, closeOnOutsideClick }) {
  const toast = useToast();
  const input = useRef(null), toggle = useRef(null), list = useRef(null);
  const [query, setQuery] = useState('');
  const [panelOn, setPanelOn] = useState(false);
  const [active, setActive] = useState(-1);
  const mounted = useRef(false);
  const timers = useRef({});

  const q = normalize(query);
  const results = useMemo(() => (q ? search(q) : []), [q]);
  const shown = open && Boolean(q) && panelOn;

  const refresh = () => { setPanelOn(true); setActive(-1); };
  const hide = () => { setPanelOn(false); setActive(-1); };

  // Focus moves into the field on open and back to the toggle on close.
  useLayoutEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const { current: t } = timers;
    clearTimeout(t.focus);
    cancelAnimationFrame(t.scroll);
    const mobile = mediaMatches(MOBILE);
    if (open) {
      refresh();
      if (mobile) {
        // Mobile browsers scroll the page while the field expands; hold the position.
        const x = window.scrollX, y = window.scrollY, until = performance.now() + 420;
        const hold = () => {
          if (window.scrollY !== y || window.scrollX !== x) window.scrollTo({ left: x, top: y, behavior: 'instant' });
          if (performance.now() < until) t.scroll = requestAnimationFrame(hold);
        };
        t.scroll = requestAnimationFrame(hold);
        t.focus = setTimeout(() => {
          const sx = window.scrollX, sy = window.scrollY;
          input.current.focus({ preventScroll: true });
          window.scrollTo({ left: sx, top: sy, behavior: 'instant' });
        }, 320);
      } else input.current.focus();
    } else {
      setQuery('');
      hide();
      if (mobile) toggle.current.focus({ preventScroll: true });
      else toggle.current.focus();
    }
    return () => { clearTimeout(t.focus); cancelAnimationFrame(t.scroll); };
  }, [open]);

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current.contains(e.target)) return;
      hide();
      if (open && closeOnOutsideClick) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open, closeOnOutsideClick, setOpen, wrapRef]);

  useEffect(() => {
    if (active >= 0) list.current.querySelector(`#game-search-option-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  useEffect(() => { if (list.current) list.current.scrollTop = 0; }, [q]);

  const select = (i) => {
    const game = results[i];
    if (!game) return;
    hide();
    toast(`Play: ${game.name}`);
  };

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const base = shown ? active : -1;
      if (!shown) refresh();
      if (results.length) setActive((base + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (shown && results.length) select(active < 0 ? 0 : active);
    }
  };

  const onBlur = () => queueMicrotask(() => { if (!wrapRef.current.contains(document.activeElement)) hide(); });

  return (
    <div className="search-slot" ref={slotRef}>
      <div
        ref={wrapRef}
        className={`search-wrap expandable-search${open ? ' is-open' : ''}`}
        id="headerSearch"
        onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); setOpen(false); } }}
        onBlur={onBlur}
      >
        <button
          ref={toggle}
          className="search-toggle"
          type="button"
          aria-label={open ? 'Focus search' : 'Open search'}
          aria-expanded={open}
          aria-controls="search"
          onPointerDown={(e) => { if (mediaMatches(MOBILE)) e.preventDefault(); }}
          onClick={() => { if (open) refresh(); else setOpen(true); }}
        >
          <Search />
        </button>
        <input
          ref={input}
          id="search"
          type="search"
          placeholder="Search games, providers, categories..."
          autoComplete="off"
          aria-label="Search games, providers, categories"
          tabIndex={open ? 0 : -1}
          role="combobox"
          aria-autocomplete="list"
          aria-controls="gameSearchResults"
          aria-expanded={shown}
          aria-activedescendant={shown && active >= 0 ? `game-search-option-${active}` : undefined}
          value={query}
          onChange={(e) => { setQuery(e.target.value); refresh(); }}
          onFocus={refresh}
          onKeyDown={onInputKey}
        />
        <button className="search-close" type="button" aria-label="Close search" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          <Close />
        </button>
        <div className="search-results" hidden={!shown}>
          <div className="search-results-heading">
            <span>{q ? 'Search results' : ''}</span>
            <span className="search-results-count" role="status" aria-live="polite">{q ? `${results.length} ${results.length === 1 ? 'game' : 'games'}` : ''}</span>
          </div>
          <div className="search-results-list" id="gameSearchResults" role="listbox" aria-label="Game search results" ref={list}>
            {shown && results.map((g, i) => (
              <button
                key={g.name + g.provider}
                type="button"
                className={`search-result${i === active ? ' is-highlighted' : ''}`}
                id={`game-search-option-${i}`}
                role="option"
                aria-selected={i === active}
                tabIndex={-1}
                onClick={() => select(i)}
                onMouseEnter={() => setActive(i)}
              >
                <img src={asset(g.image)} alt="" loading="lazy" width="46" height="58" />
                <span className="search-result-copy">
                  <span className="search-result-title">{g.name}</span>
                  <span className="search-result-provider">{g.provider}</span>
                  <span className="search-result-category">{g.kinds.map((k) => categoryKeywords[k][0]).join(' · ')}</span>
                </span>
                <span className="search-result-play" aria-hidden="true">PLAY</span>
              </button>
            ))}
            {shown && !results.length && (
              <div className="search-empty">No games found<small>Try another title, provider or category.</small></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
