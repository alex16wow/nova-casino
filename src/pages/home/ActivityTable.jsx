import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { activityTabs } from '../../data/lobby.jsx';
import { asset } from '../../lib/asset.js';
import ScrollIndicator from '../../components/ui/ScrollIndicator.jsx';

const columns = ['28%', '17%', '14%', '16%', '15%', '10%'];
const ColGroup = () => <colgroup>{columns.map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>;

// Recent bets / top players / big wins. Five rows visible; every 5s the list scrolls by one.
export default function ActivityTable({ touch }) {
  const [tab, setTab] = useState(0);
  const [start, setStart] = useState(0);
  const [incoming, setIncoming] = useState(false);
  const track = useRef(null), body = useRef(null), panel = useRef(null), layout = useRef(null);
  const rows = activityTabs[tab].rows;

  useEffect(() => {
    const el = track.current;
    el.style.transition = 'none';
    el.style.transform = 'translateY(0)';
    let settle, frame, live = true;
    const timer = setInterval(() => {
      flushSync(() => setIncoming(true));
      const height = body.current.firstElementChild.getBoundingClientRect().height;
      el.style.transition = 'transform 650ms cubic-bezier(.22,.7,.2,1)';
      frame = requestAnimationFrame(() => { if (live) el.style.transform = `translateY(-${height}px)`; });
      settle = setTimeout(() => {
        flushSync(() => {
          setIncoming(false);
          setStart((i) => i + 1);
        });
        el.style.transition = 'none';
        el.style.transform = 'translateY(0)';
      }, 680);
    }, 5000);
    return () => { live = false; clearInterval(timer); clearTimeout(settle); cancelAnimationFrame(frame); };
  }, [tab]);

  const select = (i) => {
    setTab(i);
    setStart(0);
    setIncoming(false);
  };

  const visible = Array.from({ length: incoming ? 6 : 5 }, (_, i) => ({ index: (start + i) % rows.length, key: start + i }));

  return (
    <section className="bets-section">
      <div className="bets-tabs" role="tablist" aria-label="Activity">
        {activityTabs.map((t, i) => (
          <button key={t.label} className={i === tab ? 'selected' : undefined} role="tab" aria-selected={i === tab} onClick={() => select(i)}>{t.label}</button>
        ))}
      </div>
      <div className="bets-panel" id="activityTablePanel" ref={panel}>
        <div className="bets-table-layout" ref={layout}>
          <table className="bets-head-table">
            <ColGroup />
            <thead><tr><th>Game</th><th>User</th><th>Amount</th><th>Multiplier</th><th>Profit</th><th>Time</th></tr></thead>
          </table>
          <div className="bets-body-window" id="betsWindow">
            <table className="bets-body-table" id="betsTrack" ref={track}>
              <ColGroup />
              <tbody id="betsRows" ref={body} key={tab}>
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
      </div>
      {touch && <ScrollIndicator targetRef={panel} className="bets-horizontal-scrollbar" label="Scroll activity table horizontally" controls="activityTablePanel" observe={[layout]} />}
    </section>
  );
}
