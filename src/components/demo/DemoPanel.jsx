import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { categoryPage, providerPage } from '../../data/catalog.js';
import { gameSets } from '../../data/games.js';
import { demoEnabled, getDemo, setDemo } from '../../lib/demo.js';

const networkModes = [
  ['normal', 'Normal'],
  ['slow', 'Slow (3s)'],
  ['error', 'Error'],
  ['empty', 'Empty'],
];

// Game page: how the page data and the provider's game behave.
const gameDataModes = [
  ['normal', 'Normal'],
  ['slow', 'Slow (3s)'],
  ['error', 'Error'],
  ['empty', 'No similar games'],
];
const providerModes = [
  ['up', 'Game loads'],
  ['down', 'Game fails'],
];
const MISSING_GAME = '/game/missing-game';

// Category / provider pages.
const isCatalog = (path) => {
  const [, first, second] = path.split('/');
  return first === 'providers' ? Boolean(providerPage(second)) : Boolean(categoryPage(first));
};

// Prototype-only switcher for reviewing states. Shown in preview builds or with ?demo in the URL.
export default function DemoPanel() {
  const { user, startSession, endSession, openAuth } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  if (!demoEnabled()) return null;

  // Each page lists only its own states.
  const onGame = pathname.startsWith('/game/');
  const onCatalog = isCatalog(pathname);
  const onFavorites = pathname === '/favorites';
  const onRecent = pathname === '/recently-played';

  // Read on every render: picks reset when the address changes.
  const { network } = getDemo();
  const chooseNetwork = (mode) => {
    setDemo({ network: mode });
    location.reload();
  };

  const account = (
    <>
      <p className="nv-demo-title">Account</p>
      <div className="nv-demo-options">
        <button type="button" aria-pressed={!user} onClick={endSession}>Guest</button>
        <button type="button" aria-pressed={Boolean(user)} onClick={() => startSession({ email: 'player@nova.casino', name: 'player' })}>Signed in</button>
      </div>
    </>
  );

  return (
    <div className={`nv-demo${open ? ' is-open' : ''}`}>
      <button type="button" className="nv-demo-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>States</button>
      {open && (
        <div className="nv-demo-panel" role="group" aria-label="Prototype states">
          {onGame ? (
            <GameStates network={network} chooseNetwork={chooseNetwork} missing={pathname === MISSING_GAME} navigate={navigate}>{account}</GameStates>
          ) : onRecent ? (
            <RecentStates>{account}</RecentStates>
          ) : onFavorites ? (
            <FavoritesStates>{account}</FavoritesStates>
          ) : onCatalog ? (
            <>
              {account}
              <p className="nv-demo-title">Games</p>
              <div className="nv-demo-options">
                {networkModes.map(([mode, label]) => (
                  <button key={mode} type="button" aria-pressed={network === mode} onClick={() => chooseNetwork(mode)}>{label}</button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="nv-demo-title">Page</p>
              <div className="nv-demo-options">
                <button type="button" aria-pressed={pathname === '/'} onClick={() => navigate('/')}>Main Page</button>
                <button type="button" aria-pressed={pathname !== '/'} onClick={() => navigate('/missing-page')}>404</button>
              </div>
              {account}
              <p className="nv-demo-title">Data</p>
              <div className="nv-demo-options">
                {networkModes.map(([mode, label]) => (
                  <button key={mode} type="button" aria-pressed={network === mode} onClick={() => chooseNetwork(mode)}>{label}</button>
                ))}
              </div>
              <p className="nv-demo-title">Dialogs</p>
              <div className="nv-demo-options">
                <button type="button" onClick={() => openAuth('login')}>Log in</button>
                <button type="button" onClick={() => openAuth('register')}>Sign up</button>
                <button type="button" onClick={() => openAuth('forgot')}>Reset</button>
              </div>
              <p className="nv-demo-hint">Wrong password: <code>wrongpass</code> · taken email: <code>taken@nova.casino</code></p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function GameStates({ network, chooseNetwork, missing, navigate, children }) {
  const { provider } = getDemo();
  const chooseProvider = (mode) => {
    setDemo({ provider: mode });
    location.reload();
  };
  return (
    <>
      {children}
      <p className="nv-demo-title">Game page</p>
      <div className="nv-demo-options">
        {gameDataModes.map(([mode, label]) => (
          <button key={mode} type="button" aria-pressed={!missing && network === mode} onClick={() => (missing ? navigate('/game/gates-of-olympus') : chooseNetwork(mode))}>{label}</button>
        ))}
        <button type="button" aria-pressed={missing} onClick={() => navigate(MISSING_GAME)}>Not found</button>
      </div>
      <p className="nv-demo-title">Game window</p>
      <div className="nv-demo-options">
        {providerModes.map(([mode, label]) => (
          <button key={mode} type="button" aria-pressed={provider === mode} onClick={() => chooseProvider(mode)}>{label}</button>
        ))}
      </div>
    </>
  );
}

// Favorites page: fills or empties the real favorites list (no separate demo data).
const sampleFavorites = [...gameSets.top.slice(0, 6), ...gameSets.fresh.slice(0, 3), ...gameSets.live.slice(0, 3)];
function FavoritesStates({ children }) {
  const { favorites, toggleFavorite, clearFavorites } = usePlayer();
  const fill = () => {
    clearFavorites();
    [...sampleFavorites].reverse().forEach((g) => toggleFavorite(g.name));
  };
  return (
    <>
      {children}
      <p className="nv-demo-title">Favorites</p>
      <div className="nv-demo-options">
        <button type="button" aria-pressed={favorites.length > 0} onClick={fill}>With games</button>
        <button type="button" aria-pressed={!favorites.length} onClick={clearFavorites}>Empty</button>
      </div>
    </>
  );
}

// Recently Played page: fills or empties the real history (no separate demo data).
// History is shown only to signed-in players, so "With games" also signs in.
const sampleRecent = [...gameSets.top.slice(2, 6), ...gameSets.live.slice(0, 2), ...gameSets.fresh.slice(1, 4), ...gameSets.roulette.slice(0, 1)];
function RecentStates({ children }) {
  const { recent, setRecentList, clearRecent } = usePlayer();
  const { user, startSession } = useAuth();
  const fill = () => {
    if (!user) startSession({ email: 'player@nova.casino', name: 'player' });
    setRecentList(sampleRecent.map((g) => g.name));
  };
  const filled = Boolean(user) && recent.length > 0;
  return (
    <>
      {children}
      <p className="nv-demo-title">History</p>
      <div className="nv-demo-options">
        <button type="button" aria-pressed={filled} onClick={fill}>With games</button>
        <button type="button" aria-pressed={!filled} onClick={clearRecent}>Empty</button>
      </div>
    </>
  );
}
