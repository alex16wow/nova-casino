import { Link } from 'react-router-dom';
import { useSupport } from '../../context/SupportContext.jsx';
import { dateTime, fullDate } from '../../data/settings.js';
import Button from '../ui/Button.jsx';

// Shown wherever games or deposits are paused by a break or self-exclusion (game window, Deposit).
// Account, history, withdrawals and Support stay open. No offers here.
export default function RestrictionNotice({ restriction, what = 'Games and deposits are', compact = false }) {
  const { toggle } = useSupport();
  const exclusion = restriction.type === 'exclusion';
  const title = exclusion ? `You’re self-excluded until ${fullDate(restriction.until)}` : `You’re on a break until ${dateTime(restriction.until)}`;
  return (
    <div className={`nv-restriction${compact ? ' is-compact' : ''}`} role="status">
      <span className="nv-restriction-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M10 9v6M14 9v6" /></svg>
      </span>
      <div className="nv-restriction-copy">
        <strong>{title}</strong>
        <p>{what} paused. You can still view your account and history, withdraw available funds and contact Support.</p>
      </div>
      <div className="nv-restriction-actions">
        <Link className="nv-btn nv-btn--secondary nv-btn--sm" to="/account/wallet?tab=withdraw">Withdraw funds</Link>
        <Button variant="ghost" size="sm" onClick={toggle}>Contact Support</Button>
      </div>
    </div>
  );
}
