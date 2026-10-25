import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import HeroBanner from '../../components/ui/HeroBanner.jsx';
import { loyaltyFaq, loyaltyLevels, statuses } from '../../data/promotions.js';
import { ChevronDown } from '../../components/ui/icons.jsx';
import StatusBadge from './StatusBadge.jsx';
import { PageTitle } from '../promotions/PromotionsPage.jsx';

const PAGE = 10;

// Loyalty Club (/vip): banner, statuses, level table (10 per page) and FAQ. Demo content only.
export default function LoyaltyPage() {
  const [page, setPage] = useState(0);
  const pages = loyaltyLevels.length / PAGE;
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="nv-loyalty">
      <PageTitle icon="vip">VIP Club</PageTitle>
      <HeroBanner design={1} className="nv-loyalty-hero">
        <div className="eyebrow">LOYALTY CLUB</div>
        <h1>Build your <em>progress</em></h1>
        <p>UNLOCK REWARDS AS YOU LEVEL UP</p>
      </HeroBanner>

      <h2 className="nv-promo-subtitle">Statuses</h2>
      <div className="nv-status-row">
        {statuses.map((s) => (
          <div key={s.id} className={`nv-status nv-status--${s.id}`}>
            <StatusBadge tier={s.id} />
            <strong>{s.name}</strong>
            <span>Level {s.range}</span>
          </div>
        ))}
      </div>

      <h2 className="nv-promo-subtitle">Levels</h2>
      <table className="nv-levels">
        <thead><tr><th>Level</th><th>XP required</th><th>Reward</th></tr></thead>
        <tbody>
          {loyaltyLevels.slice(page * PAGE, page * PAGE + PAGE).map((l) => (
            <tr key={l.level} className={`nv-levels-row--${l.status.toLowerCase()}`}>
              <td><span className="nv-level-dot" />Level {l.level}</td><td>{l.xp.toLocaleString("en-US")} XP</td><td className="nv-level-reward">{l.reward}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="nv-levels-nav">
        <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>‹ Previous</Button>
        <span>Levels {page * PAGE + 1}–{page * PAGE + PAGE}</span>
        <Button variant="secondary" size="sm" disabled={page === pages - 1} onClick={() => setPage(page + 1)}>Next ›</Button>
      </div>

      <h2 className="nv-promo-subtitle">FAQ</h2>
      <div className="faq-list">
        {loyaltyFaq.map(([q, a]) => (
          <details key={q} className="faq-item">
            <summary><span className="faq-question">{q}</span><span className="faq-arrow"><ChevronDown /></span></summary>
            <div className="faq-answer"><p>{a}</p></div>
          </details>
        ))}
      </div>
    </div>
  );
}
