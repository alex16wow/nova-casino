// Small coloured status pill: success, warning, danger or muted.
export default function StatusBadge({ tone = 'muted', children }) {
  return <span className={`nv-badge nv-badge--${tone}`}>{children}</span>;
}
