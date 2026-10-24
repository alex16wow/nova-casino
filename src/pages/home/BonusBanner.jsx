import { useState } from 'react';
import { bonusSlides } from '../../data/lobby.jsx';
import { useAccountAction } from '../../context/AuthContext.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { usePreviewAction } from '../../context/ToastContext.jsx';
import { asset } from '../../lib/asset.js';
import { preloadImages } from '../../lib/preload.js';
import RotatingStage from '../../components/ui/RotatingStage.jsx';

preloadImages(bonusSlides.flatMap((b) => [asset(`bonus-${b.art}-bg.webp`), asset(`bonus-${b.art}-object.webp`)]));

// Rotating bonus banner. On phones its button sits below the banner.
export default function BonusBanner({ mobile }) {
  const preview = usePreviewAction();
  const gate = useAccountAction();
  const { openDeposit } = usePlayer();
  const actionFor = (b) => (b.needsAccount ? gate(openDeposit) : preview);
  const [current, setCurrent] = useState(0);
  const banner = (
    <section className="bonus" aria-label="Bonuses">
      <RotatingStage
        id="bonusStage"
        items={bonusSlides}
        period={6000}
        panelClass="bonus-slide"
        onChange={setCurrent}
        render={(b) => (
          <>
            <div className="bonus-layered-art" aria-hidden="true">
              <img className="bonus-scene" src={asset(`bonus-${b.art}-bg.webp`)} alt="" />
              <img className="bonus-object" src={asset(`bonus-${b.art}-object.webp`)} alt="" />
            </div>
            <div className="bonus-copy">
              <div><h2>{b.title} <span>{b.accent}</span></h2><p>{b.copy}</p></div>
              <button className="primary action-toast" onClick={actionFor(b)}>{b.action}</button>
            </div>
          </>
        )}
      />
    </section>
  );
  if (!mobile) return banner;
  return (
    <div className="mobile-bonus-stack">
      {banner}
      <button type="button" className="primary mobile-bonus-cta action-toast" onClick={actionFor(bonusSlides[current])}>{bonusSlides[current].action}</button>
    </div>
  );
}
