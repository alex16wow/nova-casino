// Player bonuses: offers, the starting active bonus and history. All terms are demo data and are the
// single source for cards, details, the Wallet bonus balance and the header rewards counter.

const DAY = 86400000;

// Slots that count towards wagering (100%). Table and live games don't count.
export const eligibleGames = ['Gates of Olympus', 'Sugar Rush 1000', 'Big Bass Bonanza', 'Wolf Gold', 'Wild West Gold', 'Sweet Bonanza 1000', 'Book of Dead'];
export const restrictedText = 'Live casino, table games and roulette don’t count towards wagering.';

// Offers shown in Available. `rewardId` links a level reward (see levelRewards); `cta` decides the button:
// claim (no conditions), deposit (activates with a qualifying deposit), details (not claimable yet).
export const offers = {
  l12: {
    id: 'l12', rewardId: 'l12', kind: 'money', type: 'Level reward', cta: 'claim',
    title: 'Level 12 reward', short: 'A €10 bonus to celebrate your latest level.',
    code: 'EUR', amount: 10, wager: 10, maxBet: 5, days: 7, availableDays: 10,
  },
  spins20: {
    id: 'spins20', rewardId: 'spins20', kind: 'spins', type: 'Free spins', cta: 'claim',
    title: 'Free spins pack', short: '20 free spins for your next slot adventure.',
    code: 'USDT', game: 'Gates of Olympus', spins: 20, spinValue: 0.2, winCap: 50, winWager: 10, days: 3, availableDays: 10,
  },
  deposit100: {
    id: 'deposit100', kind: 'money', type: 'Deposit bonus', cta: 'deposit',
    title: 'Super bonus on deposit', short: '100% of your next deposit, up to 50.',
    match: 100, cap: 50, minDeposit: 10, currencies: ['USDT', 'USDC', 'EUR'], wager: 25, maxBet: 5, days: 14, availableDays: 30,
  },
  cashback: {
    id: 'cashback', kind: 'money', type: 'Cashback', cta: 'details', opensInDays: 2,
    title: 'Weekend cashback', short: '10% back on weekend net losses, up to 100 USDT.',
    code: 'USDT', percent: 10, cap: 100, wager: 1, maxBet: 5, days: 3, availableDays: 4,
  },
};

// Promo codes: NOVA25 gives 25 free spins once; any other code is rejected.
export const promoCodes = {
  NOVA25: {
    id: 'promo-nova25', kind: 'spins', type: 'Promo code', title: 'NOVA25 free spins', short: '25 free spins from a promo code.',
    code: 'USDT', game: 'Sweet Bonanza 1000', spins: 25, spinValue: 0.2, winCap: 50, winWager: 10, days: 3,
  },
};

export const offerExpiry = (offer, now = Date.now()) => new Date(now + offer.availableDays * DAY).toISOString();
export const wagerTarget = (b) => b.amount * b.wager;
export const depositBonusAmount = (offer, deposit) => Math.min(deposit * offer.match / 100, offer.cap);

// A bonus record from an offer. Money: amount and wagering; spins: game, count and spin value.
export function makeBonus(offer, { id, amount, code, now = Date.now(), source } = {}) {
  const base = { id: id ?? `BN-${now.toString(36).toUpperCase().slice(-7)}`, offerId: offer.id, title: offer.title, type: offer.type, kind: offer.kind, source, status: 'active', claimedAt: new Date(now).toISOString(), expiresAt: new Date(now + offer.days * DAY).toISOString() };
  return offer.kind === 'money'
    ? { ...base, code: code ?? offer.code, amount: amount ?? offer.amount, wager: offer.wager, wagered: 0, maxBet: offer.maxBet }
    : { ...base, code: offer.code, game: offer.game, spins: offer.spins, spinsLeft: offer.spins, spinValue: offer.spinValue, winCap: offer.winCap, winWager: offer.winWager };
}

// Starting bonuses: one active reload bonus (350 / 1,000 USDT wagered) and a short history.
// Names match the claimed level rewards in levelRewards.
export const seedBonuses = (now = Date.now()) => [
  { id: 'BN-RL4821', offerId: 'reload', title: 'Weekly reload bonus', type: 'Reload bonus', kind: 'money', source: 'deposit', status: 'active', code: 'USDT', amount: 50, wager: 20, wagered: 350, maxBet: 5, deposit: 100, claimedAt: new Date(now - 2 * DAY).toISOString(), expiresAt: new Date(now + 5 * DAY).toISOString() },
  { id: 'BN-WK3310', offerId: 'weekend', title: 'Weekend reload', type: 'Reload bonus', kind: 'money', source: 'deposit', status: 'cancelled', code: 'USDT', amount: 30, wager: 20, wagered: 120, maxBet: 5, claimedAt: new Date(now - 16 * DAY).toISOString(), expiresAt: new Date(now - 9 * DAY).toISOString(), finishedAt: new Date(now - 14 * DAY).toISOString() },
  { id: 'BN-LV1007', offerId: 'l10', title: 'Level 10 milestone', type: 'Level reward', kind: 'money', source: 'reward', status: 'completed', code: 'EUR', amount: 5, wager: 10, wagered: 50, maxBet: 5, claimedAt: new Date(now - 24 * DAY).toISOString(), expiresAt: new Date(now - 17 * DAY).toISOString(), finishedAt: new Date(now - 20 * DAY).toISOString() },
  { id: 'BN-FS0810', offerId: 'spins10', title: 'Free spins starter pack', type: 'Free spins', kind: 'spins', source: 'reward', status: 'expired', code: 'USDT', game: 'Big Bass Bonanza', spins: 10, spinsLeft: 4, spinValue: 0.2, winCap: 50, winWager: 10, claimedAt: new Date(now - 40 * DAY).toISOString(), expiresAt: new Date(now - 37 * DAY).toISOString(), finishedAt: new Date(now - 37 * DAY).toISOString() },
  { id: 'BN-WL0501', offerId: 'welcome', title: 'Welcome reward', type: 'Level reward', kind: 'money', source: 'reward', status: 'completed', code: 'USDT', amount: 10, wager: 10, wagered: 100, maxBet: 5, claimedAt: new Date(now - 60 * DAY).toISOString(), expiresAt: new Date(now - 53 * DAY).toISOString(), finishedAt: new Date(now - 55 * DAY).toISOString() },
];
