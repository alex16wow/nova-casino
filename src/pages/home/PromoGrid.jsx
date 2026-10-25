import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { promos } from '../../data/lobby.jsx';
import { useAccountAction } from '../../context/AuthContext.jsx';
import { asset } from '../../lib/asset.js';
import ScrollIndicator from '../../components/ui/ScrollIndicator.jsx';

export default function PromoGrid({ tablet }) {
  const navigate = useNavigate();
  const gate = useAccountAction();
  const actionFor = (p) => (p.needsAccount ? gate(() => navigate(p.to)) : () => navigate(p.to));
  const row = useRef(null);
  return (
    <section className="section" id="promotions">
      <div className="promo-grid" ref={row}>
        {promos.map((p) => (
          <article key={p.title} className="promo-card">
            <img src={asset(p.image)} alt={p.alt} />
            <div className="promo-copy">
              <h3>{p.title} <span>{p.accent}</span></h3>
              <p>{p.copy}</p>
              <button className="primary" onClick={actionFor(p)}>{p.action}</button>
            </div>
          </article>
        ))}
      </div>
      {tablet && <ScrollIndicator targetRef={row} className="tablet-promo-scrollbar" label="Scroll promotions" hideWhenFits />}
    </section>
  );
}
