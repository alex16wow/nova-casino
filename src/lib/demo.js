import { readJSON, writeJSON } from './storage.js';

// Prototype-only switches for reviewing states: how the fake API responds.
// network: 'normal' | 'slow' | 'error' | 'empty'
// provider (game page iframe): 'up' | 'down'
// payment (Wallet deposits and withdrawals): 'ok' | 'fail'
const KEY = 'nova-demo';
const defaults = { network: 'normal', provider: 'up', payment: 'ok' };

// The site is an interactive prototype, so the States panel is always shown. Build with VITE_DEMO_PANEL=0 to hide it.
export const demoEnabled = () => import.meta.env.VITE_DEMO_PANEL !== '0';

// States belong to the page they were picked on: after moving to another address they reset to defaults.
// Guest / signed in is the session itself (AuthContext) and carries across pages.
const here = () => location.pathname;
const stored = () => {
  const saved = readJSON(KEY, null);
  return saved?.page === here() ? saved : {};
};

export const getDemo = () => ({ ...defaults, ...stored(), page: here() });
export const setDemo = (patch) => writeJSON(KEY, { ...getDemo(), ...patch, page: here() });
