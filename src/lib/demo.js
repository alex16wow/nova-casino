import { readJSON, writeJSON } from './storage.js';

// Prototype-only switches for reviewing states: how the fake API responds.
// network: 'normal' | 'slow' | 'error' | 'empty'
const KEY = 'nova-demo';
const defaults = { network: 'normal' };

export const demoEnabled = () =>
  import.meta.env.VITE_DEMO_PANEL === '1' || new URLSearchParams(location.search).has('demo') || readJSON(KEY, defaults).panel === true;

export const getDemo = () => ({ ...defaults, ...readJSON(KEY, defaults) });
export const setDemo = (patch) => writeJSON(KEY, { ...getDemo(), ...patch });
