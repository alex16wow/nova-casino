import Button from './Button.jsx';

const icons = {
  error: <path d="M12 8v5m0 3.5v.01M10.3 3.9 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />,
  empty: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M8 15h3" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5M8.5 10.8h4.6" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14.5v2.5" /></>,
};

// Inline empty / error / prompt message with an optional action. `compact` fits inside a shelf.
export default function StateMessage({ kind = 'empty', title, text, action, onAction, compact = false, role }) {
  return (
    <div className={`nv-state nv-state--${kind}${compact ? ' nv-state--compact' : ''}`} role={role ?? (kind === 'error' ? 'alert' : undefined)}>
      <span className="nv-state-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{icons[kind]}</svg>
      </span>
      <div className="nv-state-copy">
        <strong>{title}</strong>
        {text && <p>{text}</p>}
      </div>
      {action && <Button variant={kind === 'error' ? 'secondary' : 'primary'} size="sm" onClick={onAction}>{action}</Button>}
    </div>
  );
}
