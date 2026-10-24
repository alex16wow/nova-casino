import { useEffect, useId, useRef, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import { SelectField } from '../../components/ui/Field.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { documentTypes, rejectionReason, verificationStatus } from '../../data/profile.js';
import { submitVerification } from '../../lib/api.js';
import StatusBadge from './StatusBadge.jsx';

const copy = {
  none: 'Verify your identity to unlock withdrawals and higher limits.',
  pending: 'We’re reviewing your document. This usually takes up to 24 hours.',
  verified: 'Your identity is confirmed. Withdrawals and full limits are available.',
  rejected: 'We couldn’t accept your document.',
};

// Identity verification status with the demo document flow.
export default function Verification() {
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);
  const state = profile.verification;
  const status = verificationStatus[state];

  return (
    <section className={`nv-panel nv-profile-verify is-${state}`} aria-labelledby="verifyTitle">
      <div className="nv-panel-head">
        <h2 id="verifyTitle">Verification</h2>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </div>
      <p className="nv-profile-verify-text">{copy[state]}</p>
      {state === 'rejected' && <p className="nv-profile-verify-reason"><strong>Reason:</strong> {rejectionReason}</p>}
      {(state === 'none' || state === 'rejected') && (
        <Button size="sm" block onClick={() => setOpen(true)}>{state === 'rejected' ? 'Try again' : 'Verify identity'}</Button>
      )}
      <VerifyModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

const ACCEPT = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_MB = 10;
const formatSize = (bytes) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

// Steps, document type and a local file pick. The file stays in memory only and is dropped on close.
function VerifyModal({ open, onClose }) {
  const { setVerification } = useProfile();
  const toast = useToast();
  const inputId = useId();
  const input = useRef(null);
  const [docType, setDocType] = useState(documentTypes[0].value);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) return;
    setFile(null); setError(''); setAlert(''); setSending(false); setDocType(documentTypes[0].value);
  }, [open]);

  const choose = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = '';
    if (!picked) return;
    if (!ACCEPT.includes(picked.type) && !/\.(jpe?g|png|pdf)$/i.test(picked.name)) { setFile(null); setError('Use a JPG, PNG or PDF file'); return; }
    if (picked.size > MAX_MB * 1024 * 1024) { setFile(null); setError(`The file is larger than ${MAX_MB} MB`); return; }
    setError('');
    setFile(picked);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Choose a photo or scan of your document'); return; }
    setSending(true);
    setAlert('');
    try {
      await submitVerification();
      setVerification('pending');
      onClose();
      toast('Document submitted. We’ll review it shortly');
    } catch (err) {
      setAlert(err.message);
      setSending(false);
    }
  };

  return (
    <Modal open={open} onClose={sending ? () => {} : onClose} title="Verify your identity" subtitle="It takes about 2 minutes. This is a demo: the file is not uploaded or saved.">
      <form className="nv-form" onSubmit={submit} noValidate>
        <ol className="nv-verify-steps">
          <li><strong>Choose a document</strong><span>Passport, national ID card or driving licence.</span></li>
          <li><strong>Add a clear photo</strong><span>All four corners visible, no glare, text readable.</span></li>
          <li><strong>We review it</strong><span>Usually within 24 hours. We’ll notify you.</span></li>
        </ol>
        {alert && <p className="nv-form-alert" role="alert">{alert}</p>}
        <SelectField label="Document type" options={documentTypes} value={docType} onChange={(e) => setDocType(e.target.value)} disabled={sending} data-autofocus />
        <div className={`nv-field nv-file${error ? ' is-error' : ''}`}>
          <span className="nv-file-label" id={`${inputId}-label`}>Document file</span>
          <input ref={input} id={inputId} type="file" accept=".jpg,.jpeg,.png,.pdf" className="nv-file-input" onChange={choose} disabled={sending} aria-labelledby={`${inputId}-label`} aria-describedby={`${inputId}-msg`} />
          {file ? (
            <div className="nv-file-picked">
              <span className="nv-file-name">{file.name}</span>
              <span className="nv-file-size">{formatSize(file.size)}</span>
              <button type="button" className="nv-link" onClick={() => input.current.click()} disabled={sending}>Replace</button>
              <button type="button" className="nv-link" onClick={() => setFile(null)} disabled={sending}>Remove</button>
            </div>
          ) : (
            <label htmlFor={inputId} className="nv-file-drop">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4m-5 5 5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
              <span><strong>Choose file</strong> JPG, PNG or PDF, up to {MAX_MB} MB</span>
            </label>
          )}
          {error ? <p id={`${inputId}-msg`} className="nv-field-error" role="alert">{error}</p> : <p id={`${inputId}-msg`} className="nv-field-hint">Your file stays on this device.</p>}
        </div>
        <Button type="submit" size="lg" block loading={sending}>Submit for review</Button>
      </form>
    </Modal>
  );
}
