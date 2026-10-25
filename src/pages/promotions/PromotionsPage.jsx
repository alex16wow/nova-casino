import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import HeroBanner from '../../components/ui/HeroBanner.jsx';
import { NavIcon } from '../../components/ui/icons.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { promoFilters, promoSteps, promotions } from '../../data/promotions.js';

// Promotions (/promotions): filterable offer grid; View details swaps the grid for the chosen offer in place.
export default function PromotionsPage() {
  const [filter, setFilter] = useState('All');
  const [openId, setOpenId] = useState(null);
  const { isGuest, openAuth } = useAuth();
  const navigate = useNavigate();
  const getBonus = () => (isGuest ? openAuth('login') : navigate('/account/bonuses'));
  const promo = promotions.find((p) => p.id === openId);
  const list = promotions.filter((p) => filter === 'All' || p.type === filter);

  useEffect(() => { window.scrollTo(0, 0); }, [openId]);

  return (
    <div className="nv-promos">
      {promo ? (
        <PromoDetails promo={promo} design={promotions.indexOf(promo)} onBack={() => setOpenId(null)} onGet={getBonus} />
      ) : (
        <>
          <PageTitle icon="promotions">Promotions</PageTitle>
          <Filters items={promoFilters} value={filter} onChange={setFilter} />
          <div className="nv-promo-grid">
            {list.map((p) => (
              <article key={p.id} className={`nv-promo-card nv-promo-card--${p.id}`}>
                <span className="nv-promo-tag">{p.type}</span>
                <HeroBanner design={promotions.indexOf(p)} className="nv-promo-card-art" />
                <div className="nv-promo-card-body">
                  <h2>{p.title}</h2>
                  <p>{p.offer}</p>
                  <Button size="sm" block onClick={() => setOpenId(p.id)}>View details</Button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PromoDetails({ promo, design, onBack, onGet }) {
  const [more, setMore] = useState(false);
  return (
    <>
      <button type="button" className="nv-back-link" onClick={onBack}>‹ Back to all promotions</button>
      <HeroBanner design={design} className="nv-promo-hero">
        <div className="eyebrow">{promo.type.toUpperCase()}</div>
        <h1>{promo.title}</h1>
        <p>{promo.offer}</p>
        <button type="button" className="primary hero-cta" onClick={onGet}>Get bonus</button>
      </HeroBanner>
      <h2 className="nv-promo-subtitle">How to claim your bonus</h2>
      <ol className="nv-promo-steps">
        {promoSteps(promo.code).map(([title, text], i) => (
          <li key={title} className="nv-panel"><span className="nv-step-num">{i + 1}</span><strong>{title}</strong><p>{text}</p></li>
        ))}
      </ol>
      <section className="nv-panel nv-promo-about"><h3>About this offer</h3><p>{promo.about}</p></section>
      <section className="nv-panel nv-promo-terms">
        <h3>Bonus terms & conditions</h3>
        <ul>{(more ? promo.terms : promo.terms.slice(0, 3)).map((t) => <li key={t}>{t}</li>)}</ul>
        <button type="button" className="nv-link-btn" aria-expanded={more} onClick={() => setMore(!more)}>{more ? 'Show less ▲' : 'Show more ▼'}</button>
      </section>
    </>
  );
}

export function PageTitle({ icon, children }) {
  return (
    <div className="section-head nv-catalog-head">
      <h1 className="section-title-with-icon">
        <span className="section-title-icon nv-title-glyph" aria-hidden="true"><NavIcon name={icon} /></span>
        <span>{children}</span>
      </h1>
    </div>
  );
}

export function Filters({ items, value, onChange }) {
  return (
    <div className="nv-chips nv-page-filters" role="tablist">
      {items.map((f) => (
        <button key={f} type="button" role="tab" aria-selected={value === f} className={`nv-chip${value === f ? ' is-selected' : ''}`} onClick={() => onChange(f)}>{f}</button>
      ))}
    </div>
  );
}
