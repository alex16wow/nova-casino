import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { currencies, levelRewards, notifications as sampleNotifications, playerLevel } from '../data/account.js';
import { getDemo } from '../lib/demo.js';

// Signed-in player state shared by the header, the mobile dock and future account pages.
const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState(currencies[0].code);
  const [notifications, setNotifications] = useState(() => (getDemo().network === 'empty' ? [] : sampleNotifications));
  const [rewards, setRewards] = useState(levelRewards);
  const [favorites, setFavorites] = useState(() => new Set());

  const markRead = useCallback((id) => setNotifications((list) => list.map((n) => (id == null || n.id === id ? { ...n, unread: false } : n))), []);
  const claimReward = useCallback((id) => setRewards((list) => list.map((r) => (r.id === id ? { ...r, claimed: true } : r))), []);
  const toggleFavorite = useCallback((name) => {
    const saved = !favorites.has(name);
    setFavorites((set) => {
      const next = new Set(set);
      saved ? next.add(name) : next.delete(name);
      return next;
    });
    return saved;
  }, [favorites]);

  const value = useMemo(() => ({
    level: playerLevel,
    currencies,
    currency: currencies.find((c) => c.code === currencyCode),
    setCurrencyCode,
    notifications,
    markRead,
    rewards,
    claimReward,
    favorites,
    toggleFavorite,
  }), [currencyCode, notifications, markRead, rewards, claimReward, favorites, toggleFavorite]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
