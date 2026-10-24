import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { currencies, levelRewards, notifications as sampleNotifications, playerLevel } from '../data/account.js';
import { findGame, gameSlug } from '../data/games.js';
import { getDemo } from '../lib/demo.js';
import { readJSON, writeJSON } from '../lib/storage.js';

// Signed-in player state shared by the header, the mobile dock and future account pages.
// Balances are numbers; `balance` on each currency is the formatted string the UI shows.
const PlayerContext = createContext(null);

const decimals = { BTC: 4, ETH: 2 };
export const formatAmount = (code, value) => value.toLocaleString('en-US', { minimumFractionDigits: decimals[code] ?? 2, maximumFractionDigits: decimals[code] ?? 2 });
const initialBalances = () => Object.fromEntries(currencies.map((c) => [c.code, Number(c.balance.replace(/,/g, ''))]));

// Favorites: game slugs, newest first. Kept for this tab only (sessionStorage), so a new visit starts empty.
const FAVORITES_KEY = 'nova-favorites';
const initialFavorites = () => {
  const saved = readJSON(FAVORITES_KEY, [], { session: true });
  return Array.isArray(saved) ? [...new Set(saved)].filter((slug) => findGame(slug)) : [];
};

export function PlayerProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState(currencies[0].code);
  const [balances, setBalances] = useState(initialBalances);
  const [depositOpen, setDepositOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => (getDemo().network === 'empty' ? [] : sampleNotifications));
  const [rewards, setRewards] = useState(levelRewards);
  const [favorites, setFavorites] = useState(initialFavorites);

  // Mirror of the list so back-to-back toggles in one tick see each other's result.
  const favoritesRef = useRef(favorites);
  const saveFavorites = useCallback((list) => { favoritesRef.current = list; setFavorites(list); }, []);

  useEffect(() => { writeJSON(FAVORITES_KEY, favorites, { session: true }); }, [favorites]);

  const markRead = useCallback((id) => setNotifications((list) => list.map((n) => (id == null || n.id === id ? { ...n, unread: false } : n))), []);
  const claimReward = useCallback((id) => setRewards((list) => list.map((r) => (r.id === id ? { ...r, claimed: true } : r))), []);
  const deposit = useCallback((code, amount) => setBalances((b) => ({ ...b, [code]: b[code] + amount })), []);
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

  const value = useMemo(() => {
    const wallet = currencies.map((c) => ({ ...c, amount: balances[c.code], balance: formatAmount(c.code, balances[c.code]) }));
    return {
      level: playerLevel,
      currencies: wallet,
      currency: wallet.find((c) => c.code === currencyCode),
      setCurrencyCode,
      deposit,
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
    };
  }, [currencyCode, balances, deposit, depositOpen, openDeposit, closeDeposit, notifications, markRead, rewards, claimReward, favorites, isFavorite, toggleFavorite, clearFavorites]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
