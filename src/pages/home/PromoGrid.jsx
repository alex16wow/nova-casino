import { useRef } from 'react';
import { promos } from '../../data/lobby.jsx';
import { useAccountPreview } from '../../context/AuthContext.jsx';
import { asset } from '../../lib/asset.js';
import ScrollIndicator from '../../components/ui/ScrollIndicator.jsx';

export default function PromoGrid({ tablet }) {
  const preview = useAccountPreview();
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
              <button className="primary action-toast" onClick={preview}>{p.action}</button>
            </div>
          </article>
        ))}
      </div>
      {tablet && <ScrollIndicator targetRef={row} className="tablet-promo-scrollbar" label="Scroll promotions" hideWhenFits />}
    </section>
  );
}
