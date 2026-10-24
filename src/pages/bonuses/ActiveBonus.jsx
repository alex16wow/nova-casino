import Button from '../../components/ui/Button.jsx';
import { formatAmount } from '../../context/PlayerContext.jsx';
import { wagerTarget } from '../../data/bonuses.js';
import StatusBadge from '../profile/StatusBadge.jsx';
import { daysLeft, shortDate } from './terms.js';

const money = (code, n) => `${formatAmount(code, n)} ${code}`;

// Highlighted current bonus: money (bonus funds + wagering progress) or free spins left.
export default function ActiveBonus({ bonus, onTerms, onGames, onCancel, onBrowse }) {
  if (!bonus) {
    return (
      <section className="nv-panel nv-active-bonus is-empty" aria-labelledby="activeBonusTitle">
        <div>
          <h2 id="activeBonusTitle">No active bonus</h2>
          <p>Claim a reward or activate an offer to start one.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={onBrowse}>Browse available</Button>
      </section>
    );
  }
  const target = bonus.kind === 'money' ? wagerTarget(bonus) : 0;
  const percent = target ? Math.min(100, Math.round((bonus.wagered / target) * 100)) : 0;
  const left = daysLeft(bonus.expiresAt);

  return (
    <section className="nv-panel nv-active-bonus" aria-labelledby="activeBonusTitle">
      <div className="nv-active-bonus-top">
        <span className="nv-active-bonus-eyebrow">Active bonus · {bonus.type}</span>
        <StatusBadge tone="success">Active</StatusBadge>
      </div>
      <h2 id="activeBonusTitle">{bonus.title}</h2>
      <div className="nv-active-bonus-facts">
        {bonus.kind === 'money' ? (
          <div><span>Bonus balance</span><strong>{money(bonus.code, bonus.amount)}</strong></div>
        ) : (
          <div><span>Free spins left</span><strong>{bonus.spinsLeft} / {bonus.spins}</strong></div>
        )}
        <div><span>Expires</span><strong>{shortDate(bonus.expiresAt)}</strong><small>{left ? `in ${left} ${left === 1 ? 'day' : 'days'}` : 'today'}</small></div>
        {bonus.kind === 'money' ? <div><span>Max bet</span><strong>{money(bonus.code, bonus.maxBet)}</strong></div> : <div><span>Game</span><strong>{bonus.game}</strong></div>}
      </div>
      {bonus.kind === 'money' && (
        <div className="nv-wager">
          <div className="nv-wager-line"><span>Wagering</span><strong>{money(bonus.code, bonus.wagered)} / {money(bonus.code, target)} · {percent}%</strong></div>
          <div className="nv-progress" role="progressbar" aria-label="Wagering progress" aria-valuemin="0" aria-valuemax={target} aria-valuenow={bonus.wagered}><span style={{ width: `${percent}%` }} /></div>
          <p className="nv-field-hint">{bonus.wager}× the bonus amount ({money(bonus.code, bonus.amount)}) = {money(bonus.code, target)}. Only eligible slots count.</p>
        </div>
      )}
      <div className="nv-active-bonus-actions">
        <Button variant="secondary" size="sm" onClick={() => onTerms(bonus)}>View terms</Button>
        <Button variant="secondary" size="sm" onClick={onGames}>Eligible games</Button>
        <Button variant="ghost" size="sm" className="nv-btn--danger-text" onClick={() => onCancel(bonus)}>Cancel bonus</Button>
      </div>
    </section>
  );
}
