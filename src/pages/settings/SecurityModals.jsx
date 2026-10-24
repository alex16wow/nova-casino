import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import { PasswordField, TextField } from '../../components/ui/Field.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { TEST_2FA_CODE } from '../../data/settings.js';
import { changePassword } from '../../lib/api.js';
import { DemoTag } from './parts.jsx';

const rules = [
  ['length', 'At least 8 characters', (v) => v.length >= 8],
  ['mix', 'Letters and numbers', (v) => /[a-z]/i.test(v) && /\d/.test(v)],
];

function validatePassword({ current, next, confirm }) {
  const e = {};
  if (!current) e.current = 'Enter your current password';
  if (!next) e.next = 'Enter a new password';
  else if (rules.some(([, , ok]) => !ok(next))) e.next = 'Use at least 8 characters with letters and numbers';
  else if (next === current) e.next = 'Choose a password different from the current one';
  if (!confirm) e.confirm = 'Repeat the new password';
  else if (next && confirm !== next) e.confirm = 'Passwords don’t match';
  return e;
}

// Change password (demo): checks the fields and shows success. Values live only in this form's state;
// nothing is saved, logged or applied to the real account.
export function PasswordModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Change password" subtitle="Demo flow: your real password isn’t changed or stored." size="sm">
      {open && <PasswordForm onClose={onClose} />}
    </Modal>
  );
}

function PasswordForm({ onClose }) {
  const [values, setValues] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState('');
  const [done, setDone] = useState(false);

  const set = (key) => (e) => {
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    if (tried) setErrors(validatePassword(next));
  };

  const submit = async (e) => {
    e.preventDefault();
    setTried(true);
    const found = validatePassword(values);
    setErrors(found);
    if (Object.keys(found).length) { e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus(); return; }
    setBusy(true);
    setAlert('');
    try {
      await changePassword({ current: values.current });
      setValues({ current: '', next: '', confirm: '' });
      setDone(true);
    } catch (err) {
      if (err.code === 'credentials') setErrors({ current: err.message });
      else setAlert(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="nv-settings-result" role="status">
        <span className="nv-settings-result-icon is-success" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>
        <strong>Password changed</strong>
        <p>This was a demo, so your login details stay the same.</p>
        <Button block onClick={onClose} data-autofocus>Done</Button>
      </div>
    );
  }

  return (
    <form className="nv-form" onSubmit={submit} noValidate>
      {alert && <p className="nv-form-alert" role="alert">{alert}</p>}
      <PasswordField name="current" label="Current password" autoComplete="current-password" value={values.current} onChange={set('current')} error={errors.current} disabled={busy} data-autofocus />
      <PasswordField name="next" label="New password" autoComplete="new-password" value={values.next} onChange={set('next')} error={errors.next} disabled={busy} showStrength />
      <ul className="nv-pass-rules" aria-label="Password requirements">
        {rules.map(([id, text, ok]) => <li key={id} className={ok(values.next) ? 'is-met' : ''}>{text}</li>)}
      </ul>
      <PasswordField name="confirm" label="Confirm new password" autoComplete="new-password" value={values.confirm} onChange={set('confirm')} error={errors.confirm} valid={Boolean(values.confirm) && values.confirm === values.next} disabled={busy} />
      <div className="nv-modal-actions">
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button type="submit" loading={busy}>Change password</Button>
      </div>
    </form>
  );
}

// Decorative stand-in for a QR code: a fixed pattern, not scannable and not tied to any secret.
const QR_SIZE = 21;
const finder = (x, y) => [[0, 0], [QR_SIZE - 7, 0], [0, QR_SIZE - 7]].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
const finderOn = (x, y) => {
  const fx = x < 7 ? x : x - (QR_SIZE - 7), fy = y < 7 ? y : y - (QR_SIZE - 7);
  const ring = Math.max(Math.abs(fx - 3), Math.abs(fy - 3));
  return ring !== 2;
};
const qrCells = [];
for (let y = 0; y < QR_SIZE; y++) for (let x = 0; x < QR_SIZE; x++) {
  const on = finder(x, y) ? finderOn(x, y) : ((x * 7 + y * 13 + x * y) % 5) < 2;
  if (on) qrCells.push([x, y]);
}
function DemoQr() {
  return (
    <svg className="nv-demo-qr" viewBox={`-1 -1 ${QR_SIZE + 2} ${QR_SIZE + 2}`} role="img" aria-label="Demo pattern, not a real QR code">
      <rect x="-1" y="-1" width={QR_SIZE + 2} height={QR_SIZE + 2} rx="1.2" fill="#fff" />
      {qrCells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill="#14112b" />)}
    </svg>
  );
}

// Two-factor authentication (demo): explanation → test code → enabled. Turning it off asks to confirm.
export function TwoFactorModal({ mode, onClose, onEnable, onDisable }) {
  return (
    <Modal open={Boolean(mode)} onClose={onClose} title={mode === 'disable' ? 'Turn off two-factor authentication?' : 'Set up two-factor authentication'} size="sm">
      {mode === 'setup' && <TwoFactorSetup onClose={onClose} onEnable={onEnable} />}
      {mode === 'disable' && (
        <div className="nv-form">
          <p className="nv-modal-text">Logging in will only need your password. In this demo nothing else changes.</p>
          <div className="nv-modal-actions">
            <Button variant="secondary" onClick={onClose} data-autofocus>Keep it on</Button>
            <Button variant="danger" onClick={onDisable}>Turn off</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function TwoFactorSetup({ onClose, onEnable }) {
  const [step, setStep] = useState('intro');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const verify = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) { setError('Enter the 6-digit code'); return; }
    if (code !== TEST_2FA_CODE) { setError(`That code doesn’t match. In this demo, use ${TEST_2FA_CODE}.`); return; }
    setCode('');
    onEnable();
    setStep('done');
  };

  if (step === 'intro') {
    return (
      <div className="nv-form">
        <DemoTag>Demo: no real protection is added</DemoTag>
        <p className="nv-modal-text">Two-factor authentication asks for a one-time code from an authenticator app each time you log in, so a stolen password alone isn’t enough.</p>
        <p className="nv-modal-text">This prototype only shows the steps. No secret key is created and your account works as before.</p>
        <div className="nv-modal-actions">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => setStep('code')} data-autofocus>Continue</Button>
        </div>
      </div>
    );
  }
  if (step === 'code') {
    return (
      <form className="nv-form" onSubmit={verify} noValidate>
        <div className="nv-2fa-scan">
          <DemoQr />
          <p>In a real setup you would scan this with an authenticator app. This pattern is only an illustration.</p>
        </div>
        <TextField name="code" label="6-digit code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }} error={error} hint={`Test code for this demo: ${TEST_2FA_CODE}`} data-autofocus />
        <div className="nv-modal-actions">
          <Button variant="secondary" onClick={() => setStep('intro')}>Back</Button>
          <Button type="submit">Turn on</Button>
        </div>
      </form>
    );
  }
  return (
    <div className="nv-settings-result" role="status">
      <span className="nv-settings-result-icon is-success" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>
      <strong>Two-factor is on (demo)</strong>
      <p>The status shows as Enabled. Real logins aren’t affected.</p>
      <Button block onClick={onClose} data-autofocus>Done</Button>
    </div>
  );
}
