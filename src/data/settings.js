// Settings page options and demo data. Nothing here is secret: no passwords, codes or keys.

const HOUR = 3600e3;
const DAY = 24 * HOUR;

// Interface languages that actually exist in the prototype.
export const languages = [{ code: 'en', label: 'English' }];

export const notificationTopics = [
  { id: 'security', label: 'Account & security', text: 'Sign-ins, password changes and payment confirmations.', required: true },
  { id: 'bonuses', label: 'Bonuses & promotions', text: 'New rewards, offers and expiring bonuses.' },
  { id: 'tournaments', label: 'Tournaments & events', text: 'Tournament starts, results and seasonal events.' },
  { id: 'product', label: 'Product updates', text: 'New games, features and site improvements.' },
];

// Deposit limit periods; `days` compares limits of different periods (per-day amount).
export const limitPeriods = [
  { id: 'daily', label: 'Daily', noun: 'day', days: 1 },
  { id: 'weekly', label: 'Weekly', noun: 'week', days: 7 },
  { id: 'monthly', label: 'Monthly', noun: 'month', days: 30 },
];
export const limitPeriod = (id) => limitPeriods.find((p) => p.id === id);
// A higher or removed limit waits this long before it applies (demo cooling-off period).
export const LIMIT_INCREASE_DELAY = DAY;
export const LIMIT_INCREASE_LABEL = '24 hours';

export const reminderOptions = [
  { value: 0, label: 'Off' },
  { value: 30, label: '30 min' },
  { value: 60, label: '60 min' },
];

export const breakOptions = [
  { id: '24h', label: '24 hours', ms: DAY },
  { id: '7d', label: '7 days', ms: 7 * DAY },
  { id: '30d', label: '30 days', ms: 30 * DAY },
];
export const exclusionOptions = [
  { id: '6m', label: '6 months', months: 6 },
  { id: '1y', label: '1 year', months: 12 },
  { id: '3y', label: '3 years', months: 36 },
  { id: '5y', label: '5 years', months: 60 },
];
export const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

// Two-factor setup is a demo: this fixed test code is the only one accepted.
export const TEST_2FA_CODE = '123456';

// Other signed-in devices shown under Active sessions. Ending one removes it from this list.
export const demoSessions = [
  { id: 'iphone', device: 'iPhone 15', browser: 'Safari', place: 'Lisbon, Portugal', ago: 2 * HOUR },
  { id: 'windows', device: 'Windows PC', browser: 'Chrome', place: 'Berlin, Germany', ago: 26 * HOUR },
];

export const closureReasons = [
  { value: '', label: 'Select a reason (optional)' },
  { value: 'break', label: 'I want to stop playing' },
  { value: 'other-site', label: 'I use another site' },
  { value: 'experience', label: 'I didn’t like the experience' },
  { value: 'other', label: 'Other' },
];

export const defaultSettings = {
  defaultCurrency: 'USDT',
  reduceMotion: false,
  notifications: { bonuses: true, tournaments: true, product: false },
  twoFactor: false,
  endedSessions: [],
  limit: null, // { amount, code, period }
  pendingLimit: null, // { limit: {…} | null, effectiveAt }
  reminder: 0,
  restriction: null, // { type: 'break' | 'exclusion', until, label }
  closure: null, // { requestedAt, reason }
};

export const fullDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
export const dateTime = (iso) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
