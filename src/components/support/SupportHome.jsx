import { useSupport } from '../../context/SupportContext.jsx';
import { articleById, popularArticles } from '../../data/support.js';
import { asset } from '../../lib/asset.js';
import { ChevronRight } from '../ui/icons.jsx';
import { CloseButton, SupportScroll } from './SupportFrame.jsx';
import { AgentIcon, ArrowIcon } from './supportIcons.jsx';

// Home tab: greeting over the three-layer artwork, the message card and popular articles.
export default function SupportHome({ screenKey }) {
  const { openChat, openArticle, selectTab } = useSupport();
  return (
    <>
      <CloseButton className="nv-support-hero-close" />
      <SupportScroll screenKey={screenKey} className="nv-support-home">
        <div className="nv-support-hero">
          <img className="nv-support-hero-layer" src={asset('support-hero-bg.webp')} alt="" />
          <img className="nv-support-hero-layer nv-support-hero-character" src={asset('support-hero-character.webp')} alt="" />
          <img className="nv-support-hero-layer" src={asset('support-hero-shading.webp')} alt="" />
          <span className="nv-support-avatar" aria-hidden="true"><AgentIcon /></span>
          <h2 className="nv-support-hero-title" id="nv-support-title">
            <span>Hi there 👋</span>
            How can we help?
          </h2>
        </div>

        <div className="nv-support-home-cards">
          <button type="button" className="nv-support-card is-accent" onClick={openChat}>
            <span className="nv-support-card-text">
              <b>Send us a message</b>
              <span>We’ll reply as soon as we can</span>
            </span>
            <span className="nv-support-card-arrow"><ArrowIcon /></span>
          </button>
          {popularArticles.map(articleById).map((a) => (
            <button key={a.id} type="button" className="nv-support-card" onClick={() => openArticle(a.id)}>
              <span className="nv-support-card-text">
                <b>{a.title}</b>
                <span>{a.summary}</span>
              </span>
              <ChevronRight />
            </button>
          ))}
          <button type="button" className="nv-link nv-support-browse" onClick={() => selectTab('help')}>Browse all help articles</button>
        </div>
      </SupportScroll>
    </>
  );
}
