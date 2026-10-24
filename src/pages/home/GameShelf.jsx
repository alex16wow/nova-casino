import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gameSets } from '../../data/games.js';
import { TOUCH, matches } from '../../hooks/useMediaQuery.js';
import GameCard from '../../components/ui/GameCard.jsx';
import ScrollIndicator from '../../components/ui/ScrollIndicator.jsx';
import SectionHead from '../../components/ui/SectionHead.jsx';
import { ChevronLeft, ChevronRight } from '../../components/ui/icons.jsx';

const rotate = (list, n) => {
  const k = ((n % list.length) + list.length) % list.length;
  return [...list.slice(k), ...list.slice(0, k)];
};
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Desktop shelf: arrows shift the row by one card and wrap around.
function useShelfCarousel(rowRef, games) {
  const [offset, setOffset] = useState(0);
  const [history, setHistory] = useState(0);
  const [move, setMove] = useState(0);
  const busy = useRef(false);

  const step = (direction) => {
    if (matches(TOUCH) || busy.current || (direction < 0 && history === 0) || games.length < 2) return;
    busy.current = true;
    setMove(direction);
  };

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!move) { row.scrollLeft = 0; return; }
    // One temporary edge copy makes the wrap continuous while the real cards keep their state.
    const cards = row.children, distance = cards[1].offsetLeft - cards[0].offsetLeft;
    row.scrollLeft = move > 0 ? 0 : distance;
    const from = row.scrollLeft, to = move > 0 ? distance : 0;
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420;
    let started, frame;
    const tick = (now) => {
      started ??= now;
      const t = duration ? Math.min(1, (now - started) / duration) : 1;
      row.scrollLeft = from + (to - from) * ease(t);
      if (t < 1) frame = requestAnimationFrame(tick);
      else {
        setOffset((o) => o + move);
        setHistory((h) => h + move);
        setMove(0);
        busy.current = false;
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [move, rowRef]);

  const ordered = rotate(games, offset);
  const cards = ordered.map((game) => ({ game, key: game.name }));
  if (move > 0) cards.push({ game: ordered[0], key: 'carousel-copy', copy: true });
  if (move < 0) cards.unshift({ game: ordered[ordered.length - 1], key: 'carousel-copy', copy: true });

  return { cards, moving: move !== 0, atStart: history === 0, step, reset: () => { setOffset(0); setHistory(0); } };
}

// Touch shelves become a scrollable grid: one row on tablets, two mirrored rows on phones.
function touchGrid(games, mobile, isShows) {
  const sequence = Array.from({ length: isShows ? 4 : mobile ? 8 : 16 }, (_, i) => games[i % games.length]);
  const rows = mobile ? [sequence, [...sequence].reverse()] : [sequence];
  return rows.flatMap((cards, r) => cards.map((game, c) => ({ game, key: `${r}-${c}`, style: { gridRow: String(r + 1), gridColumn: String(c + 1) } })));
}

export default function GameShelf({ shelf, mobile, touch }) {
  const row = useRef(null);
  const games = gameSets[shelf.kind];
  const carousel = useShelfCarousel(row, games);
  const layout = touch ? (mobile ? 'mobile' : 'tablet') : 'desktop';
  const { reset } = carousel;
  useEffect(() => reset(), [layout]); // eslint-disable-line react-hooks/exhaustive-deps

  const cards = touch ? touchGrid(games, mobile, shelf.kind === 'shows') : carousel.cards;
  const sectionClass = ['section', touch && `${layout}-games-section`].filter(Boolean).join(' ');
  const rowClass = ['game-row', shelf.eight && 'eight', carousel.moving && 'is-moving', touch && `${layout}-game-grid`].filter(Boolean).join(' ');

  return (
    <section className={sectionClass} id={shelf.id}>
      <SectionHead icon={shelf.icon} title={shelf.title} sub={shelf.sub} href={`#${shelf.id}`}>
        <div className="row-controls">
          <button className="row-arrow" data-carousel={shelf.rowId} data-direction="previous" aria-label={`Previous ${shelf.label}`} aria-controls={shelf.rowId} disabled={carousel.atStart} aria-disabled={carousel.atStart} onClick={() => carousel.step(-1)}><ChevronLeft /></button>
          <button className="row-arrow" data-carousel={shelf.rowId} data-direction="next" aria-label={`Next ${shelf.label}`} aria-controls={shelf.rowId} onClick={() => carousel.step(1)}><ChevronRight /></button>
        </div>
      </SectionHead>
      <div className={rowClass} id={shelf.rowId} ref={row} key={layout}>
        {cards.map((c) => <GameCard key={c.key} game={c.game} copy={c.copy} style={c.style} />)}
      </div>
      {touch && <ScrollIndicator targetRef={row} className="mobile-game-scrollbar" label={`Scroll ${shelf.title} games`} controls={shelf.rowId} hideWhenFits={!mobile} key={`bar-${layout}`} />}
    </section>
  );
}
