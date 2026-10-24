import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LIMIT_INCREASE_DELAY, addMonths, defaultSettings, limitPeriod } from '../data/settings.js';
import { readJSON, writeJSON } from '../lib/storage.js';

// Account settings: preferences, notification choices, demo security state and responsible gaming tools.
// Only non-secret demo values are kept (localStorage `nova-settings`): never passwords, codes or keys.
// A break or self-exclusion here pauses games and deposits across the site.
const SettingsContext = createContext(null);
const KEY = 'nova-settings';
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

const initialSettings = () => {
  const saved = readJSON(KEY, null);
  return saved && typeof saved === 'object' ? { ...defaultSettings, ...saved, notifications: { ...defaultSettings.notifications, ...saved.notifications } } : defaultSettings;
};

// Per-day amount, so limits of different periods can be compared.
const perDay = (limit) => limit.amount / limitPeriod(limit.period).days;
// Lowering a limit (or setting the first one) applies at once; raising, changing currency or removing it waits.
export const isStricter = (next, current) => Boolean(next) && (!current || (next.code === current.code && perDay(next) <= perDay(current)));

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(initialSettings);
  const [now, setNow] = useState(Date.now);
  const [systemReduce, setSystemReduce] = useState(() => window.matchMedia?.(REDUCE_QUERY).matches ?? false);
  const [reminderOpen, setReminderOpen] = useState(false);
  // Latest settings for actions that report a result (read outside the state updater).
  const ref = useRef(settings);
  ref.current = settings;

  useEffect(() => { writeJSON(KEY, settings); }, [settings]);

  // Clock for expiring breaks and applying waiting limit changes.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30e3);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    setSettings((s) => {
      let next = s;
      if (s.pendingLimit && Date.parse(s.pendingLimit.effectiveAt) <= now) next = { ...next, limit: s.pendingLimit.limit, pendingLimit: null };
      if (s.restriction && Date.parse(s.restriction.until) <= now) next = { ...next, restriction: null };
      return next;
    });
  }, [now]);

  // Reduced motion: the device setting always wins; otherwise the player's choice.
  useEffect(() => {
    const list = window.matchMedia?.(REDUCE_QUERY);
    if (!list) return;
    const onChange = () => setSystemReduce(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, []);
  const reduceMotion = systemReduce || settings.reduceMotion;
  useEffect(() => { document.documentElement.classList.toggle('nv-reduce-motion', reduceMotion); }, [reduceMotion]);

  const update = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []);

  // Returns 'now' when the new limit applies at once, or the date it starts.
  const saveLimit = useCallback((next) => {
    if (isStricter(next, ref.current.limit)) {
      setSettings((s) => ({ ...s, limit: next, pendingLimit: null }));
      return 'now';
    }
    const effectiveAt = new Date(Date.now() + LIMIT_INCREASE_DELAY).toISOString();
    setSettings((s) => ({ ...s, pendingLimit: { limit: next, effectiveAt } }));
    return effectiveAt;
  }, []);

  const openReminder = useCallback(() => setReminderOpen(true), []);
  const closeReminder = useCallback(() => setReminderOpen(false), []);

  const startRestriction = useCallback((type, until, label) => {
    setSettings((s) => ({ ...s, restriction: { type, until: until.toISOString(), label, startedAt: new Date().toISOString() } }));
  }, []);

  const value = useMemo(() => {
    const restriction = settings.restriction && Date.parse(settings.restriction.until) > now ? settings.restriction : null;
    return {
      settings,
      update,
      systemReduce,
      reduceMotion,
      setReduceMotion: (on) => update({ reduceMotion: on }),
      setNotification: (id, on) => setSettings((s) => ({ ...s, notifications: { ...s.notifications, [id]: on } })),
      setTwoFactor: (on) => update({ twoFactor: on }),
      endOtherSession: (id) => setSettings((s) => ({ ...s, endedSessions: [...new Set([...s.endedSessions, id])] })),
      endOtherSessions: (ids) => setSettings((s) => ({ ...s, endedSessions: [...new Set([...s.endedSessions, ...ids])] })),
      saveLimit,
      cancelPendingLimit: () => update({ pendingLimit: null }),
      setReminder: (minutes) => update({ reminder: minutes }),
      restriction,
      takeBreak: (option) => startRestriction('break', new Date(Date.now() + option.ms), option.label),
      selfExclude: (option) => startRestriction('exclusion', addMonths(Date.now(), option.months), option.label),
      requestClosure: (reason) => update({ closure: { requestedAt: new Date().toISOString(), reason } }),
      cancelClosure: () => update({ closure: null }),
      reminderOpen,
      openReminder,
      closeReminder,
      // Demo-only controls used by the States panel.
      demo: {
        applyPendingLimit: () => setSettings((s) => (s.pendingLimit ? { ...s, limit: s.pendingLimit.limit, pendingLimit: null } : s)),
        clearRestriction: () => update({ restriction: null }),
        restoreSessions: () => update({ endedSessions: [] }),
        reset: () => setSettings(defaultSettings),
      },
    };
  }, [settings, now, update, systemReduce, reduceMotion, saveLimit, startRestriction, reminderOpen, openReminder, closeReminder]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);

// For code outside React (e.g. scroll animations): true when motion should be kept to a minimum.
export const motionReduced = () => document.documentElement.classList.contains('nv-reduce-motion') || (window.matchMedia?.(REDUCE_QUERY).matches ?? false);
