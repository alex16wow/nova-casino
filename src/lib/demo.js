import { readJSON, writeJSON } from './storage.js';

// Prototype-only switches for reviewing states: how the fake API responds.
// network: 'normal' | 'slow' | 'error' | 'empty'
// outcome (game page rounds): 'random' | 'win' | 'lose'
const KEY = 'nova-demo';
const defaults = { network: 'normal', outcome: 'random' };

// The site is an interactive prototype, so the States panel is always shown. Build with VITE_DEMO_PANEL=0 to hide it.
export const demoEnabled = () => import.meta.env.VITE_DEMO_PANEL !== '0';

export const getDemo = () => ({ ...defaults, ...readJSON(KEY, defaults) });
export const setDemo = (patch) => writeJSON(KEY, { ...getDemo(), ...patch });
