import { useId, useState } from 'react';

const Eye = ({ off }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />
    {off && <path d="m3 3 18 18" />}
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>
);

// Labelled input with inline validation. `error` shows under the field; `valid` adds a check mark.
export function TextField({ label, error, hint, valid, className = '', trailing, ...input }) {
  const id = useId();
  const msgId = `${id}-msg`;
  const state = error ? 'is-error' : valid ? 'is-valid' : '';
  return (
    <div className={`nv-field ${state} ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <div className="nv-field-control">
        <input id={id} aria-invalid={Boolean(error) || undefined} aria-describedby={error || hint ? msgId : undefined} {...input} />
        {valid && !error && !trailing && <span className="nv-field-valid"><Check /></span>}
        {trailing}
      </div>
      {(error || hint) && <p id={msgId} className={error ? 'nv-field-error' : 'nv-field-hint'} role={error ? 'alert' : undefined}>{error || hint}</p>}
    </div>
  );
}

// Password strength: 0 empty, 1 weak, 2 medium, 3 strong.
export function passwordStrength(value) {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/i.test(value) && /\d/.test(value)) score++;
  if (value.length >= 12 || /[^a-z0-9]/i.test(value)) score++;
  return Math.max(1, score);
}
const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

export function PasswordField({ showStrength, value, ...props }) {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? passwordStrength(value) : 0;
  return (
    <>
      <TextField
        {...props}
        value={value}
        type={visible ? 'text' : 'password'}
        trailing={
          <button type="button" className="nv-field-toggle" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)}>
            <Eye off={visible} />
          </button>
        }
      />
      {showStrength && value && (
        <div className={`nv-strength nv-strength--${strength}`} aria-live="polite">
          <span className="nv-strength-bars" aria-hidden="true"><i /><i /><i /></span>
          <span>Password strength: <b>{strengthLabels[strength]}</b></span>
        </div>
      )}
    </>
  );
}

export function Checkbox({ label, error, ...input }) {
  const id = useId();
  return (
    <div className={`nv-check${error ? ' is-error' : ''}`}>
      <input type="checkbox" id={id} aria-invalid={Boolean(error) || undefined} {...input} />
      <label htmlFor={id}><span className="nv-check-box" aria-hidden="true"><Check /></span><span>{label}</span></label>
      {error && <p className="nv-field-error" role="alert">{error}</p>}
    </div>
  );
}

export function SelectField({ label, options, ...select }) {
  const id = useId();
  return (
    <div className="nv-field">
      <label htmlFor={id}>{label}</label>
      <div className="nv-field-control nv-field-select">
        <select id={id} {...select}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}
