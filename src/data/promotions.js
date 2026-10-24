// Promotions, tournaments and Loyalty Club. Static demo content.
import { tournaments as lobbyTournaments } from './lobby.jsx';

export const promoFilters = ['All', 'Welcome', 'Reload', 'Special'];

const terms = [
  'Minimum deposit: €20.',
  'The bonus must be activated within 72 hours of the deposit.',
  'The bonus is valid for 7 days after activation.',
  'Wagering requirement: 35× the bonus amount.',
  'Maximum bet while wagering: €5.',
  'Free spins winnings are credited as bonus funds.',
  'Only one bonus can be active at a time.',
];

export const promotions = [
  { id: 'welcome', type: 'Welcome', title: 'Welcome Bonus', offer: '100% up to €500 + 200 FS', code: 'NOVA100', about: 'Start strong: your first deposit is doubled and comes with 200 free spins to explore our top slots.' },
  { id: 'second', type: 'Welcome', title: 'Second Deposit Bonus', offer: '75% up to €750 + 100 FS', code: 'NOVA75', about: 'Keep the momentum going with an extra boost on your second deposit.' },
  { id: 'weekend', type: 'Reload', title: 'Weekend Reload', offer: '50% up to €300', code: 'WEEKEND', about: 'Top up on Saturday or Sunday and get half of your deposit back as a bonus.' },
  { id: 'midweek', type: 'Reload', title: 'Midweek Spins', offer: 'Up to 150 free spins', code: 'MIDWEEK', about: 'Deposit on Wednesday and collect free spins on a featured slot.' },
  { id: 'cashback', type: 'Special', title: 'Weekly Cashback', offer: '10% back up to €1,000', code: 'CASHBACK', about: 'Get part of your weekly net losses back every Monday, no strings attached.' },
  { id: 'highroller', type: 'Special', title: 'High Roller Bonus', offer: '150% up to €2,000', code: 'HIGHROLL', about: 'For bigger deposits: a larger match and higher limits.' },
].map((p) => ({ ...p, terms }));

export const promoSteps = (code) => [
  ['Make a deposit', `Deposit the required amount and enter the promo code ${code}.`],
  ['Collect your reward', 'Activate the bonus in the Bonuses section of your account.'],
  ['Start playing', 'Enjoy top casino games and make the most of your bonus.'],
];

export const tournamentFilters = ['All', 'Daily', 'Weekly', 'Monthly'];

const day = 86400000;
const loadedAt = Date.now();
const board = (prizes) => [
  ['an***a', 1840], ['ma***x', 1525.4], ['lu***y', 1210], ['ni***o', 860.5], ['st***r', 610],
].map(([player, score], i) => ({ player, score, prize: prizes[i] }));

export const tournamentsList = [
  { id: 'daily', type: 'Daily', name: 'Daily Tournament', prize: '€5,000', end: loadedAt + day * 0.55, players: 312, board: board(['€2,000', '€1,200', '€800', '€600', '€400']) },
  { id: 'weekly', type: 'Weekly', name: lobbyTournaments[0].name, prize: lobbyTournaments[0].prize, end: lobbyTournaments[0].end, players: 1284, board: board(['€20,000', '€12,000', '€8,000', '€6,000', '€4,000']) },
  { id: 'monthly', type: 'Monthly', name: lobbyTournaments[1].name, prize: lobbyTournaments[1].prize, end: lobbyTournaments[1].end, players: 4590, board: board(['€100,000', '€60,000', '€40,000', '€30,000', '€20,000']) },
];

export const tournamentTerms = [
  'All real-money bets on eligible slots count towards your score.',
  'Score = total win ÷ bet for each spin; your best results add up.',
  'Minimum bet to qualify: €0.20.',
  'Prizes are credited within 24 hours after the tournament ends.',
  'Prizes have a 3× wagering requirement.',
];

export const statuses = [
  { id: 'bronze', name: 'Bronze', range: '1–10' },
  { id: 'silver', name: 'Silver', range: '11–20' },
  { id: 'gold', name: 'Gold', range: '21–30' },
  { id: 'platinum', name: 'Platinum', range: '31–40' },
  { id: 'diamond', name: 'Diamond', range: '41–50' },
];

// XP grows a little faster each level; rewards alternate free spins and cash.
export const loyaltyLevels = Array.from({ length: 50 }, (_, i) => {
  const level = i + 1;
  const xp = Math.round((50 * level + 8 * level * level) / 10) * 10;
  const reward = level % 5 === 0 ? `€${level * 20} bonus` : `${Math.ceil(level / 2) * 10} FS`;
  return { level, xp, reward, status: statuses[Math.floor(i / 10)].name };
});

export const loyaltyFaq = [
  ['How do I join the Loyalty Club?', 'Every registered player is a member automatically. Your first real-money bet starts your progress.'],
  ['How do I earn XP?', 'You earn XP for every real-money bet. €10 wagered on slots gives 1 XP; table and live games count at a lower rate.'],
  ['What do the statuses give me?', 'Each status unlocks bigger level rewards, higher cashback and faster withdrawals.'],
  ['How often is my progress updated?', 'Your XP is updated in real time after every settled bet.'],
  ['What happens at level 50?', 'You keep the Diamond status and receive personal offers from your VIP manager.'],
  ['Terms and conditions', 'Rewards are credited to the Bonuses section and must be activated within 7 days. Free spins winnings have a 35× wagering requirement. Nova Casino may change the program at any time.'],
];
