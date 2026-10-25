import { shelves } from '../../data/games.js';
import { useLobbyData } from '../../hooks/useLobbyData.js';
import { useBreakpoint } from '../../hooks/useMediaQuery.js';
import ActivityTable from './ActivityTable.jsx';
import BonusBanner from './BonusBanner.jsx';
import FaqSection from './FaqSection.jsx';
import GameShelf from './GameShelf.jsx';
import HeroSection from './HeroSection.jsx';
import PromoGrid from './PromoGrid.jsx';
import ProvidersTicker from './ProvidersTicker.jsx';
import RightRail from './RightRail.jsx';

// Lobby (home page).
export default function HomePage() {
  const { mobile, tablet, touch } = useBreakpoint();
  const lobby = useLobbyData();
  const shelf = (key) => (
    <GameShelf shelf={shelves[key]} mobile={mobile} touch={touch} status={lobby.status} games={lobby.data?.games[shelves[key].kind]} onRetry={lobby.reload} />
  );
  return (
    <>
      <HeroSection mobile={mobile} touch={touch} />
      {shelf('top')}
      {shelf('fresh')}
      <PromoGrid tablet={tablet} />
      {shelf('live')}
      {shelf('table')}
      <ProvidersTicker />
      {shelf('roulette')}
      {shelf('shows')}
      <ActivityTable touch={touch} status={lobby.status} tabs={lobby.data?.activity} onRetry={lobby.reload} />
      <BonusBanner mobile={mobile} />
      {touch && <RightRail secondary />}
      <FaqSection />
    </>
  );
}
