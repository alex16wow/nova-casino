import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { SkeletonLine } from '../../components/ui/Skeleton.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { Heart } from '../../components/ui/icons.jsx';
import { useAccountAction, useAuth } from '../../context/AuthContext.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { categoryKeywords, shelves } from '../../data/games.js';
import { useBreakpoint } from '../../hooks/useMediaQuery.js';
import { asset } from '../../lib/asset.js';
import GameShelf from '../home/GameShelf.jsx';
import NotFoundPage from '../not-found/NotFoundPage.jsx';
import GameStage from './GameStage.jsx';
import { useFullscreen } from './useFullscreen.js';
import { useGameData } from './useGameData.js';

const icon = { viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
const Expand = () => <svg {...icon}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>;
const Collapse = () => <svg {...icon}><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>;
const Back = () => <svg {...icon} width="16" height="16"><path d="M15 6l-6 6 6 6" /></svg>;

// Game page (/game/:slug): the game frame with its toolbar, details and similar games.
export default function GamePage() {
  const { slug } = useParams();
  const { mobile, touch } = useBreakpoint();
  const { status, data, error, reload } = useGameData(slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (status === 'error' && error.code === 'not_found') {
    return <NotFoundPage />;
  }

  const game = data?.game;
  const kind = game?.kind ?? 'top';
  const similarShelf = { ...shelves[kind], id: 'similar-games', rowId: 'similar-row', title: 'You may also like', sub: `More ${categoryKeywords[kind][0].toLowerCase()} and player favorites`, label: 'similar games', eight: false };

  return (
    <div className="nv-game-page">
      <nav className="nv-crumbs" aria-label="Breadcrumbs">
        <Link to="/" className="nv-crumbs-back"><Back />Home</Link>
        <span aria-hidden="true">/</span>
        {game ? <><Link to={`/${shelves[kind].page}`} className="nv-crumbs-back">{categoryKeywords[kind][0]}</Link><span aria-hidden="true">/</span><span aria-current="page">{game.name}</span></> : <SkeletonLine width="120px" />}
      </nav>

      {status === 'ready' ? (
        <GameFrame key={slug} game={game} />
      ) : (
        <section className="nv-game" aria-busy={status === 'loading' || undefined}>
          <div className="nv-game-bar">
            <div className="nv-game-title"><SkeletonLine width="180px" /></div>
          </div>
          <div className="nv-game-stage is-empty">
            {status === 'error'
              ? <StateMessage kind="error" title="Couldn’t load the game" text={error.message} action="Try again" onAction={reload} />
              : <span className="nv-spinner nv-game-spinner" aria-label="Loading" />}
          </div>
        </section>
      )}

      {game && (
        <section className="nv-game-info" aria-label="About the game">
          <dl className="nv-game-facts">
            <div><dt>Provider</dt><dd>{game.provider}</dd></div>
            <div><dt>Type</dt><dd>{game.format}</dd></div>
            <div><dt>RTP</dt><dd>{game.rtp}</dd></div>
            <div><dt>Volatility</dt><dd>{game.volatility}</dd></div>
            <div><dt>Max win</dt><dd>{game.maxWin}</dd></div>
          </dl>
          <p>{game.about}</p>
        </section>
      )}

      {status !== 'error' && (
        <GameShelf key={`similar-${slug}`} shelf={similarShelf} mobile={mobile} touch={touch} status={status} games={data?.similar} onRetry={reload} />
      )}
    </div>
  );
}

function GameFrame({ game }) {
  const frame = useRef(null);
  const fullscreen = useFullscreen(frame);
  const { isFavorite, toggleFavorite, openDeposit } = usePlayer();
  const gate = useAccountAction();
  const { isGuest } = useAuth();
  const saved = isFavorite(game.name);
  const note = useFavoriteNote();

  // Dialogs render outside the frame, so native fullscreen is left before one opens.
  const leaveNative = () => document.fullscreenElement && document.exitFullscreen();
  const deposit = gate(() => { leaveNative(); openDeposit(); }, 'register');
  const favorite = gate(() => note.show(toggleFavorite(game.name) ? 'Added to Favorites' : 'Removed from Favorites'), 'login');

  const cls = ['nv-game', fullscreen.active && 'is-fullscreen', fullscreen.pinned && 'is-pinned'].filter(Boolean).join(' ');
  return (
    <section className={cls} ref={frame} aria-label={game.name}>
      <div className="nv-game-bar">
        <div className="nv-game-title">
          <img src={asset(game.image)} alt="" width="40" height="40" />
          <div>
            <h1>{game.name}</h1>
            <p>{game.provider}</p>
          </div>
        </div>
        <div className="nv-game-actions">
          <span className="nv-fav-anchor">
            <button type="button" className={`nv-icon-btn${saved ? ' is-saved' : ''}`} aria-label={saved ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={saved} onClick={(e) => { if (isGuest) leaveNative(); favorite(e); }}>
              <Heart />
            </button>
            <span className={`nv-fav-note${note.visible ? ' is-shown' : ''}`} role="status" aria-live="polite">{note.text}</span>
          </span>
          <button type="button" className="nv-icon-btn" aria-label={fullscreen.active ? 'Exit fullscreen' : 'Fullscreen'} onClick={fullscreen.toggle}>
            {fullscreen.active ? <Collapse /> : <Expand />}
          </button>
          {!isGuest && <Button size="sm" onClick={deposit}>Deposit</Button>}
        </div>
      </div>
      <GameStage game={game} />
    </section>
  );
}

// Small note under the heart button that hides itself after 2.5 s. Lives inside the frame, so it shows in fullscreen too.
function useFavoriteNote() {
  const [note, setNote] = useState({ text: '', visible: false });
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  return {
    ...note,
    show(text) {
      setNote({ text, visible: true });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setNote((n) => ({ ...n, visible: false })), 2500);
    },
  };
}
