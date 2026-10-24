import { useCallback, useEffect, useRef, useState } from 'react';
import { heroSlides } from '../../data/lobby.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { usePreviewAction } from '../../context/ToastContext.jsx';
import { asset } from '../../lib/asset.js';
import { preloadImages } from '../../lib/preload.js';
import CategoryNav from '../../components/ui/CategoryNav.jsx';
import { ChevronLeft, ChevronRight } from '../../components/ui/icons.jsx';
import RightRail from './RightRail.jsx';

const SLIDE_MS = 6000;

preloadImages(heroSlides.flatMap(({ art }) => [art.background, art.gifts, art.glow, art.character].filter(Boolean).map(asset)));

function HeroSlide({ slide, phase }) {
  const preview = usePreviewAction();
  const { art } = slide;
  const cls = ['hero-slide', 'hero-slide--layered', art.variant && `hero-slide--${art.variant}`, phase === 'enter' && 'enter-right', phase === 'leave' && 'leave-left'].filter(Boolean).join(' ');
  return (
    <div className={cls} aria-hidden={phase === 'hidden' || phase === 'leave' ? 'true' : undefined}>
      <div className="hero-art-frame" aria-hidden="true">
        <img className="hero-scene" src={asset(art.background)} alt="" draggable="false" />
        {art.gifts && <img className="hero-gifts" src={asset(art.gifts)} alt="" draggable="false" />}
        <img className="hero-glow" src={asset(art.glow)} alt="" draggable="false" />
      </div>
      <img className="hero-character" src={asset(art.character)} alt="" aria-hidden="true" draggable="false" />
      <div className="hero-bottom-shade" aria-hidden="true" />
      <div className="hero-copy">
        <div className="eyebrow">{slide.eyebrow}</div>
        <h1>{slide.title}</h1>
        <p>{slide.subtitle}</p>
        <button className="primary hero-cta action-toast" onClick={preview}>{slide.action}</button>
      </div>
    </div>
  );
}

// Auto-advancing banner (paused with reduced motion). Every change slides the new banner in from the right.
function useHeroCarousel() {
  const [stage, setStage] = useState([{ key: 0, index: 0, phase: 'current' }]);
  const [slide, setSlideIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const s = useRef({ slide: 0, key: 0, transitioning: false });
  const { reduceMotion } = useSettings();

  const go = useCallback((n) => {
    const st = s.current, next = (n + heroSlides.length) % heroSlides.length;
    if (next === st.slide || st.transitioning) return;
    st.transitioning = true;
    const key = ++st.key;
    // The outgoing slide is hidden from assistive tech at once, then both animate.
    setStage((list) => [...list.map((p) => ({ ...p, phase: 'hidden' })), { key, index: next, phase: 'enter' }]);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setStage((list) => list.map((p) => ({ ...p, phase: p.key === key ? 'current' : 'leave' })));
    }));
    st.slide = next;
    setSlideIndex(next);
    setCycle((c) => c + 1);
    setTimeout(() => {
      setStage((list) => list.filter((p) => p.key === key));
      st.transitioning = false;
    }, 850);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(() => go(s.current.slide + 1), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [cycle, go, reduceMotion]);

  return { stage, slide, cycle, go };
}

function HeroControls({ slide, cycle, go }) {
  return (
    <div className="hero-controls">
      <button className="hero-arrow" id="prevSlide" aria-label="Previous banner" onClick={() => go(slide - 1)}><ChevronLeft /></button>
      <div className="dots" id="dots" aria-label="Banner pagination">
        {heroSlides.map((_, i) => (
          <button key={`${cycle}-${i}`} className={`dot ${i === slide ? 'on' : ''}`} aria-label={`Show banner ${i + 1}`} aria-current={i === slide ? 'true' : 'false'} data-slide={i} onClick={() => go(i)}>
            <span className="dot-progress" />
          </button>
        ))}
      </div>
      <button className="hero-arrow" id="nextSlide" aria-label="Next banner" onClick={() => go(slide + 1)}><ChevronRight /></button>
    </div>
  );
}

function Hero({ carousel, mobile, children }) {
  const swipe = useRef(null);
  // Touch navigation is limited to the mobile artwork frame.
  const onTouchStart = (e) => {
    if (!mobile || e.touches.length !== 1) { swipe.current = null; return; }
    const t = e.touches[0];
    swipe.current = { x: t.clientX, y: t.clientY, time: performance.now() };
  };
  const onTouchEnd = (e) => {
    const start = swipe.current;
    if (!mobile || !start || !e.changedTouches.length) return;
    const t = e.changedTouches[0], dx = t.clientX - start.x, dy = t.clientY - start.y;
    swipe.current = null;
    if (Math.abs(dx) < 35 || Math.abs(dx) < Math.abs(dy) * 1.3 || performance.now() - start.time > 1600) return;
    carousel.go(carousel.slide + (dx < 0 ? 1 : -1));
  };
  return (
    <div className="hero" id="hero" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchCancel={() => { swipe.current = null; }}>
      <div className="hero-track" id="heroTrack" aria-live="polite">
        {carousel.stage.map((p) => <HeroSlide key={p.key} slide={heroSlides[p.index]} phase={p.phase} />)}
      </div>
      {children}
    </div>
  );
}

// Banner carousel, tournaments/winners rail (desktop) and the category strip.
export default function HeroSection({ mobile, touch }) {
  const carousel = useHeroCarousel();
  const preview = usePreviewAction();
  const controls = <HeroControls slide={carousel.slide} cycle={carousel.cycle} go={carousel.go} />;

  return (
    <section className="hero-grid" aria-label="Featured games">
      {mobile ? (
        <div className="mobile-hero-stack">
          <Hero carousel={carousel} mobile />
          <button type="button" className="primary mobile-hero-cta action-toast" onClick={preview}>{heroSlides[carousel.slide].action}</button>
          {controls}
        </div>
      ) : (
        <Hero carousel={carousel}>{controls}</Hero>
      )}
      {!touch && <RightRail />}
      <CategoryNav touch={touch} />
    </section>
  );
}
