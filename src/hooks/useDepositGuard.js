import { useCallback } from 'react';
import { usePlayer, formatAmount } from '../context/PlayerContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { limitPeriod } from '../data/settings.js';

const round = (n) => Math.round(n * 1e8) / 1e8;

// Responsible gaming checks for deposits: an active break / self-exclusion blocks them,
// and the deposit limit caps completed deposits in its currency over a rolling period.
export default function useDepositGuard() {
  const { restriction, settings } = useSettings();
  const { transactions } = usePlayer();
  const { limit } = settings;

  const limitInfo = useCallback((code) => {
    if (!limit || limit.code !== code) return null;
    const period = limitPeriod(limit.period);
    const since = Date.now() - period.days * 864e5;
    const used = round(transactions.filter((t) => t.type === 'deposit' && t.status === 'completed' && t.code === code && Date.parse(t.date) >= since).reduce((s, t) => s + t.amount, 0));
    return { ...limit, period, used, left: Math.max(0, round(limit.amount - used)) };
  }, [limit, transactions]);

  // Message for an amount over the limit, or ''.
  const limitError = useCallback((code, amount) => {
    const info = limitInfo(code);
    if (!info || !(amount > info.left)) return '';
    return info.left > 0
      ? `This is over your ${info.period.label.toLowerCase()} deposit limit. You can deposit up to ${formatAmount(code, info.left)} ${code} more.`
      : `You’ve reached your ${info.period.label.toLowerCase()} deposit limit of ${formatAmount(code, info.amount)} ${code}.`;
  }, [limitInfo]);

  return { restriction, limitInfo, limitError };
}
