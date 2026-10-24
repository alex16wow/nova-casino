import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import { Checkbox, SelectField, TextField } from '../../components/ui/Field.jsx';
import Modal from '../../components/ui/Modal.jsx';
import StatusBadge from '../profile/StatusBadge.jsx';
import { formatAmount, usePlayer } from '../../context/PlayerContext.jsx';
import { isStricter, useSettings } from '../../context/SettingsContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useDepositGuard from '../../hooks/useDepositGuard.js';
import { LIMIT_INCREASE_LABEL, addMonths, breakOptions, dateTime, exclusionOptions, fullDate, limitPeriod, limitPeriods, reminderOptions } from '../../data/settings.js';
import { saveSetting } from '../../lib/api.js';
import { Segmented, SettingRow, SettingsCard } from './parts.jsx';

const money = (code, n) => `${formatAmount(code, n)} ${code}`;
const limitText = (l) => (l ? `${money(l.code, l.amount)} per ${limitPeriod(l.period).noun}` : 'no limit');

// Responsible gaming: deposit limit, session reminder, take a break and self-exclusion.
// A break or self-exclusion pauses games and Deposit everywhere (see RestrictionNotice).
export default function ResponsibleGaming() {
  const { restriction, settings } = useSettings();
  return (
    <SettingsCard id="rg" title="Responsible gaming" text="Tools to keep play under control. Lower limits apply at once; higher ones wait." className="nv-settings-card--wide">
      {restriction && <ActiveRestriction restriction={restriction} />}
      <div className="nv-settings-split">
        <DepositLimit key={JSON.stringify(settings.limit)} />
        <div>
          <SessionReminder />
          <TakeBreak />
        </div>
      </div>
      <SelfExclusion />
    </SettingsCard>
  );
}

function ActiveRestriction({ restriction }) {
  const exclusion = restriction.type === 'exclusion';
  return (
    <div className="nv-rg-active" role="status">
      <StatusBadge tone="warning">{exclusion ? 'Self-excluded' : 'On a break'}</StatusBadge>
      <p>
        {exclusion ? `Until ${fullDate(restriction.until)}` : `Until ${dateTime(restriction.until)}`}. Games and deposits are paused and this can’t be ended early.
        Your account, history, withdrawals and Support stay available.
      </p>
    </div>
  );
}

function amountError(value) {
  if (value === '') return 'Enter an amount';
  const n = Number(value.replace(',', '.'));
  if (!Number.isFinite(n) || n <= 0) return 'Enter an amount above zero';
  if (n > 1e6) return 'Enter 1,000,000 or less';
  if (!/^\d+([.,]\d{1,2})?$/.test(value)) return 'Use up to 2 decimal places';
  return '';
}

// Deposit limit form: amount, currency and period. Save changes / Cancel.
function DepositLimit() {
  const { settings, saveLimit, cancelPendingLimit } = useSettings();
  const { currencies, currency } = usePlayer();
  const { limitInfo } = useDepositGuard();
  const toast = useToast();
  const { limit, pendingLimit } = settings;
  const fromLimit = (l) => ({ amount: l ? String(l.amount) : '', code: l?.code ?? currency.code, period: l?.period ?? 'daily' });
  const [values, setValues] = useState(() => fromLimit(limit));
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState('');

  const error = amountError(values.amount);
  const next = error ? null : { amount: Number(values.amount.replace(',', '.')), code: values.code, period: values.period };
  const dirty = values.amount !== (limit ? String(limit.amount) : '') || (limit ? values.code !== limit.code || values.period !== limit.period : false);
  const usage = limit && limitInfo(limit.code);

  const set = (key) => (value) => { setValues((v) => ({ ...v, [key]: value })); setAlert(''); };
  const reset = () => { setValues(fromLimit(limit)); setTried(false); setAlert(''); };

  const apply = async (target) => {
    setSaving(true);
    setAlert('');
    try {
      await saveSetting();
      const when = saveLimit(target);
      if (when === 'now') toast(target ? `Limit saved: ${limitText(target)}` : 'Limit removed');
      else toast(`${target ? 'Higher limit' : 'Removing the limit'} takes effect ${dateTime(when)}`);
      setValues(fromLimit(when === 'now' ? target : limit));
      setTried(false);
    } catch (err) {
      setAlert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    setTried(true);
    if (error) { e.currentTarget.querySelector('[name="limitAmount"]')?.focus(); return; }
    apply(next);
  };

  const willWait = next && dirty && !isStricter(next, limit);
  return (
    <form className="nv-rg-limit" onSubmit={submit} noValidate>
      <div className="nv-setting-copy">
        <strong>Deposit limit</strong>
        <p>{limit ? <>Current: <b>{limitText(limit)}</b>{usage && <> · {money(limit.code, usage.used)} used, {money(limit.code, usage.left)} left</>}</> : 'No limit set. Applies to deposits in the chosen currency.'}</p>
      </div>
      {pendingLimit && (
        <p className="nv-note">
          Change to <b>{limitText(pendingLimit.limit)}</b> takes effect {dateTime(pendingLimit.effectiveAt)}.{' '}
          <button type="button" className="nv-text-link" onClick={() => { cancelPendingLimit(); toast('Pending change cancelled'); }}>Cancel change</button>
        </p>
      )}
      {alert && <p className="nv-form-alert" role="alert">{alert}</p>}
      <div className="nv-rg-limit-fields">
        <TextField name="limitAmount" label="Amount" inputMode="decimal" placeholder="e.g. 500" value={values.amount} onChange={(e) => set('amount')(e.target.value.replace(/[^\d.,]/g, ''))} error={tried ? error : ''} disabled={saving} />
        <SelectField label="Currency" value={values.code} onChange={(e) => set('code')(e.target.value)} options={currencies.map((c) => ({ value: c.code, label: c.code }))} disabled={saving} />
      </div>
      <Segmented label="Limit period" options={limitPeriods.map((p) => ({ value: p.id, label: p.label }))} value={values.period} onChange={set('period')} disabled={saving} />
      {willWait && <p className="nv-field-hint">Higher limits and currency changes take effect after a {LIMIT_INCREASE_LABEL} waiting period.</p>}
      <div className="nv-setting-actions">
        {limit && !dirty && <Button variant="ghost" size="sm" className="nv-btn--danger-text" disabled={saving} onClick={() => apply(null)}>Remove limit</Button>}
        {dirty && <Button variant="secondary" size="sm" onClick={reset} disabled={saving}>Cancel</Button>}
        <Button type="submit" size="sm" loading={saving} disabled={!dirty}>Save changes</Button>
      </div>
    </form>
  );
}

function SessionReminder() {
  const { settings, setReminder } = useSettings();
  const toast = useToast();
  return (
    <SettingRow label="Session reminder" text="A pop-up tells you how long you’ve been playing." className="nv-setting--stack">
      <Segmented
        label="Session reminder"
        options={reminderOptions}
        value={settings.reminder}
        onChange={(m) => { setReminder(m); toast(m ? `Reminder every ${m} minutes` : 'Session reminder off'); }}
      />
    </SettingRow>
  );
}

function TakeBreak() {
  const { restriction, takeBreak } = useSettings();
  const toast = useToast();
  const [choice, setChoice] = useState(breakOptions[0].id);
  const [confirm, setConfirm] = useState(false);
  const option = breakOptions.find((o) => o.id === choice);
  return (
    <SettingRow label="Take a break" text="Pause games and deposits for a while. A break can’t be ended early." className="nv-setting--stack">
      <Segmented label="Break length" options={breakOptions.map((o) => ({ value: o.id, label: o.label }))} value={choice} onChange={setChoice} disabled={Boolean(restriction)} />
      <Button variant="secondary" size="sm" disabled={Boolean(restriction)} onClick={() => setConfirm(true)}>Take a break</Button>
      <Modal open={confirm} onClose={() => setConfirm(false)} title={`Take a ${option.label} break?`} size="sm">
        <div className="nv-form">
          <p className="nv-modal-text">Until <b>{dateTime(new Date(Date.now() + option.ms).toISOString())}</b> you won’t be able to play games or deposit. You can’t undo this early.</p>
          <p className="nv-modal-text">Your account, history, withdrawals and Support stay available.</p>
          <div className="nv-modal-actions">
            <Button variant="secondary" onClick={() => setConfirm(false)} data-autofocus>Cancel</Button>
            <Button onClick={() => { takeBreak(option); setConfirm(false); toast(`Break started for ${option.label}`); }}>Start break</Button>
          </div>
        </div>
      </Modal>
    </SettingRow>
  );
}

function SelfExclusion() {
  const { restriction, selfExclude } = useSettings();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const excluded = restriction?.type === 'exclusion';
  return (
    <SettingRow label="Self-exclusion" text="Close access to games and deposits for 6 months or longer. It can’t be reversed before the end date." className="nv-setting--danger">
      <Button variant="ghost" size="sm" className="nv-btn--danger-outline" disabled={excluded} onClick={() => setOpen(true)}>Self-exclude</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Self-exclude" subtitle="Choose how long to close access to games and deposits." size="sm">
        {open && <ExclusionForm onCancel={() => setOpen(false)} onConfirm={(option) => { selfExclude(option); setOpen(false); toast(`Self-excluded for ${option.label}`); }} />}
      </Modal>
    </SettingRow>
  );
}

function ExclusionForm({ onCancel, onConfirm }) {
  const [term, setTerm] = useState(exclusionOptions[0].id);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const option = exclusionOptions.find((o) => o.id === term);
  const submit = (e) => {
    e.preventDefault();
    if (!agreed) { setError('Confirm that you understand'); return; }
    onConfirm(option);
  };
  return (
    <form className="nv-form" onSubmit={submit} noValidate>
      <Segmented label="Self-exclusion period" options={exclusionOptions.map((o) => ({ value: o.id, label: o.label }))} value={term} onChange={setTerm} />
      <p className="nv-modal-text">Access to games and deposits closes until <b>{fullDate(addMonths(Date.now(), option.months).toISOString())}</b>. You can still log in to withdraw your balance and contact Support.</p>
      <Checkbox checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setError(''); }} error={error} label="I understand this can’t be undone before the end date." />
      <div className="nv-modal-actions">
        <Button variant="secondary" onClick={onCancel} data-autofocus>Cancel</Button>
        <Button type="submit" variant="danger">Self-exclude for {option.label}</Button>
      </div>
    </form>
  );
}
