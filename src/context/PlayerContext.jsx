import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { currencies, levelRewards, notifications as sampleNotifications, playerLevel } from '../data/account.js';
import { findGame, gameSlug } from '../data/games.js';
import { depositBonusAmount, makeBonus, offers, promoCodes, seedBonuses, wagerTarget } from '../data/bonuses.js';
import { seedTransactions } from '../data/wallet.js';
import { getDemo } from '../lib/demo.js';
import { readJSON, writeJSON } from '../lib/storage.js';
import { useSettings } from './SettingsContext.jsx';

// Signed-in player state shared by the header, the mobile dock and future account pages.
// Balances are numbers; `balance` on each currency is the formatted string the UI shows.
const PlayerContext = createContext(null);

const decimals = { BTC: 4, ETH: 2 };
export const formatAmount = (code, value) => value.toLocaleString('en-US', { minimumFractionDigits: decimals[code] ?? 2, maximumFractionDigits: decimals[code] ?? 2 });
const initialBalances = () => Object.fromEntries(currencies.map((c) => [c.code, Number(c.balance.replace(/,/g, ''))]));
// Keeps float sums like 0.1 + 0.2 at the currency's precision.
const round = (n) => Math.round(n * 1e8) / 1e8;

// Wallet: real balances per currency plus the transaction history. Non-secret demo data only
// (no addresses or card details), kept in localStorage so it survives navigation and reloads.
const WALLET_KEY = 'nova-wallet';
const freshWallet = () => ({ balances: initialBalances(), transactions: seedTransactions() });
const initialWallet = () => {
  const saved = readJSON(WALLET_KEY, null);
  return saved?.balances && Array.isArray(saved.transactions) ? { balances: saved.balances, transactions: saved.transactions } : freshWallet();
};
// Bonuses: the player's bonus records, claimed level rewards and used promo codes. The Wallet bonus balance
// is the active money bonus; the header counter is the number of unclaimed level rewards.
const BONUS_KEY = 'nova-bonuses';
const freshBonuses = () => ({ bonuses: seedBonuses(), claimed: [], usedCodes: [], since: new Date().toISOString() });
const initialBonuses = () => {
  const saved = readJSON(BONUS_KEY, null);
  return Array.isArray(saved?.bonuses) && Array.isArray(saved.claimed) && Array.isArray(saved.usedCodes) && saved.since ? saved : freshBonuses();
};
const activeMoney = (list) => list.find((b) => b.kind === 'money' && b.status === 'active');

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
  // The session starts on the default currency from Settings; the header switch changes it for now.
  const { settings } = useSettings();
  const [currencyCode, setCurrencyCode] = useState(() => (currencies.some((c) => c.code === settings.defaultCurrency) ? settings.defaultCurrency : currencies[0].code));
  const [wallet, setWallet] = useState(initialWallet);
  const { balances, transactions } = wallet;
  const [bonusState, setBonusState] = useState(initialBonuses);
  const { bonuses } = bonusState;
  const [depositOpen, setDepositOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => (getDemo().network === 'empty' ? [] : sampleNotifications));
  const [favorites, setFavorites] = useState(initialFavorites);
  const [recent, setRecent] = useState(initialRecent);

  // Mirror of the list so back-to-back toggles in one tick see each other's result.
  const favoritesRef = useRef(favorites);
  const saveFavorites = useCallback((list) => { favoritesRef.current = list; setFavorites(list); }, []);

  useEffect(() => { writeJSON(FAVORITES_KEY, favorites, { session: true }); }, [favorites]);
  useEffect(() => { writeJSON(RECENT_KEY, recent, { session: true }); }, [recent]);
  useEffect(() => { writeJSON(WALLET_KEY, wallet); }, [wallet]);
  useEffect(() => { writeJSON(BONUS_KEY, bonusState); }, [bonusState]);

  const markRead = useCallback((id) => setNotifications((list) => list.map((n) => (id == null || n.id === id ? { ...n, unread: false } : n))), []);
  // Completed deposit: credits the real balance and records one transaction.
  // A repeated call with the same id is ignored, so a double submit can't credit twice.
  const deposit = useCallback((code, amount, meta = {}) => {
    const id = meta.id ?? newId('DP');
    setWallet((w) => {
      if (w.transactions.some((t) => t.id === id)) return w;
      const tx = { id, type: 'deposit', method: meta.method ?? 'card', network: meta.network ?? null, amount, code, status: 'completed', fee: 0, date: new Date().toISOString() };
      return {
        balances: { ...w.balances, [code]: round(w.balances[code] + amount) },
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

  // ---- Bonuses. Each action returns { ok, reason } so the page can explain a refusal. ----
  // Actions read the latest state from a ref, so back-to-back clicks see each other's result.
  const bonusRef = useRef(bonusState);
  const commitBonus = useCallback((next) => { bonusRef.current = next; setBonusState(next); }, []);

  // Only one money bonus can be active; it is never replaced automatically. A reward is claimed once.
  const claimOffer = useCallback((offerId) => {
    const st = bonusRef.current, offer = offers[offerId];
    if (!offer || offer.cta !== 'claim') return { ok: false, reason: 'unavailable' };
    if (st.claimed.includes(offer.rewardId) || st.bonuses.some((b) => b.offerId === offerId)) return { ok: false, reason: 'claimed' };
    if (offer.kind === 'money' && activeMoney(st.bonuses)) return { ok: false, reason: 'one-active', active: activeMoney(st.bonuses) };
    const bonus = makeBonus(offer, { source: 'reward' });
    commitBonus({ ...st, bonuses: [bonus, ...st.bonuses], claimed: [...st.claimed, offer.rewardId] });
    return { ok: true, bonus };
  }, [commitBonus]);
  // Called after a successful deposit with the bonus box ticked.
  const activateDepositBonus = useCallback((code, deposit) => {
    const st = bonusRef.current, offer = offers.deposit100;
    if (st.bonuses.some((b) => b.offerId === offer.id)) return { ok: false, reason: 'claimed' };
    if (!offer.currencies.includes(code) || deposit < offer.minDeposit) return { ok: false, reason: 'not-eligible' };
    if (activeMoney(st.bonuses)) return { ok: false, reason: 'one-active' };
    const bonus = { ...makeBonus(offer, { source: 'deposit', code, amount: round(depositBonusAmount(offer, deposit)) }), deposit };
    commitBonus({ ...st, bonuses: [bonus, ...st.bonuses] });
    return { ok: true, bonus };
  }, [commitBonus]);
  const applyPromo = useCallback((input) => {
    const st = bonusRef.current, key = input.trim().toUpperCase(), offer = promoCodes[key];
    if (!offer) return { ok: false, reason: 'invalid' };
    if (st.usedCodes.includes(key)) return { ok: false, reason: 'used' };
    const bonus = makeBonus(offer, { source: 'promo' });
    commitBonus({ ...st, bonuses: [bonus, ...st.bonuses], usedCodes: [...st.usedCodes, key] });
    return { ok: true, bonus };
  }, [commitBonus]);
  // Cancelling forfeits the remaining bonus funds and wagering progress. Real money is untouched.
  const cancelBonus = useCallback((id) => {
    const st = bonusRef.current;
    commitBonus({ ...st, bonuses: st.bonuses.map((b) => (b.id === id && b.status === 'active' ? { ...b, status: 'cancelled', finishedAt: new Date().toISOString() } : b)) });
  }, [commitBonus]);
  // Demo control for the wagering progress of the active money bonus (0–1). Reaching 1 completes it:
  // the bonus funds become real money.
  const setWagerProgress = useCallback((share) => {
    const st = bonusRef.current, current = activeMoney(st.bonuses);
    if (!current) return;
    const done = share >= 1;
    commitBonus({ ...st, bonuses: st.bonuses.map((b) => (b.id === current.id ? { ...b, wagered: round(wagerTarget(b) * Math.min(1, share)), ...(done && { status: 'completed', finishedAt: new Date().toISOString() }) } : b)) });
    if (done) setWallet((w) => ({ ...w, balances: { ...w.balances, [current.code]: round(w.balances[current.code] + current.amount) } }));
  }, [commitBonus]);
  const resetBonuses = useCallback(() => commitBonus(freshBonuses()), [commitBonus]);
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
    const money = activeMoney(bonuses);
    const bonusOf = (code) => (money?.code === code ? money.amount : 0);
    const rewards = levelRewards.map((r) => ({ ...r, claimed: r.claimed || bonusState.claimed.includes(r.id) }));
    const pending = (code) => round(transactions.filter((t) => t.type === 'withdrawal' && t.status === 'pending' && t.code === code).reduce((s, t) => s + t.amount, 0));
    const list = currencies.map((c) => {
      const reserved = pending(c.code);
      return { ...c, amount: balances[c.code], balance: formatAmount(c.code, balances[c.code]), bonus: bonusOf(c.code), pending: reserved, available: Math.max(0, round(balances[c.code] - reserved)) };
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
      availableRewards: rewards.filter((r) => !r.claimed).length,
      bonuses,
      bonusSince: bonusState.since,
      usedCodes: bonusState.usedCodes,
      activeMoneyBonus: money ?? null,
      claimOffer,
      activateDepositBonus,
      applyPromo,
      cancelBonus,
      setWagerProgress,
      resetBonuses,
      favorites,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      recent,
      addRecent,
      setRecentList,
      clearRecent,
    };
  }, [currencyCode, balances, transactions, bonuses, bonusState, claimOffer, activateDepositBonus, applyPromo, cancelBonus, setWagerProgress, resetBonuses, deposit, recordFailure, requestWithdrawal, resetWallet, depositOpen, openDeposit, closeDeposit, notifications, markRead, favorites, isFavorite, toggleFavorite, clearFavorites, recent, addRecent, setRecentList, clearRecent]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
