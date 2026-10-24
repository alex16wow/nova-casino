import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { asset } from '../../lib/asset.js';
import ScrollIndicator from '../../components/ui/ScrollIndicator.jsx';
import { SkeletonLine } from '../../components/ui/Skeleton.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';

const columns = ['28%', '17%', '14%', '16%', '15%', '10%'];
const ColGroup = () => <colgroup>{columns.map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>;

const tabLabels = ['Recent Bets', 'Top Players', 'Big Wins'];

function SkeletonRows() {
  return Array.from({ length: 5 }, (_, i) => (
    <tr key={i} className={`is-skeleton ${i % 2 ? 'bet-even' : 'bet-odd'}`} aria-hidden="true">
      <td><div className="bet-game"><span className="nv-skeleton nv-skeleton--thumb" /><SkeletonLine width="60%" /></div></td>
      {['70%', '50%', '55%', '60%', '40%'].map((w, c) => <td key={c}><SkeletonLine width={w} /></td>)}
    </tr>
  ));
}

// Recent bets / top players / big wins. Five rows visible; every 5s the list scrolls by one.
// While loading it shows skeleton rows; a failed or empty feed shows a message instead.
export default function ActivityTable({ touch, status = 'ready', tabs = [], onRetry }) {
  const [tab, setTab] = useState(0);
  const [start, setStart] = useState(0);
  const [incoming, setIncoming] = useState(false);
  const track = useRef(null), body = useRef(null), panel = useRef(null), layout = useRef(null);
  const rows = tabs[tab]?.rows ?? [];
  const live = status === 'ready' && rows.length > 0;

  useEffect(() => {
    if (!live) return;
    const el = track.current;
    el.style.transition = 'none';
    el.style.transform = 'translateY(0)';
    let settle, frame, active = true;
    const timer = setInterval(() => {
      flushSync(() => setIncoming(true));
      const height = body.current.firstElementChild.getBoundingClientRect().height;
      el.style.transition = 'transform 650ms cubic-bezier(.22,.7,.2,1)';
      frame = requestAnimationFrame(() => { if (active) el.style.transform = `translateY(-${height}px)`; });
      settle = setTimeout(() => {
        flushSync(() => {
          setIncoming(false);
          setStart((i) => i + 1);
        });
        el.style.transition = 'none';
        el.style.transform = 'translateY(0)';
      }, 680);
    }, 5000);
    return () => { active = false; clearInterval(timer); clearTimeout(settle); cancelAnimationFrame(frame); };
  }, [tab, live]);

  const select = (i) => {
    setTab(i);
    setStart(0);
    setIncoming(false);
  };

  const visible = live ? Array.from({ length: incoming ? 6 : 5 }, (_, i) => ({ index: (start + i) % rows.length, key: start + i })) : [];
  const message = status === 'error'
    ? <StateMessage kind="error" title="Couldn’t load activity" text="Check your connection and try again." action="Try again" onAction={onRetry} />
    : status === 'ready' && !rows.length
      ? <StateMessage kind="empty" title="No bets yet" text="Activity will appear here as soon as players start winning." />
      : null;

  return (
    <section className="bets-section">
      <div className="bets-tabs" role="tablist" aria-label="Activity">
        {tabLabels.map((label, i) => (
          <button key={label} className={i === tab ? 'selected' : undefined} role="tab" aria-selected={i === tab} onClick={() => select(i)}>{label}</button>
        ))}
      </div>
      <div className={`bets-panel${message ? ' has-message' : ''}`} id="activityTablePanel" ref={panel} aria-busy={status === 'loading' || undefined}>
        {message ?? (
          <div className="bets-table-layout" ref={layout}>
            <table className="bets-head-table">
              <ColGroup />
              <thead><tr><th>Game</th><th>User</th><th>Amount</th><th>Multiplier</th><th>Profit</th><th>Time</th></tr></thead>
            </table>
            <div className="bets-body-window" id="betsWindow">
              <table className="bets-body-table" id="betsTrack" ref={track}>
                <ColGroup />
                <tbody id="betsRows" ref={body} key={tab}>
                  {status === 'loading' && <SkeletonRows />}
                  {visible.map(({ index, key }) => {
                    const r = rows[index];
                    return (
                      <tr key={key} className={index % 2 ? 'bet-even' : 'bet-odd'}>
                        <td><div className="bet-game"><img src={asset(r.image)} alt="" /><span>{r.game}</span></div></td>
                        <td>{r.user}</td><td>{r.amount}</td><td>{r.multiplier}</td><td className="profit">{r.profit}</td><td>{r.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {touch && !message && <ScrollIndicator targetRef={panel} className="bets-horizontal-scrollbar" label="Scroll activity table horizontally" controls="activityTablePanel" observe={[layout]} />}
    </section>
  );
}
