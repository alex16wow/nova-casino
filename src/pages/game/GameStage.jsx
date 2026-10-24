import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { asset } from '../../lib/asset.js';
import { getDemo } from '../../lib/demo.js';

// Every game opens the provider's public Gates of Olympus demo for now; the game has its own balance, bet and spin UI.
const DEMO_URL = 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=EN&cur=USD';
const TIMEOUT_MS = 20000;

// Provider game window: sign-in prompt for guests, then the game iframe behind a loading screen.
export default function GameStage({ game }) {
  const { isGuest, openAuth } = useAuth();
  const [phase, setPhase] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (isGuest) return;
    if (getDemo().provider === 'down') { setPhase('error'); return; }
    setPhase('loading');
    const timer = setTimeout(() => setPhase((p) => (p === 'loading' ? 'error' : p)), TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isGuest, attempt]);

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
      {phase !== 'error' && (
        <iframe
          key={attempt}
          className="nv-game-frame"
          src={DEMO_URL}
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
