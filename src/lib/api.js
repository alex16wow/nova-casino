// Fake backend for the prototype. Responses are sample data with a short delay;
// the demo panel can make them slow, empty or failing.
import { MAX_PAGES, categoryPage, fillGames, pageSize, providerPage } from '../data/catalog.js';
import { findGame, gameDetails, gameSets, similarGames } from '../data/games.js';
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

// Game page: one game with its details and similar titles. Unknown slugs fail with "not_found".
export const fetchGame = (slug) =>
  respond((empty) => {
    const game = findGame(slug);
    if (!game) throw new ApiError('not_found', 'Game not found');
    return { game: { ...game, ...gameDetails(game) }, similar: empty ? [] : similarGames(game) };
  });

// Category / provider page: the first `pages` screens of cards. Unknown pages fail with "not_found".
export const fetchCatalog = (page, pages = 1) =>
  respond((empty) => {
    const info = page.startsWith('providers/') ? providerPage(page.slice(10)) : categoryPage(page);
    if (!info) throw new ApiError('not_found', 'Page not found');
    const size = pageSize(info.kind);
    return { games: empty ? [] : fillGames(info.games, size * pages), more: !empty && pages < MAX_PAGES };
  });

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

// Payments: the card 4000 0000 0000 0002 is always declined, so the error state can be shown.
export async function makeDeposit({ method, card }) {
  await wait(method === 'crypto' ? 1600 : 1300);
  if (getDemo().network === 'error') throw new ApiError('network', 'Connection problem. Your payment was not taken. Try again.');
  if (method === 'card' && card?.number.replace(/\s/g, '') === '4000000000000002') throw new ApiError('declined', 'Your bank declined this payment. Try another card or method.');
  return { id: `TX-${Date.now().toString(36).toUpperCase()}` };
}

// Profile: loading follows the data mode; saving and the identity check reuse the same network switch.
export const fetchProfile = () => respond(() => true);

export async function saveProfile(patch) {
  await wait(800);
  if (getDemo().network === 'error') throw new ApiError('network', 'Connection problem. Your changes were not saved. Try again.');
  return patch;
}

// The document is only checked here, never uploaded or stored.
export async function submitVerification() {
  await wait(1200);
  if (getDemo().network === 'error') throw new ApiError('network', 'Connection problem. Try again in a moment.');
  return { status: 'pending' };
}

// Wallet page. No real payment happens; the States panel can make payments fail.
export const fetchWallet = () => respond((empty) => ({ empty }));

export async function processDeposit({ method }) {
  await wait(method === 'crypto' ? 1600 : 1300);
  const { network, payment } = getDemo();
  if (network === 'error') throw new ApiError('network', 'Connection problem. Your payment was not taken. Try again.');
  if (payment === 'fail') throw new ApiError('declined', method === 'crypto' ? 'We couldn’t find your transfer yet. No funds were credited.' : 'The provider declined this payment. No funds were taken.');
  return true;
}

export async function processWithdrawal() {
  await wait(1300);
  const { network, payment } = getDemo();
  if (network === 'error') throw new ApiError('network', 'Connection problem. Your request was not sent. Try again.');
  if (payment === 'fail') throw new ApiError('rejected', 'The payment system rejected this request. Nothing was reserved.');
  return true;
}
