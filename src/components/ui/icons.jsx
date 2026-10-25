import { asset } from '../../lib/asset.js';
// Inline SVG icon set. Each icon keeps the exact geometry of the original lobby markup.

const stroke = { fill: 'none', stroke: 'currentColor' };
const round = { strokeLinecap: 'round', strokeLinejoin: 'round' };

const nav24 = { viewBox: '0 0 24 24', width: 24, height: 24, ...stroke, strokeWidth: 1.8, ...round, 'aria-hidden': 'true' };
const nav20 = { viewBox: '0 0 24 24', width: 20, height: 20, ...stroke, strokeWidth: 1.8 };
const menu20 = { viewBox: '0 0 24 24', width: 20, height: 20, ...stroke, strokeWidth: 1.6, ...round, 'aria-hidden': 'true' };

const giftPath = 'M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z';
const trophyPath = 'M7 3h10v5a5 5 0 0 1-10 0V3Zm0 2H3v3a4 4 0 0 0 5 4m9-7h4v3a4 4 0 0 1-5 4M12 13v6m-5 2h10m-8-2h6';
const heartPath = 'M20.8 8.8c0 5.2-8.8 11-8.8 11S3.2 14 3.2 8.8A4.4 4.4 0 0 1 12 6.3a4.4 4.4 0 0 1 8.8 2.5Z';

export const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...stroke} strokeWidth="2" {...round} aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
);
export const ChevronRight = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...stroke} strokeWidth="2" {...round} aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
);
export const ChevronDown = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...stroke} strokeWidth="1.8" {...round} aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);
export const Check = () => (
  <svg viewBox="0 0 16 16" width="15" height="15" {...stroke} strokeWidth="1.7" {...round} aria-hidden="true"><path d="m3.5 8 3 3 6-6" /></svg>
);
export const CheckSmall = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" {...stroke} strokeWidth="1.7" {...round} aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>
);
export const Plus = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" {...stroke} strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg>
);
export const Heart = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" {...stroke} strokeWidth="1.8"><path d={heartPath} /></svg>
);
export const Burger = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" {...stroke} strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const Bell = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" {...stroke} strokeWidth="1.7"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
);
export const Search = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" {...stroke} strokeWidth="2" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
);
export const Close = () => (
  <svg viewBox="0 0 12 12" width="12" height="12" {...stroke} strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m2 2 8 8M10 2l-8 8" /></svg>
);
export const CurrencyChevron = () => (
  <svg className="currency-chevron" viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.7" {...round} /></svg>
);
// Player level emblem: the current (Silver) status artwork from the Loyalty Club.
export const LevelEmblem = () => (
  <img className="level-emblem" src={asset('status-silver.webp')} alt="" aria-hidden="true" draggable="false" style={{ objectFit: 'contain' }} />
);
export const RewardChest = () => (
  <svg viewBox="0 0 32 32" {...stroke} strokeWidth="1.7" {...round} aria-hidden="true">
    <path d="M5 15V9a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v6M4 15h24v12H4zM4 20h24M11 5v10m10-10v10" />
    <path d="M14 18h4v6h-4z" fill="#af6fff" />
    <path d="m16 7 2 3-2 3-2-3 2-3Z" fill="currentColor" stroke="none" />
  </svg>
);

// 20px menu icons used by notifications, rewards and the account menu.
const menuPaths = {
  gift: giftPath,
  trophy: trophyPath,
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z',
  shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6',
  user: 'M20 21v-2a7 7 0 0 0-14 0v2M13 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  wallet: 'M3 7V5h16v4M3 7h18v14H3V7Zm13 6h5v5h-5v-5',
  history: 'M3 11a9 9 0 1 1 2 7M3 4v7h7M12 7v6l4 2',
  settings: 'M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6',
  logout: 'M10 4H4v16h6M10 12h11m-4-4 4 4-4 4',
};
export const MenuIcon = ({ name }) => <svg {...menu20}><path d={menuPaths[name]} /></svg>;

// Sidebar navigation icons.
const navIcons = {
  home: <svg {...nav20}><path d="M3 10.5 12 3l9 7.5v10H3z" /><path d="M9 20v-6h6v6M7 7.4V5h3" /></svg>,
  lobby: <svg {...nav20}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></svg>,
  topGames: <svg {...nav20}><path d="m12 2 2.8 6.4L22 9l-5.3 4.8 1.5 7L12 17.2 5.8 21l1.5-7L2 9l7.2-.6z" /></svg>,
  newGames: <svg {...nav20}><path d="M12 2.5c3 2.2 4.5 5.4 4.5 9.2l-1.7 4.3H9.2l-1.7-4.3c0-3.8 1.5-7 4.5-9.2z" /><circle cx="12" cy="9.5" r="1.8" /><path d="m7.5 11.7-3 2.8 1 4 3.7-2.5M16.5 11.7l3 2.8-1 4-3.7-2.5M10.5 19l1.5 2.5 1.5-2.5" /></svg>,
  liveGames: <svg {...nav20}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9 5 3-5 3zM7 3h10" /></svg>,
  tableGames: <svg {...nav20}><path d="m5 4 5 2-2 5-5-2zM14 3l5 2-2 5-5-2zM8 14l5-2 2 5-5 2zM17 13l4 3-3 5-4-3z" /></svg>,
  roulette: <svg {...nav20}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3v6m0 6v6m9-9h-6m-6 0H3m15.4-6.4-4.2 4.2m-4.4 4.4-4.2 4.2m0-12.8 4.2 4.2m4.4 4.4 4.2 4.2" /></svg>,
  gameShows: <svg {...nav20}><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 22h8m-4-4v4m-4-9 4-3 4 3M7 2l5 2 5-2" /></svg>,
  promotions: <svg {...nav24}><path d="m3 10 13-5v14L3 14zM16 8l5-2v12l-5-2M5 15l2 6h4l-2-5M3 10H1v4h2" /></svg>,
  tournaments: <svg {...nav24}><path d="M7 3h10v5c0 4-2 6-5 6s-5-2-5-6V3ZM7 5H3v3c0 3 2 4 5 4m9-7h4v3c0 3-2 4-5 4M12 14v5m-5 2h10m-8-2h6" /></svg>,
  vip: <svg {...nav24}><path d="m3 7 5 4 4-7 4 7 5-4-3 12H6L3 7Zm3 15h12" /><circle cx="3" cy="5" r="1" /><circle cx="12" cy="2" r="1" /><circle cx="21" cy="5" r="1" /></svg>,
  favorites: <svg {...nav24}><path d={heartPath} /></svg>,
  recent: <svg {...nav24}><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></svg>,
  support: <svg {...nav24}><path d="M4 13v-2a8 8 0 0 1 16 0v2M4 11H2v7h4v-7H4Zm16 0h2v7h-4v-7h2Zm0 7c0 3-3 4-7 4" /><path d="M10 21h4" /></svg>,
  // Bottom navigation (tablet).
  dockLobby: <svg viewBox="0 0 24 24" {...stroke} strokeWidth="1.8"><path d="m3 10 9-7 9 7v10H3zM9 20v-6h6v6" /></svg>,
  dockTop: <svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" /></svg>,
  dockLive: <svg viewBox="0 0 24 24" {...stroke} strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M10 8v8l6-4z" /></svg>,
  dockFavorites: <svg viewBox="0 0 24 24" {...stroke} strokeWidth="1.8"><path d={heartPath} /></svg>,
  dockAccount: <svg viewBox="0 0 24 24" {...stroke} strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 21c.5-4 3.1-6 8-6s7.5 2 8 6" /></svg>,
};
export const NavIcon = ({ name }) => navIcons[name];

const socialPaths = {
  Discord: 'M19.7 5.2A18.2 18.2 0 0 0 15.2 3.8l-.6 1.2a16.8 16.8 0 0 0-5.2 0l-.6-1.2a18.2 18.2 0 0 0-4.5 1.4C1.5 9.4.7 13.5 1.1 17.5a18.2 18.2 0 0 0 5.6 2.8l1.2-1.9-1.8-.9.4-.3c3.5 1.6 7.4 1.6 10.9 0l.4.3-1.8.9 1.2 1.9a18.2 18.2 0 0 0 5.6-2.8c.5-4.7-.8-8.8-3.1-12.3ZM8.7 14.9c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Zm6.6 0c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Z',
  Telegram: 'M21.6 4.5 18.4 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.6.6-1.2.6l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.3L5.6 13.5.7 12c-1.1-.3-1.1-1 .2-1.5L19.9 3c.9-.3 1.8.2 1.7 1.5Z',
  X: 'M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.8 5.8 22H2.6l7.3-8.4L1.2 2h6.5l4.5 6.7L18.9 2Zm-1.1 18h1.7L6.7 3.9H4.9L17.8 20Z',
  YouTube: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-5.8.5-5.8s0-4-.5-5.8ZM9.6 15.8V8.2L16 12l-6.4 3.8Z',
};
export const SocialIcon = ({ name }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={socialPaths[name]} /></svg>;
