import { providers } from '../../data/lobby.jsx';
import { asset } from '../../lib/asset.js';
import { SectionTitle } from '../../components/ui/SectionHead.jsx';

// Endless marquee: the list is rendered twice and the track slides by half its width.
export default function ProvidersTicker() {
  return (
    <section className="ticker-section" aria-label="Game providers">
      <div className="ticker-head">
        <SectionTitle icon="category-lobby.webp" title="Providers" />
        <span style={{ color: '#999ec0', fontSize: '11px' }}>The studios behind your next favorite</span>
      </div>
      <div className="provider-window">
        <div className="provider-track" id="providerTrack">
          {[...providers, ...providers].map(([name, file], i) => (
            <a key={i} className="provider" href={`pages/providers/${file}.html`} data-provider={file} aria-label={`Games by ${name}`} onClick={(e) => e.preventDefault()}>
              <span className="provider-logo" role="img" aria-label={name} style={{ '--provider-logo': `url('${asset(`provider-${file}.svg`)}')` }} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
