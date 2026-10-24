import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import HeroBanner from '../../components/ui/HeroBanner.jsx';
import { tournamentFilters, tournamentsList, tournamentTerms } from '../../data/promotions.js';
import { Filters, PageTitle } from '../promotions/PromotionsPage.jsx';

const pad = (n) => String(n).padStart(2, '0');
const left = (end, now) => {
  const s = Math.max(0, Math.floor((end - now) / 1000));
  return `${Math.floor(s / 86400)}d ${pad(Math.floor(s / 3600) % 24)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
};

// Tournaments (/tournaments): wide banners with a countdown; See details opens participants, terms and leaderboard.
export default function TournamentsPage() {
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { window.scrollTo(0, 0); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const list = tournamentsList.filter((t) => filter === 'All' || t.type === filter);

  return (
    <div className="nv-tournaments">
      <PageTitle icon="tournaments">Tournaments</PageTitle>
      <Filters items={tournamentFilters} value={filter} onChange={setFilter} />
      <div className="nv-tour-list">
        {list.map((t) => (
          <Tournament key={t.id} t={t} now={now} design={tournamentsList.indexOf(t)} open={open === t.id} onToggle={() => setOpen(open === t.id ? null : t.id)} />
        ))}
      </div>
    </div>
  );
}

function Tournament({ t, now, design, open, onToggle }) {
  const navigate = useNavigate();
  const [terms, setTerms] = useState(false);
  return (
    <article className={`nv-tour${open ? ' is-open' : ''}`}>
      <HeroBanner design={design} className="nv-tour-art">
        <div className="eyebrow">{t.type.toUpperCase()}</div>
        <h1>{t.name}</h1>
        <p className="nv-tour-facts">Prize pool: <b>{t.prize}</b><br />Ends in <b>{left(t.end, now)}</b></p>
      </HeroBanner>
      <button type="button" className="nv-tour-toggle" aria-expanded={open} onClick={onToggle}>
        {open ? 'Hide' : 'See details'}<span aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="nv-tour-details">
          <div className="nv-tour-meta">
            <div>
              <strong>{t.players.toLocaleString('en-US')} participants</strong>
              <button type="button" className="nv-link-btn" aria-expanded={terms} onClick={() => setTerms(!terms)}>Terms and conditions</button>
            </div>
            <Button onClick={() => navigate('/lobby')}>Explore games</Button>
          </div>
          {terms && <ul className="nv-tour-terms">{tournamentTerms.map((x) => <li key={x}>{x}</li>)}</ul>}
          <h3>Leaderboard</h3>
          <div className="nv-table-scroll">
          <table className="nv-tour-board">
            <thead><tr><th>#</th><th>Player</th><th>Score</th><th>Prize</th></tr></thead>
            <tbody>
              {t.board.map((r, i) => (
                <tr key={r.player}><td><span className={`nv-place nv-place--${i + 1}`}>{i + 1}</span></td><td>{r.player}</td><td>{r.score.toLocaleString('en-US')}</td><td>{r.prize}</td></tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </article>
  );
}
