import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { asset } from '../../lib/asset.js';
import { getDemo } from '../../lib/demo.js';

// Games open the provider's public demo (it has its own balance, bet and spin UI).
// Without a demo the window tries for a moment and ends in the error state.
const TIMEOUT_MS = 20000;
const NO_DEMO_MS = 2500;

// Provider game window: sign-in prompt for guests, then the game iframe behind a loading screen.
export default function GameStage({ game }) {
  const { isGuest, openAuth } = useAuth();
  const [phase, setPhase] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (isGuest) return;
    if (getDemo().provider === 'down') { setPhase('error'); return; }
    setPhase('loading');
    const timer = setTimeout(() => setPhase((p) => (p === 'loading' ? 'error' : p)), game.demo ? TIMEOUT_MS : NO_DEMO_MS);
    return () => clearTimeout(timer);
  }, [isGuest, attempt, game.demo]);

  if (isGuest) {
    return (
      <div className="nv-game-stage is-gate">
        <img className="nv-game-backdrop" src={asset(game.image)} alt="" aria-hidden="true" />
        <div className="nv-game-gate">
          <img className="nv-game-cover" src={asset(game.image)} alt="" />
          <h2>Log in to play {game.name}</h2>
          <p>Create an account or log in to play for real money.</p>
          <div className="nv-game-gate-actions">
            <Button variant="secondary" onClick={() => openAuth('login')}>Log in</Button>
            <Button onClick={() => openAuth('register')}>Sign up</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`nv-game-stage is-${phase}`}>
      <img className="nv-game-backdrop" src={asset(game.image)} alt="" aria-hidden="true" />
      {phase !== 'error' && game.demo && (
        <iframe
          key={attempt}
          className="nv-game-frame"
          src={game.demo}
          title={game.name}
          allow="autoplay; fullscreen"
          allowFullScreen
          onLoad={() => setPhase('playing')}
        />
      )}
      {phase === 'loading' && (
        <div className="nv-game-loader" role="status">
          <img className="nv-game-cover" src={asset(game.image)} alt="" />
          <span className="nv-game-progress"><span /></span>
          <p>Loading {game.name}…</p>
        </div>
      )}
      {phase === 'error' && (
        <StateMessage compact kind="error" title="The game didn’t load" text="The provider isn’t responding. Try again in a moment." action="Try again" onAction={() => setAttempt((n) => n + 1)} />
      )}
    </div>
  );
}
