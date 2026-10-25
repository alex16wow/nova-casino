// Signed-in player sample data: wallet, level, notifications and rewards.

export const currencies = [
  { code: 'USDT', symbol: '₮', name: 'Tether', balance: '2,580.00', dot: 'usdt' },
  { code: 'BTC', symbol: '₿', name: 'Bitcoin', balance: '0.0384', dot: 'btc' },
  { code: 'ETH', symbol: '◆', name: 'Ethereum', balance: '0.82', dot: 'eth' },
  { code: 'USDC', symbol: '$', name: 'USD Coin', balance: '1,940.00', dot: 'usdc' },
  { code: 'EUR', symbol: '€', name: 'Euro', balance: '1,425.00', dot: 'eur' },
];

export const playerLevel = {
  level: 12,
  xpMin: 1750,
  xp: 1880,
  xpMax: 2000,
  next: { level: 13, reward: '€15 Bonus + 25 Free Spins', xpLeft: '120' },
};

export const notifications = [
  { id: 'rewards', icon: 'gift', title: 'Your level rewards are ready', text: 'You have 2 unopened rewards. Visit your reward chest to see what is inside.', time: 'Just now', unread: true },
  { id: 'weekly', icon: 'trophy', title: 'Weekly Tournament is live', text: 'Explore this week’s tournament and check the prize pool and participation details.', time: '15 min ago', unread: true },
  { id: 'welcome', icon: 'star', title: 'Welcome to NOVA Casino', text: 'Complete your profile and explore your account settings to get started.', time: '1 hour ago', unread: true },
  { id: 'monthly', icon: 'trophy', title: 'Monthly Tournament announced', text: 'The next monthly event is available. Open Tournaments to learn more.', time: 'Yesterday', unread: false },
  { id: 'account', icon: 'shield', title: 'Keep your account up to date', text: 'Review your contact details and security settings in My profile.', time: '2 days ago', unread: false },
];

export const levelRewards = [
  { id: 'l12', title: 'Level 12 reward', description: 'A €10 bonus to celebrate your latest level.', level: 'Unlocked at Level 12', claimed: false },
  { id: 'spins20', title: 'Free spins pack', description: '20 free spins for your next slot adventure.', level: 'Unlocked at Level 11', claimed: false },
  { id: 'l10', title: 'Level 10 milestone', description: 'A €5 bonus for reaching your first milestone.', level: 'Unlocked at Level 10', claimed: true },
  { id: 'spins10', title: 'Free spins starter pack', description: '10 free spins added to your rewards.', level: 'Unlocked at Level 8', claimed: true },
  { id: 'welcome', title: 'Welcome reward', description: 'Your first level reward on NOVA Casino.', level: 'Unlocked at Level 5', claimed: true },
];

// Account area sections (avatar menu and the tabs on account pages). `live` sections have a page; the rest show "coming soon".
export const accountSections = [
  { id: 'profile', label: 'My profile', icon: 'user', to: '/account/profile', live: true },
  { id: 'wallet', label: 'Wallet', icon: 'wallet', to: '/account/wallet', live: true },
  { id: 'bonuses', label: 'Bonuses', icon: 'gift', to: '/account/bonuses', live: true },
  { id: 'settings', label: 'Settings', icon: 'settings', to: '/account/settings', live: true },
];
export const accountSection = (id) => accountSections.find((s) => s.id === id);

export const profileMenu = [
  ...accountSections,
  { label: 'Log out', icon: 'logout', signout: true },
];
