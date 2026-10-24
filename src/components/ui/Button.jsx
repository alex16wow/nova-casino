// Shared button for new UI. Variants: primary (gradient), secondary (outline), ghost (text).
export default function Button({ variant = 'primary', size = 'md', loading = false, block = false, className = '', children, disabled, type = 'button', ...props }) {
  const cls = ['nv-btn', `nv-btn--${variant}`, `nv-btn--${size}`, block && 'nv-btn--block', loading && 'is-loading', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <span className="nv-spinner" aria-hidden="true" />}
      <span className="nv-btn-label">{children}</span>
    </button>
  );
}
