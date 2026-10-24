import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { formatAmount } from '../../context/PlayerContext.jsx';
import { eligibleGames, restrictedText, wagerTarget } from '../../data/bonuses.js';
import StatusBadge from '../profile/StatusBadge.jsx';
import { shortDate, statusInfo, termRows, valueOf } from './terms.js';

const money = (code, n) => `${formatAmount(code, n)} ${code}`;

// Terms of an offer or a bonus record. Records add their status, dates and wagering progress.
export function BonusDetails({ item, onClose, action }) {
  const record = Boolean(item?.status);
  const rows = item ? termRows(item).filter(([k]) => !(record && k === 'Valid for')) : [];
  return (
    <Modal open={Boolean(item)} onClose={onClose} title={item?.title} subtitle={item && `${item.type} · ${valueOf(item)}`}>
      {item && (
        <div className="nv-form">
          {record && (
            <dl className="nv-summary">
              <div><dt>Status</dt><dd><StatusBadge tone={statusInfo[item.status][1]}>{statusInfo[item.status][0]}</StatusBadge></dd></div>
              <div><dt>Claimed</dt><dd>{shortDate(item.claimedAt)}</dd></div>
              {item.finishedAt ? <div><dt>Ended</dt><dd>{shortDate(item.finishedAt)}</dd></div> : <div><dt>Expires</dt><dd>{shortDate(item.expiresAt)}</dd></div>}
              {item.kind === 'money' && <div><dt>Wagered</dt><dd>{money(item.code, item.wagered)} / {money(item.code, wagerTarget(item))}</dd></div>}
            </dl>
          )}
          <dl className="nv-terms">
            {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <div className="nv-wallet-actions">
            <Button variant="secondary" onClick={onClose} data-autofocus>Close</Button>
            {action}
          </div>
        </div>
      )}
    </Modal>
  );
}

export function EligibleGames({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Eligible games" subtitle="Slots count 100% towards wagering." size="sm">
      <div className="nv-form">
        <ul className="nv-games-list">{eligibleGames.map((g) => <li key={g}>{g}</li>)}</ul>
        <p className="nv-note">{restrictedText}</p>
        <Button variant="secondary" block onClick={onClose} data-autofocus>Close</Button>
      </div>
    </Modal>
  );
}

// Confirmation that spells out exactly what is lost.
export function CancelBonus({ bonus, realBalance, onKeep, onConfirm }) {
  return (
    <Modal open={Boolean(bonus)} onClose={onKeep} title={bonus ? `Cancel ${bonus.title}?` : ''} size="confirm">
      {bonus && (
        <div className="nv-form">
          <ul className="nv-loss-list">
            {bonus.kind === 'money' ? (
              <>
                <li>You lose <b>{money(bonus.code, bonus.amount)}</b> of bonus funds.</li>
                <li>Your wagering progress (<b>{money(bonus.code, bonus.wagered)} of {money(bonus.code, wagerTarget(bonus))}</b>) is reset and can’t be restored.</li>
              </>
            ) : (
              <li>You lose <b>{bonus.spinsLeft} unused free spins</b> in {bonus.game}.</li>
            )}
            <li>Your real balance (<b>{money(realBalance.code, realBalance.amount)}</b>) stays the same.</li>
          </ul>
          <p className="nv-field-hint">Demo funds only. This can’t be undone.</p>
          <div className="nv-form-row">
            <Button variant="secondary" className="nv-grow" data-autofocus onClick={onKeep}>Keep bonus</Button>
            <Button className="nv-grow nv-btn--danger" onClick={onConfirm}>Cancel bonus</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// Shown when a second money bonus is requested: the active one is never replaced automatically.
export function OneActive({ info, onClose, onShowActive }) {
  return (
    <Modal open={Boolean(info)} onClose={onClose} title="You already have an active bonus" size="confirm">
      {info && (
        <div className="nv-form">
          <p className="nv-modal-text"><b>{info.active.title}</b> is active. Only one money bonus can run at a time, so <b>{info.offer.title}</b> can’t be activated now. Finish its wagering or cancel it, then come back.</p>
          <div className="nv-form-row">
            <Button variant="secondary" className="nv-grow" data-autofocus onClick={onClose}>OK</Button>
            <Button className="nv-grow" onClick={onShowActive}>View active bonus</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
