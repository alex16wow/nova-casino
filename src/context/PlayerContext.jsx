import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { currencies, levelRewards, notifications as sampleNotifications, playerLevel } from '../data/account.js';
import { getDemo } from '../lib/demo.js';

// Signed-in player state shared by the header, the mobile dock and future account pages.
// Balances are numbers; `balance` on each currency is the formatted string the UI shows.
const PlayerContext = createContext(null);

const decimals = { BTC: 4, ETH: 2 };
export const formatAmount = (code, value) => value.toLocaleString('en-US', { minimumFractionDigits: decimals[code] ?? 2, maximumFractionDigits: decimals[code] ?? 2 });
const initialBalances = () => Object.fromEntries(currencies.map((c) => [c.code, Number(c.balance.replace(/,/g, ''))]));

export function PlayerProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState(currencies[0].code);
  const [balances, setBalances] = useState(initialBalances);
  const [depositOpen, setDepositOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => (getDemo().network === 'empty' ? [] : sampleNotifications));
  const [rewards, setRewards] = useState(levelRewards);
  const [favorites, setFavorites] = useState(() => new Set());

  const markRead = useCallback((id) => setNotifications((list) => list.map((n) => (id == null || n.id === id ? { ...n, unread: false } : n))), []);
  const claimReward = useCallback((id) => setRewards((list) => list.map((r) => (r.id === id ? { ...r, claimed: true } : r))), []);
  const deposit = useCallback((code, amount) => setBalances((b) => ({ ...b, [code]: b[code] + amount })), []);
  const openDeposit = useCallback(() => setDepositOpen(true), []);
  const closeDeposit = useCallback(() => setDepositOpen(false), []);
  const toggleFavorite = useCallback((name) => {
    const saved = !favorites.has(name);
    setFavorites((set) => {
      const next = new Set(set);
      saved ? next.add(name) : next.delete(name);
      return next;
    });
    return saved;
  }, [favorites]);

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
      toggleFavorite,
    };
  }, [currencyCode, balances, deposit, depositOpen, openDeposit, closeDeposit, notifications, markRead, rewards, claimReward, favorites, toggleFavorite]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
