// Loyalty status emblems drawn in SVG. Each tier adds detail: plain medal → ribbon → star → wings → crystal.
const palettes = {
  bronze: ['#ffcf9e', '#c46f2e', '#5e2c10', '#ff9a4d'],
  silver: ['#ffffff', '#a9b4d0', '#4c5578', '#cfd8ff'],
  gold: ['#fff2a8', '#f2b230', '#7a4a07', '#ffd34d'],
  platinum: ['#e9fbff', '#7fd4ef', '#245a7a', '#6ee7ff'],
  diamond: ['#ffe6ff', '#d16bff', '#4a1a8c', '#ef43e7'],
};
const level = { bronze: 0, silver: 1, gold: 2, platinum: 3, diamond: 4 };

export default function StatusBadge({ tier }) {
  const [hi, mid, lo, glow] = palettes[tier];
  const n = level[tier];
  const id = `nv-badge-${tier}`;
  return (
    <svg className="nv-status-badge" viewBox="0 0 100 100" aria-hidden="true" style={{ filter: `drop-shadow(0 0 ${6 + n * 3}px ${glow}88)` }}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={hi} /><stop offset=".55" stopColor={mid} /><stop offset="1" stopColor={lo} /></linearGradient>
        <radialGradient id={`${id}-s`} cx=".35" cy=".3" r=".7"><stop offset="0" stopColor="#fff" stopOpacity=".7" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /></radialGradient>
      </defs>
      {n >= 1 && <path d="M36 62 L28 94 L40 88 L46 98 L50 66 Z M64 62 L72 94 L60 88 L54 98 L50 66 Z" fill={lo} stroke={mid} strokeWidth="1.5" />}
      {n >= 3 && <g fill={`url(#${id}-g)`} opacity=".9"><path d="M22 44 C8 40 4 28 6 18 C14 26 20 30 28 32 Z" /><path d="M78 44 C92 40 96 28 94 18 C86 26 80 30 72 32 Z" /></g>}
      {n < 4 ? (
        <>
          <circle cx="50" cy="44" r="28" fill={`url(#${id}-g)`} stroke={hi} strokeWidth="2" />
          <circle cx="50" cy="44" r="21" fill="none" stroke={lo} strokeOpacity=".6" strokeWidth="2" strokeDasharray={n >= 1 ? '3 3' : undefined} />
          {n >= 2 && <path d="M50 30 L54 40 L65 40 L56 47 L59 58 L50 51 L41 58 L44 47 L35 40 L46 40 Z" fill={hi} stroke={lo} strokeWidth="1" />}
          <circle cx="50" cy="44" r="28" fill={`url(#${id}-s)`} />
        </>
      ) : (
        <g>
          <path d="M50 12 L76 34 L50 78 L24 34 Z" fill={`url(#${id}-g)`} stroke={hi} strokeWidth="2" strokeLinejoin="round" />
          <path d="M24 34 L76 34 M50 12 L40 34 L50 78 L60 34 Z" fill="none" stroke={hi} strokeOpacity=".7" strokeWidth="1.2" />
          <path d="M50 12 L76 34 L50 78 L24 34 Z" fill={`url(#${id}-s)`} />
          <circle cx="80" cy="18" r="2.5" fill="#fff" /><circle cx="18" cy="56" r="1.8" fill="#fff" />
        </g>
      )}
    </svg>
  );
}
