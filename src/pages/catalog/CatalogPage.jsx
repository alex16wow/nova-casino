import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import CategoryNav from '../../components/ui/CategoryNav.jsx';
import GameCard from '../../components/ui/GameCard.jsx';
import Button from '../../components/ui/Button.jsx';
import { SectionTitle } from '../../components/ui/SectionHead.jsx';
import { SkeletonCard } from '../../components/ui/Skeleton.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { ChevronDown } from '../../components/ui/icons.jsx';
import { categoryPage, pageSize, providerPage } from '../../data/catalog.js';
import { useBreakpoint } from '../../hooks/useMediaQuery.js';
import { asset } from '../../lib/asset.js';
import NotFoundPage from '../not-found/NotFoundPage.jsx';
import { useCatalogData } from './useCatalogData.js';

function PageTitle({ info }) {
  if (!info.logo) return <SectionTitle as="h1" icon={info.icon} title={info.title} />;
  return (
    <h1 className="section-title-with-icon nv-catalog-provider-title">
      <span className="provider-logo nv-catalog-logo" aria-hidden="true" style={{ '--provider-logo': `url('${asset(info.logo)}')` }} />
      <span>{info.title}</span>
    </h1>
  );
}

// Category pages (/lobby, /top-games, … /game-shows) and provider pages (/providers/:provider):
// category strip, title, a grid of games and Show More.
export default function CatalogPage() {
  const { category, provider } = useParams();
  const { pathname } = useLocation();
  const { touch } = useBreakpoint();
  const page = provider ? `providers/${provider}` : category;
  const info = provider ? providerPage(provider) : categoryPage(category);
  const { status, data, error, reload, loadMore, loadingMore } = useCatalogData(page);

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  if (!info || (status === 'error' && error.code === 'not_found')) return <NotFoundPage />;

  const shows = info.kind === 'shows';
  const games = data?.games ?? [];
  const loading = status === 'loading';

  return (
    <div className="nv-catalog">
      <CategoryNav touch={touch} current={provider ? null : category} />
      <section className="section nv-catalog-section" aria-busy={loading || undefined}>
        <div className="section-head nv-catalog-head"><PageTitle info={info} /></div>
        {status === 'error' && <StateMessage kind="error" title={`Couldn’t load ${info.title}`} text={error.message} action="Try again" onAction={reload} />}
        {status === 'ready' && !games.length && <StateMessage kind="empty" title="No games here yet" text="New titles are added every week. Check back soon." />}
        {(loading || games.length > 0) && (
          <div className={`nv-catalog-grid${shows ? ' is-shows' : ''}`}>
            {loading
              ? Array.from({ length: pageSize(info.kind) }, (_, i) => <SkeletonCard key={i} />)
              : games.map((game, i) => <GameCard key={i} game={game} />)}
          </div>
        )}
        {status === 'ready' && data.more && (
          <div className="nv-show-more">
            <Button variant="secondary" size="sm" loading={loadingMore} onClick={loadMore}>Show More<ChevronDown /></Button>
          </div>
        )}
      </section>
    </div>
  );
}
