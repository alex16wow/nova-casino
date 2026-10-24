import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import { Checkbox, SelectField } from '../../components/ui/Field.jsx';
import Modal from '../../components/ui/Modal.jsx';
import StatusBadge from '../profile/StatusBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { closureReasons, fullDate } from '../../data/settings.js';
import { saveSetting } from '../../lib/api.js';
import { SettingRow, SettingsCard } from './parts.jsx';

// Account: log out (the usual confirmation) and a demo account closure request. Nothing is deleted.
export default function AccountSettings() {
  const { openAuth } = useAuth();
  const { settings, requestClosure, cancelClosure } = useSettings();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const { closure } = settings;

  return (
    <SettingsCard id="account" title="Account" className="nv-settings-card--wide">
      <SettingRow label="Log out" text="End this session on this device.">
        <Button variant="secondary" size="sm" onClick={() => openAuth('logout')}>Log out</Button>
      </SettingRow>
      <SettingRow
        label={<>Account closure {closure && <StatusBadge tone="warning">Requested</StatusBadge>}</>}
        text={closure
          ? `Requested on ${fullDate(closure.requestedAt)}. Our team reviews requests within 3 business days. This demo doesn’t delete any data.`
          : 'Ask us to close your account. Withdraw your balance first.'}
        className="nv-setting--danger"
      >
        {closure ? (
          <Button variant="ghost" size="sm" onClick={() => { cancelClosure(); toast('Closure request withdrawn'); }}>Withdraw request</Button>
        ) : (
          <Button variant="ghost" size="sm" className="nv-btn--danger-outline" onClick={() => setOpen(true)}>Request account closure</Button>
        )}
      </SettingRow>
      <Modal open={open} onClose={() => setOpen(false)} title="Request account closure?" size="sm">
        {open && <ClosureForm onCancel={() => setOpen(false)} onDone={(reason) => { requestClosure(reason); setOpen(false); toast('Closure request sent'); }} />}
      </Modal>
    </SettingsCard>
  );
}

function ClosureForm({ onCancel, onDone }) {
  const [reason, setReason] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    if (!agreed) { setError('Confirm that you want to close your account'); return; }
    setBusy(true);
    setAlert('');
    try {
      await saveSetting();
      onDone(reason);
    } catch (err) {
      setAlert(err.message);
      setBusy(false);
    }
  };
  return (
    <form className="nv-form" onSubmit={submit} noValidate>
      {alert && <p className="nv-form-alert" role="alert">{alert}</p>}
      <p className="nv-modal-text">We’ll review your request and email you. Until then you can log in, withdraw your balance or withdraw the request. In this demo no data is deleted.</p>
      <SelectField label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} options={closureReasons} disabled={busy} />
      <Checkbox checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setError(''); }} error={error} label="I want to close my NOVA Casino account." disabled={busy} />
      <div className="nv-modal-actions">
        <Button variant="secondary" onClick={onCancel} disabled={busy} data-autofocus>Cancel</Button>
        <Button type="submit" variant="danger" loading={busy}>Request closure</Button>
      </div>
    </form>
  );
}
