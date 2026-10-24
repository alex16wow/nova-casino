import { useId } from 'react';

// Settings card: title, optional one-line description, then its rows.
export function SettingsCard({ id, title, text, className = '', children }) {
  return (
    <section id={id} className={`nv-panel nv-settings-card ${className}`.trim()} aria-labelledby={`${id}Title`}>
      <header className="nv-settings-head">
        <h2 id={`${id}Title`}>{title}</h2>
        {text && <p>{text}</p>}
      </header>
      {children}
    </section>
  );
}

// One setting: label and explanation on the left, its control on the right (stacked on phones).
export function SettingRow({ label, text, children, labelId, className = '' }) {
  return (
    <div className={`nv-setting ${className}`.trim()}>
      <div className="nv-setting-copy">
        <strong id={labelId}>{label}</strong>
        {text && <p>{text}</p>}
      </div>
      {children && <div className="nv-setting-control">{children}</div>}
    </div>
  );
}

// On/off switch. Saves on change, so it carries its own state label.
export function Switch({ checked, onChange, disabled, label, describedBy }) {
  const id = useId();
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      disabled={disabled}
      className="nv-switch"
      onClick={() => onChange(!checked)}
    >
      <span className="nv-switch-track" aria-hidden="true"><span className="nv-switch-thumb" /></span>
      <span className="nv-switch-text">{checked ? 'On' : 'Off'}</span>
    </button>
  );
}

// Single choice from a few short options (period, reminder, duration).
export function Segmented({ label, options, value, onChange, disabled }) {
  return (
    <div className="nv-segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} disabled={disabled} className={o.value === value ? 'is-selected' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Small "Demo" marker for flows that don't touch real credentials.
export const DemoTag = ({ children = 'Demo' }) => <span className="nv-settings-demo">{children}</span>;
