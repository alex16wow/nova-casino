import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { currencies, levelRewards, notifications as sampleNotifications, playerLevel } from '../data/account.js';
import { findGame, gameSlug } from '../data/games.js';
import { seedBonus, seedTransactions } from '../data/wallet.js';
import { getDemo } from '../lib/demo.js';
import { readJSON, writeJSON } from '../lib/storage.js';

// Signed-in player state shared by the header, the mobile dock and future account pages.
// Balances are numbers; `balance` on each currency is the formatted string the UI shows.
const PlayerContext = createContext(null);

const decimals = { BTC: 4, ETH: 2 };
export const formatAmount = (code, value) => value.toLocaleString('en-US', { minimumFractionDigits: decimals[code] ?? 2, maximumFractionDigits: decimals[code] ?? 2 });
const initialBalances = () => Object.fromEntries(currencies.map((c) => [c.code, Number(c.balance.replace(/,/g, ''))]));
// Keeps float sums like 0.1 + 0.2 at the currency's precision.
const round = (n) => Math.round(n * 1e8) / 1e8;

// Wallet: real and bonus balances per currency plus the transaction history. Non-secret demo data only
// (no addresses or card details), kept in localStorage so it survives navigation and reloads.
const WALLET_KEY = 'nova-wallet';
const freshWallet = () => ({ balances: initialBalances(), bonus: { ...seedBonus }, transactions: seedTransactions() });
const initialWallet = () => {
  const saved = readJSON(WALLET_KEY, null);
  return saved?.balances && saved.bonus && Array.isArray(saved.transactions) ? saved : freshWallet();
};
let txCounter = 0;
const newId = (prefix) => `${prefix}-${(Date.now().toString(36) + (txCounter++).toString(36)).toUpperCase().slice(-8)}`;

// Favorites: game slugs, newest first. Kept for this tab only (sessionStorage), so a new visit starts empty.
const FAVORITES_KEY = 'nova-favorites';
const initialFavorites = () => {
  const saved = readJSON(FAVORITES_KEY, [], { session: true });
  return Array.isArray(saved) ? [...new Set(saved)].filter((slug) => findGame(slug)) : [];
};

// Recently played: slugs of opened games, newest first, no repeats, capped. Same tab-only storage as favorites.
const RECENT_KEY = 'nova-recent';
export const RECENT_LIMIT = 24;
const initialRecent = () => {
  const saved = readJSON(RECENT_KEY, [], { session: true });
  return Array.isArray(saved) ? [...new Set(saved)].filter((slug) => findGame(slug)).slice(0, RECENT_LIMIT) : [];
};

export function PlayerProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState(currencies[0].code);
  const [wallet, setWallet] = useState(initialWallet);
  const { balances, bonus, transactions } = wallet;
  const [depositOpen, setDepositOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => (getDemo().network === 'empty' ? [] : sampleNotifications));
  const [rewards, setRewards] = useState(levelRewards);
  const [favorites, setFavorites] = useState(initialFavorites);
  const [recent, setRecent] = useState(initialRecent);

  // Mirror of the list so back-to-back toggles in one tick see each other's result.
  const favoritesRef = useRef(favorites);
  const saveFavorites = useCallback((list) => { favoritesRef.current = list; setFavorites(list); }, []);

  useEffect(() => { writeJSON(FAVORITES_KEY, favorites, { session: true }); }, [favorites]);
  useEffect(() => { writeJSON(RECENT_KEY, recent, { session: true }); }, [recent]);
  useEffect(() => { writeJSON(WALLET_KEY, wallet); }, [wallet]);

  const markRead = useCallback((id) => setNotifications((list) => list.map((n) => (id == null || n.id === id ? { ...n, unread: false } : n))), []);
  const claimReward = useCallback((id) => setRewards((list) => list.map((r) => (r.id === id ? { ...r, claimed: true } : r))), []);
  // Completed deposit: credits the real balance (and the bonus, if any) and records one transaction.
  // A repeated call with the same id is ignored, so a double submit can't credit twice.
  const deposit = useCallback((code, amount, meta = {}) => {
    const id = meta.id ?? newId('DP');
    setWallet((w) => {
      if (w.transactions.some((t) => t.id === id)) return w;
      const tx = { id, type: 'deposit', method: meta.method ?? 'card', network: meta.network ?? null, amount, code, status: 'completed', fee: 0, date: new Date().toISOString() };
      return {
        balances: { ...w.balances, [code]: round(w.balances[code] + amount) },
        bonus: { ...w.bonus, [code]: round((w.bonus[code] ?? 0) + (meta.bonus ?? 0)) },
        transactions: [tx, ...w.transactions],
      };
    });
    return id;
  }, []);
  // Failed operations are recorded but never touch balances.
  const recordFailure = useCallback((tx) => {
    const id = tx.id ?? newId(tx.type === 'deposit' ? 'DP' : 'WD');
    setWallet((w) => (w.transactions.some((t) => t.id === id) ? w : { ...w, transactions: [{ fee: 0, network: null, ...tx, id, status: 'failed', date: new Date().toISOString() }, ...w.transactions] }));
    return id;
  }, []);
  // Withdrawal request: a pending transaction that reserves the amount (available = real − pending).
  // The real balance is charged only when the payout completes.
  const requestWithdrawal = useCallback(({ id = newId('WD'), code, amount, fee, method, network = null }) => {
    setWallet((w) => {
      if (w.transactions.some((t) => t.id === id)) return w;
      const reserved = w.transactions.filter((t) => t.type === 'withdrawal' && t.status === 'pending' && t.code === code).reduce((s, t) => s + t.amount, 0);
      if (amount > round(w.balances[code] - reserved)) return w;
      return { ...w, transactions: [{ id, type: 'withdrawal', method, network, amount, code, fee, status: 'pending', date: new Date().toISOString() }, ...w.transactions] };
    });
    return id;
  }, []);
  const resetWallet = useCallback(() => setWallet(freshWallet()), []);
  const openDeposit = useCallback(() => setDepositOpen(true), []);
  const closeDeposit = useCallback(() => setDepositOpen(false), []);
  // Every card of a game shares one entry: the game's slug. Adding again moves it to the front.
  const isFavorite = useCallback((name) => favorites.includes(gameSlug(name)), [favorites]);
  const toggleFavorite = useCallback((name) => {
    const slug = gameSlug(name);
    const list = favoritesRef.current;
    const saved = !list.includes(slug);
    const rest = list.filter((s) => s !== slug);
    saveFavorites(saved ? [slug, ...rest] : rest);
    return saved;
  }, [saveFavorites]);
  const clearFavorites = useCallback(() => saveFavorites([]), [saveFavorites]);
  // Opening a game moves it to the front of the history.
  const addRecent = useCallback((name) => {
    const slug = gameSlug(name);
    setRecent((list) => (list[0] === slug ? list : [slug, ...list.filter((s) => s !== slug)].slice(0, RECENT_LIMIT)));
  }, []);
  const setRecentList = useCallback((names) => setRecent(names.map(gameSlug).slice(0, RECENT_LIMIT)), []);
  const clearRecent = useCallback(() => setRecent([]), []);

  const value = useMemo(() => {
    const pending = (code) => round(transactions.filter((t) => t.type === 'withdrawal' && t.status === 'pending' && t.code === code).reduce((s, t) => s + t.amount, 0));
    const list = currencies.map((c) => {
      const reserved = pending(c.code);
      return { ...c, amount: balances[c.code], balance: formatAmount(c.code, balances[c.code]), bonus: bonus[c.code] ?? 0, pending: reserved, available: Math.max(0, round(balances[c.code] - reserved)) };
    });
    return {
      level: playerLevel,
      currencies: list,
      currency: list.find((c) => c.code === currencyCode),
      setCurrencyCode,
      deposit,
      recordFailure,
      requestWithdrawal,
      resetWallet,
      transactions,
      depositOpen,
      openDeposit,
      closeDeposit,
      notifications,
      markRead,
      rewards,
      claimReward,
      favorites,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      recent,
      addRecent,
      setRecentList,
      clearRecent,
    };
  }, [currencyCode, balances, bonus, transactions, deposit, recordFailure, requestWithdrawal, resetWallet, depositOpen, openDeposit, closeDeposit, notifications, markRead, rewards, claimReward, favorites, isFavorite, toggleFavorite, clearFavorites, recent, addRecent, setRecentList, clearRecent]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
