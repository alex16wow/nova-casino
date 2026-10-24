import { heroSlides } from '../../data/lobby.jsx';
import { asset } from '../../lib/asset.js';

// Static banner built from one of the lobby hero designs (index 0–2, wraps around). Copy and actions come from the page.
export default function HeroBanner({ design = 0, className = '', children }) {
  const { art } = heroSlides[design % heroSlides.length];
  return (
    <div className={`hero nv-hero-banner ${className}`}>
      <div className={['hero-slide', 'hero-slide--layered', art.variant && `hero-slide--${art.variant}`].filter(Boolean).join(' ')}>
        <div className="hero-art-frame" aria-hidden="true">
          <img className="hero-scene" src={asset(art.background)} alt="" draggable="false" />
          {art.gifts && <img className="hero-gifts" src={asset(art.gifts)} alt="" draggable="false" />}
          <img className="hero-glow" src={asset(art.glow)} alt="" draggable="false" />
        </div>
        <img className="hero-character" src={asset(art.character)} alt="" aria-hidden="true" draggable="false" />
        <div className="hero-bottom-shade" aria-hidden="true" />
        <div className="hero-copy">{children}</div>
      </div>
    </div>
  );
}
