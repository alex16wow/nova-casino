import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { tournaments, winners } from '../../data/lobby.jsx';
import { useAccountPreview } from '../../context/AuthContext.jsx';
import { asset } from '../../lib/asset.js';
import RotatingStage from '../../components/ui/RotatingStage.jsx';

const pad = (n) => String(n).padStart(2, '0');

function useNow(interval) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(timer);
  }, [interval]);
  return now;
}

function Countdown({ end, now }) {
  const total = Math.max(0, Math.ceil((end - now) / 1000));
  const parts = [['days', 'd', Math.floor(total / 86400)], ['hours', 'h', Math.floor(total / 3600) % 24], ['minutes', 'm', Math.floor(total / 60) % 60]];
  return (
    <div className="tournament-countdown" data-end={end} aria-label="Time remaining">
      {parts.map(([unit, short, value], i) => (
        <Fragment key={unit}>
          {i > 0 && <span className="clock-colon" aria-hidden="true">:</span>}
          <span className="clock-part"><span className="clock-value"><b data-unit={unit}>{pad(value)}</b><small>{short}</small></span></span>
        </Fragment>
      ))}
    </div>
  );
}

function TournamentCard() {
  const now = useNow(1000);
  const preview = useAccountPreview();
  return (
    <article className="rail-card tournament-card" aria-label="Tournaments">
      <RotatingStage
        id="tournamentStage"
        items={tournaments}
        period={8000}
        panelClass="tournament-slide"
        render={(t) => (
          <>
            <div className={`tournament-surface ${t.tone}`} aria-hidden="true" />
            <h3>{t.name}</h3>
            <div className="prize">{t.prize}</div>
            <Countdown end={t.end} now={now} />
            <button className="primary action-toast" onClick={preview}>Join now</button>
          </>
        )}
      />
    </article>
  );
}

// Three visible rows; every 5s the list scrolls up by one.
function WinnersCard() {
  const windowRef = useRef(null), track = useRef(null);
  const [start, setStart] = useState(0);
  const [incoming, setIncoming] = useState(false);

  useLayoutEffect(() => {
    const size = () => track.current.style.setProperty('--winner-row-height', `${windowRef.current.clientHeight / 3}px`);
    const observer = new ResizeObserver(size);
    observer.observe(windowRef.current);
    size();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let settle;
    const timer = setInterval(() => {
      flushSync(() => setIncoming(true));
      const height = windowRef.current.clientHeight / 3, el = track.current;
      el.style.transition = 'transform 650ms cubic-bezier(.22,.7,.2,1)';
      requestAnimationFrame(() => { el.style.transform = `translateY(-${height}px)`; });
      settle = setTimeout(() => {
        flushSync(() => {
          setIncoming(false);
          setStart((i) => i + 1);
        });
        el.style.transition = 'none';
        el.style.transform = 'translateY(0)';
      }, 680);
    }, 5000);
    return () => { clearInterval(timer); clearTimeout(settle); };
  }, []);

  const rows = Array.from({ length: incoming ? 4 : 3 }, (_, i) => ({ w: winners[(start + i) % winners.length], key: start + i }));

  return (
    <article className="rail-card winners">
      <h3>Latest Winners <span style={{ color: '#9fa3c5', fontSize: '10px', fontWeight: 500 }}> · just now</span></h3>
      <div className="winners-window" id="winnersWindow" ref={windowRef}>
        <div className="winners-track" id="winnersTrack" ref={track}>
          {rows.map(({ w, key }) => (
            <div key={key} className="winner">
              <img className="avatar" src={asset(w.avatar)} alt={w.name} />
              <span className="winner-name">{w.name}<small>{w.game}</small></span>
              <strong>{w.win}</strong>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

// Tournaments and latest winners. Beside the hero on desktop, above the FAQ on touch layouts.
export default function RightRail({ secondary }) {
  return (
    <aside className={`right-rail${secondary ? ' mobile-secondary-rail' : ''}`}>
      <TournamentCard />
      <WinnersCard />
    </aside>
  );
}
