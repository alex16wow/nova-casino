import { useEffect, useRef, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { asset } from '../../lib/asset.js';
import { getDemo } from '../../lib/demo.js';

// Sample bet ladders; crypto uses its own scale.
const betSteps = {
  BTC: [0.0001, 0.0002, 0.0005, 0.001, 0.0025, 0.005],
  ETH: [0.005, 0.01, 0.02, 0.05, 0.1, 0.2],
  default: [0.2, 0.5, 1, 2, 5, 10, 20, 50, 100],
};
const multipliers = [0, 0, 0, 0, 0, 0.5, 1, 1.5, 2, 3, 5, 10, 25];
const winning = multipliers.filter(Boolean);

// The demo panel can force the result of every round.
function roll() {
  const { outcome } = getDemo();
  const list = outcome === 'win' ? winning : outcome === 'lose' ? [0] : multipliers;
  return list[Math.floor(Math.random() * list.length)];
}
const LOAD_MS = 1400;
const ROUND_MS = 900;

const formatBet = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

// Stand-in for the provider's game window: sign-in prompt for guests, a loading screen,
// then a simple client where each round takes the bet from the balance and may pay it back.
export default function GameStage({ game, onDeposit }) {
  const { isGuest, openAuth } = useAuth();
  const [phase, setPhase] = useState(isGuest ? 'gate' : 'loading');

  useEffect(() => {
    if (isGuest) { setPhase('gate'); return; }
    setPhase('loading');
    const timer = setTimeout(() => setPhase('playing'), LOAD_MS);
    return () => clearTimeout(timer);
  }, [isGuest]);

  return (
    <div className={`nv-game-stage is-${phase}`}>
      <img className="nv-game-backdrop" src={asset(game.image)} alt="" aria-hidden="true" />
      {phase === 'gate' && (
        <div className="nv-game-gate">
          <img className="nv-game-cover" src={asset(game.image)} alt="" />
          <h2>Log in to play {game.name}</h2>
          <p>Create an account or log in to play for real money.</p>
          <div className="nv-game-gate-actions">
            <Button variant="secondary" onClick={() => openAuth('login')}>Log in</Button>
            <Button onClick={() => openAuth('register')}>Sign up</Button>
          </div>
        </div>
      )}
      {phase === 'loading' && (
        <div className="nv-game-loader" role="status">
          <img className="nv-game-cover" src={asset(game.image)} alt="" />
          <span className="nv-game-progress" style={{ '--load-ms': `${LOAD_MS}ms` }}><span /></span>
          <p>Loading {game.name}…</p>
        </div>
      )}
      {phase === 'playing' && <GameClient game={game} onDeposit={onDeposit} />}
    </div>
  );
}

function GameClient({ game, onDeposit }) {
  const { currency, deposit } = usePlayer();
  const steps = betSteps[currency.code] ?? betSteps.default;
  const [betIndex, setBetIndex] = useState(2);
  const [round, setRound] = useState({ busy: false, result: null, id: 0 });
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const index = Math.min(betIndex, steps.length - 1);
  const bet = steps[index];
  const slot = game.format === 'Video slot';
  const lowFunds = currency.amount < bet;

  const play = () => {
    if (round.busy) return;
    if (lowFunds) { setRound((r) => ({ ...r, result: { type: 'funds' }, id: r.id + 1 })); return; }
    const code = currency.code;
    deposit(code, -bet);
    setRound((r) => ({ busy: true, result: null, id: r.id }));
    timer.current = setTimeout(() => {
      const win = bet * roll();
      if (win) deposit(code, win);
      setRound((r) => ({ busy: false, result: win ? { type: 'win', text: `${formatBet(win)} ${code}` } : { type: 'lose' }, id: r.id + 1 }));
    }, ROUND_MS);
  };

  const { result } = round;
  return (
    <div className="nv-game-client">
      <div className="nv-game-screen">
        <img className={`nv-game-art${round.busy ? ' is-spinning' : ''}`} src={asset(game.image)} alt={game.name} />
        {result && (
          <div key={round.id} className={`nv-game-result is-${result.type}`} role="status">
            {result.type === 'win' && <><small>You win</small><strong>{result.text}</strong></>}
            {result.type === 'lose' && <strong>No win this time</strong>}
            {result.type === 'funds' && (
              <>
                <strong>Not enough funds</strong>
                <Button size="sm" onClick={onDeposit}>Deposit</Button>
              </>
            )}
          </div>
        )}
      </div>
      <div className="nv-game-controls">
        <div className="nv-game-stat">
          <small>Balance</small>
          <strong>{currency.balance} <span>{currency.code}</span></strong>
        </div>
        <div className="nv-game-bet" role="group" aria-label="Bet">
          <button type="button" aria-label="Lower bet" disabled={index === 0 || round.busy} onClick={() => setBetIndex(index - 1)}>−</button>
          <div className="nv-game-stat">
            <small>Bet</small>
            <strong>{formatBet(bet)} <span>{currency.code}</span></strong>
          </div>
          <button type="button" aria-label="Raise bet" disabled={index === steps.length - 1 || round.busy} onClick={() => setBetIndex(index + 1)}>+</button>
        </div>
        <Button className="nv-game-spin" loading={round.busy} onClick={play}>{slot ? 'Spin' : 'Place bet'}</Button>
      </div>
    </div>
  );
}
