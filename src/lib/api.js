// Fake backend for the prototype. Responses are sample data with a short delay;
// the demo panel can make them slow, empty or failing.
import { gameSets } from '../data/games.js';
import { activityTabs } from '../data/lobby.jsx';
import { getDemo } from './demo.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

async function respond(build) {
  const { network } = getDemo();
  await wait(network === 'slow' ? 3000 : 700);
  if (network === 'error') throw new ApiError('network', 'Connection problem. Check your internet and try again.');
  return build(network === 'empty');
}

export const fetchLobby = () =>
  respond((empty) => ({
    games: Object.fromEntries(Object.keys(gameSets).map((k) => [k, empty ? [] : gameSets[k]])),
    activity: activityTabs.map((t) => ({ ...t, rows: empty ? [] : t.rows })),
  }));

// Accounts: any well-formed email works. "taken@nova.casino" is already registered;
// the password "wrongpass" is always rejected, so error states can be shown.
export async function signIn({ email, password }) {
  await wait(900);
  if (getDemo().network === 'error') throw new ApiError('network', 'Connection problem. Try again in a moment.');
  if (password === 'wrongpass') throw new ApiError('credentials', 'Incorrect email or password.');
  return { email, name: email.split('@')[0] };
}

export async function signUp({ email, currency, bonus }) {
  await wait(1100);
  if (getDemo().network === 'error') throw new ApiError('network', 'Connection problem. Try again in a moment.');
  if (email.toLowerCase() === 'taken@nova.casino') throw new ApiError('email-taken', 'An account with this email already exists.');
  return { email, name: email.split('@')[0], currency, bonus };
}

export async function requestPasswordReset() {
  await wait(900);
  if (getDemo().network === 'error') throw new ApiError('network', 'Connection problem. Try again in a moment.');
  return true;
}
