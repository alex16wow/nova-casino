// Shimmering placeholders shown while content loads. Hidden from assistive tech;
// the surrounding region announces loading with aria-busy.
export function SkeletonCard({ style }) {
  return (
    <article className="game-card is-skeleton" aria-hidden="true" style={style}>
      <span className="nv-skeleton nv-skeleton--fill" />
      <div className="game-info">
        <span className="nv-skeleton nv-skeleton--line" style={{ width: '72%' }} />
        <span className="nv-skeleton nv-skeleton--line nv-skeleton--thin" style={{ width: '48%' }} />
      </div>
    </article>
  );
}

export function SkeletonLine({ width = '100%', className = '' }) {
  return <span className={`nv-skeleton nv-skeleton--line ${className}`.trim()} style={{ width }} aria-hidden="true" />;
}
