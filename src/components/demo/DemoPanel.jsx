import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { TEST_2FA_CODE, breakOptions, exclusionOptions } from '../../data/settings.js';
import { categoryPage, providerPage } from '../../data/catalog.js';
import { gameSets } from '../../data/games.js';
import { verificationStatus } from '../../data/profile.js';
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
  const onProfile = pathname === '/account/profile';
  const onWallet = pathname === '/account/wallet';
  const onBonuses = pathname === '/account/bonuses';
  const onSettings = pathname === '/account/settings';

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
          ) : onSettings ? (
            <SettingsStates network={network} chooseNetwork={chooseNetwork}>{account}</SettingsStates>
          ) : onBonuses ? (
            <BonusesStates network={network} chooseNetwork={chooseNetwork}>{account}</BonusesStates>
          ) : onWallet ? (
            <WalletStates network={network} chooseNetwork={chooseNetwork}>{account}</WalletStates>
          ) : onProfile ? (
            <ProfileStates network={network} chooseNetwork={chooseNetwork}>{account}</ProfileStates>
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

// My profile: loading of the page and the real verification status (no separate demo data).
const profileDataModes = [
  ['normal', 'Normal'],
  ['slow', 'Slow (3s)'],
  ['error', 'Error'],
];
function ProfileStates({ network, chooseNetwork, children }) {
  const { profile, setVerification, resetProfile } = useProfile();
  return (
    <>
      {children}
      <p className="nv-demo-title">Profile data</p>
      <div className="nv-demo-options">
        {profileDataModes.map(([mode, label]) => (
          <button key={mode} type="button" aria-pressed={network === mode} onClick={() => chooseNetwork(mode)}>{label}</button>
        ))}
      </div>
      <p className="nv-demo-title">Verification</p>
      <div className="nv-demo-options">
        {Object.entries(verificationStatus).map(([id, { label }]) => (
          <button key={id} type="button" aria-pressed={profile.verification === id} onClick={() => setVerification(id)}>{label}</button>
        ))}
      </div>
      <p className="nv-demo-title">Demo profile</p>
      <div className="nv-demo-options">
        <button type="button" onClick={resetProfile}>Reset to defaults</button>
      </div>
    </>
  );
}

// Wallet: page data, payment outcome (no reload) and the verification gate for withdrawals.
function WalletStates({ network, chooseNetwork, children }) {
  const { profile, setVerification } = useProfile();
  const { resetWallet } = usePlayer();
  const [payment, setPayment] = useState(() => getDemo().payment);
  const choosePayment = (mode) => { setDemo({ payment: mode }); setPayment(mode); };
  return (
    <>
      {children}
      <p className="nv-demo-title">Wallet data</p>
      <div className="nv-demo-options">
        {networkModes.map(([mode, label]) => (
          <button key={mode} type="button" aria-pressed={network === mode} onClick={() => chooseNetwork(mode)}>{mode === 'empty' ? 'No history' : label}</button>
        ))}
      </div>
      <p className="nv-demo-title">Payments</p>
      <div className="nv-demo-options">
        <button type="button" aria-pressed={payment === 'ok'} onClick={() => choosePayment('ok')}>Succeed</button>
        <button type="button" aria-pressed={payment === 'fail'} onClick={() => choosePayment('fail')}>Fail</button>
      </div>
      <p className="nv-demo-title">Verification</p>
      <div className="nv-demo-options">
        {Object.entries(verificationStatus).map(([id, { label }]) => (
          <button key={id} type="button" aria-pressed={profile.verification === id} onClick={() => setVerification(id)}>{label}</button>
        ))}
      </div>
      <p className="nv-demo-title">Demo wallet</p>
      <div className="nv-demo-options">
        <button type="button" onClick={resetWallet}>Reset balances and history</button>
      </div>
      <p className="nv-demo-hint">Withdrawals need Verified. Fail makes deposits and withdrawals fail without changing balances.</p>
    </>
  );
}

// Bonuses: page data, wagering progress of the active money bonus (set, not animated) and a reset.
const wagerSteps = [[0, '0%'], [0.35, '35%'], [0.9, '90%'], [1, 'Complete']];
function BonusesStates({ network, chooseNetwork, children }) {
  const { activeMoneyBonus, setWagerProgress, resetBonuses } = usePlayer();
  const share = activeMoneyBonus ? activeMoneyBonus.wagered / (activeMoneyBonus.amount * activeMoneyBonus.wager) : null;
  return (
    <>
      {children}
      <p className="nv-demo-title">Bonus data</p>
      <div className="nv-demo-options">
        {networkModes.map(([mode, label]) => (
          <button key={mode} type="button" aria-pressed={network === mode} onClick={() => chooseNetwork(mode)}>{label}</button>
        ))}
      </div>
      <p className="nv-demo-title">Wagering (active bonus)</p>
      <div className="nv-demo-options">
        {wagerSteps.map(([value, label]) => (
          <button key={label} type="button" disabled={!activeMoneyBonus} aria-pressed={share != null && Math.abs(share - value) < 0.005} onClick={() => setWagerProgress(value)}>{label}</button>
        ))}
      </div>
      <p className="nv-demo-title">Demo bonuses</p>
      <div className="nv-demo-options">
        <button type="button" onClick={resetBonuses}>Reset bonuses and rewards</button>
      </div>
      <p className="nv-demo-hint">Working promo code: <code>NOVA25</code>. Complete moves the bonus funds to the real balance.</p>
    </>
  );
}

// Settings: page data, the real restriction state (it affects games and Deposit site-wide) and shortcuts
// for flows that would otherwise need waiting (limit increase, session reminder).
function SettingsStates({ network, chooseNetwork, children }) {
  const { restriction, takeBreak, selfExclude, settings, openReminder, demo } = useSettings();
  return (
    <>
      {children}
      <p className="nv-demo-title">Settings data</p>
      <div className="nv-demo-options">
        {profileDataModes.map(([mode, label]) => (
          <button key={mode} type="button" aria-pressed={network === mode} onClick={() => chooseNetwork(mode)}>{label}</button>
        ))}
      </div>
      <p className="nv-demo-title">Play restriction (site-wide)</p>
      <div className="nv-demo-options">
        <button type="button" aria-pressed={!restriction} onClick={demo.clearRestriction}>None</button>
        <button type="button" aria-pressed={restriction?.type === 'break'} onClick={() => takeBreak(breakOptions[0])}>Break 24h</button>
        <button type="button" aria-pressed={restriction?.type === 'exclusion'} onClick={() => selfExclude(exclusionOptions[0])}>Self-excluded</button>
      </div>
      <p className="nv-demo-title">Shortcuts</p>
      <div className="nv-demo-options">
        <button type="button" disabled={!settings.pendingLimit} onClick={demo.applyPendingLimit}>Apply waiting limit now</button>
        <button type="button" onClick={openReminder}>Show session reminder</button>
        <button type="button" disabled={!settings.endedSessions.length} onClick={demo.restoreSessions}>Restore demo sessions</button>
        <button type="button" onClick={demo.reset}>Reset settings</button>
      </div>
      <p className="nv-demo-hint">Wrong current password: <code>wrongpass</code> · 2FA test code: <code>{TEST_2FA_CODE}</code>. A restriction blocks games and Deposit on every page.</p>
    </>
  );
}
