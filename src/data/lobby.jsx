// Home page content. Sample data for the prototype.

export const heroSlides = [
  {
    eyebrow: 'WELCOME TO',
    title: <>NOVA <em>CASINO</em></>,
    subtitle: 'PLAY BIGGER. HIGHER. BRIGHTER.',
    action: 'Explore games',
    to: '/lobby',
    art: { variant: 'nova', background: 'hero-nova-bg.webp', gifts: 'hero-nova-gifts.webp', glow: 'hero-nova-glow.webp', character: 'hero-nova-character.webp' },
  },
  {
    eyebrow: 'YOUR NEXT WIN STARTS HERE',
    title: <>CHASE <em>THE GLOW</em></>,
    subtitle: 'FIND YOUR GAME. MAKE IT YOURS.',
    action: 'Discover games',
    to: '/top-games',
    art: { variant: 'chase', background: 'hero-chase-bg.webp', glow: 'hero-chase-glow.webp', character: 'hero-chase-character.webp' },
  },
  {
    eyebrow: 'STEP INTO THE SPOTLIGHT',
    title: <><span className="mobile-play-without-line">PLAY <em>WITHOUT</em></span> <em className="mobile-limits-line">LIMITS</em></>,
    subtitle: 'BIG ENERGY. BRIGHTER MOMENTS.',
    action: 'See what’s new',
    to: '/new-games',
    art: { background: 'hero-without-limits-bg.webp', glow: 'hero-without-limits-glow.webp', character: 'hero-without-limits-character.webp' },
  },
];

const hours = (d, h, m, s) => ((d * 24 + h) * 3600 + m * 60 + s) * 1000;
const loadedAt = Date.now();

export const tournaments = [
  { name: 'Weekly Tournament', prize: '€50,000', end: loadedAt + hours(3, 12, 34, 56), tone: 'weekly' },
  { name: 'Monthly Tournament', prize: '€250,000', end: loadedAt + hours(17, 8, 21, 9), tone: 'monthly' },
];

export const winners = [
  { name: 'Mikael**', game: 'Gates of Olympus', win: '€2,450', avatar: 'nova-live-01.webp' },
  { name: 'Sara**', game: 'Sweet Bonanza 1000', win: '€1,200', avatar: 'nova-live-02.webp' },
  { name: 'Alex**', game: 'Quantum Blackjack Plus', win: '€980', avatar: 'nova-live-03.webp' },
  { name: 'Luna**', game: 'Lightning Storm', win: '€3,780', avatar: 'nova-live-04.webp' },
  { name: 'Noah**', game: 'MONOPOLY Big Baller', win: '€650', avatar: 'nova-live-05.webp' },
  { name: 'Eva**', game: 'Crazy Coin Flip', win: '€1,850', avatar: 'nova-live-06.webp' },
  { name: 'Leo**', game: 'MONOPOLY Live', win: '€4,120', avatar: 'nova-live-07.webp' },
  { name: 'Mia**', game: 'Lightning Roulette', win: '€2,240', avatar: 'nova-live-08.webp' },
];

const bet = (game, user, amount, multiplier, profit, time, image) => ({ game, user, amount, multiplier, profit, time, image });

export const activityTabs = [
  {
    label: 'Recent Bets',
    rows: [
      bet('Gates of Olympus', 'Player123', '$2.00', 'x12.50', '+$25.00', '10:24', 'table-07.webp'),
      bet('Ice Fishing', 'PolarKing', '$5.00', 'x24.00', '+$120.00', '10:25', 'nova-live-01.webp'),
      bet('Starburst', 'LuckyBird', '$1.50', 'x50.00', '+$75.00', '10:26', 'table-02.webp'),
      bet('Quantum Roulette Live', 'CryptoMax', '$3.00', 'x8.20', '+$24.60', '10:27', 'nova-table-08.webp'),
      bet('Sugar Rush 1000', 'WinMaster', '$10.00', 'x8.00', '+$80.00', '10:28', 'table-04.webp'),
      bet('Crazy Coin Flip', 'NeonNova', '$4.00', 'x32.50', '+$130.00', '10:29', 'nova-live-06.webp'),
      bet('Emerald VIP Blackjack 7', 'VelvetAce', '$25.00', 'x2.50', '+$62.50', '10:30', 'nova-table-01.webp'),
      bet('MONOPOLY Big Baller', 'MoonWalker', '$7.50', 'x64.00', '+$480.00', '10:31', 'nova-live-03.webp'),
    ],
  },
  {
    label: 'Top Players',
    rows: [
      bet('Wanted Dead or a Wild', 'AceHunter', '$100.00', 'x125.00', '+$12,500.00', '11:42', 'nova-top-03.webp'),
      bet('Gates of Olympus', 'OlympusQueen', '$75.00', 'x160.00', '+$12,000.00', '11:39', 'nova-top-07.webp'),
      bet('Le Bandit', 'GoldenFox', '$50.00', 'x210.00', '+$10,500.00', '11:35', 'nova-top-08.webp'),
      bet('Sweet Bonanza 1000', 'SweetLegend', '$80.00', 'x120.00', '+$9,600.00', '11:31', 'nova-new-07.webp'),
      bet('Gold Vault Roulette', 'VaultViper', '$200.00', 'x45.00', '+$9,000.00', '11:28', 'nova-roulette-05.webp'),
      bet('Stormforged', 'ThunderAce', '$40.00', 'x200.00', '+$8,000.00', '11:24', 'nova-new-02.webp'),
      bet('Big Bass Bonanza', 'ReelCaptain', '$60.00', 'x125.00', '+$7,500.00', '11:21', 'nova-top-05.webp'),
      bet('Lightning Storm', 'StormRider', '$125.00', 'x52.00', '+$6,500.00', '11:18', 'nova-live-05.webp'),
    ],
  },
  {
    label: 'Big Wins',
    rows: [
      bet('Chaos Crew 2', 'ChaosPilot', '$5.00', 'x5,000.00', '+$25,000.00', '12:06', 'nova-new-05.webp'),
      bet('Sugar Rush 1000', 'CandyComet', '$4.00', 'x4,500.00', '+$18,000.00', '12:01', 'nova-top-04.webp'),
      bet('Dork Unit', 'PixelWizard', '$2.50', 'x4,000.00', '+$10,000.00', '11:57', 'nova-new-03.webp'),
      bet('Treasure Island', 'TreasureSeeker', '$10.00', 'x850.00', '+$8,500.00', '11:53', 'nova-show-01.webp'),
      bet('Book of Ra', 'DesertPharaoh', '$3.00', 'x2,500.00', '+$7,500.00', '11:49', 'nova-new-08.webp'),
      bet('Retro Sweets', 'RetroRocket', '$2.00', 'x3,200.00', '+$6,400.00', '11:45', 'nova-new-01.webp'),
      bet('Dragon Hero', 'JadeDragon', '$4.00', 'x1,500.00', '+$6,000.00', '11:40', 'nova-new-06.webp'),
      bet('MONOPOLY Live', 'BoardBoss', '$15.00', 'x360.00', '+$5,400.00', '11:36', 'nova-live-07.webp'),
    ],
  },
];

export const bonusSlides = [
  { title: 'Super bonus on deposit', accent: 'up to €50', copy: 'Boost your balance and discover more games.', action: 'Deposit now', to: '/account/wallet?tab=deposit', art: 'first', needsAccount: true },
  { title: 'Your next adventure', accent: 'starts here', copy: 'Explore new tables and find your next favorite.', action: 'Explore games', to: '/lobby', art: 'second' },
];

export const promos = [
  { title: 'Table', accent: 'Games', copy: 'Discover blackjack, baccarat and more', action: 'Explore games', to: '/table-games', image: 'body-original.webp', alt: 'Purple crystal game artwork' },
  { title: 'Bonuses &', accent: 'Rewards', copy: 'Explore your bonuses and rewards', action: 'View bonuses', to: '/account/bonuses', needsAccount: true, image: 'body-missions.webp', alt: 'Neon mission artwork' },
  { title: 'Casino', accent: 'Tournaments', copy: 'Explore tournaments and prize pools', action: 'View tournaments', to: '/tournaments', image: 'body-season.webp', alt: 'Seasonal tournament trophy' },
];

export const providers = [
  ['Pragmatic Play', 'pragmatic'],
  ['True Lab', 'truelab'],
  ['Playson', 'playson'],
  ['NetGame', 'netgame'],
  ['Evolution', 'evolution'],
  ['BGaming', 'bgaming'],
  ['1spin4win', '1spin4win'],
];

export const lobbyCategories = [
  { page: 'lobby', label: 'All Games', icon: 'category-lobby.webp' },
  { page: 'top-games', label: 'Top Games', icon: 'category-top-games.webp' },
  { page: 'new-games', label: 'New Games', icon: 'category-new-games.webp' },
  { page: 'live-games', label: 'Live Games', icon: 'category-live-games.webp' },
  { page: 'table-games', label: 'Table Games', icon: 'category-table-games.webp' },
  { page: 'roulette', label: 'Roulette', icon: 'category-roulette.webp' },
  { page: 'game-shows', label: 'Game Shows', icon: 'category-game-shows.webp' },
];

export const faq = [
  {
    question: 'How do I create an account?',
    answer: 'Choose Sign up and complete your profile with the required details. Once your account is ready, you can explore games and manage your preferences from My profile. Use an email address you can access and choose a unique password to help keep your account secure. Keep your personal details up to date, as they may be needed when verifying your identity or contacting support. You can review your account information and notification preferences at any time in Settings.',
  },
  {
    question: 'How can I add funds to my wallet?',
    answer: 'Open Wallet or choose Deposit to see the payment methods available to your account. Select a method and follow the instructions. Any applicable limits and fees will be shown before you confirm. Check the selected currency and deposit amount carefully, especially when using a cryptocurrency wallet. Some payment methods may require additional confirmation from your bank or payment provider. After completing the payment, check your wallet balance and transaction history for an update.',
  },
  {
    question: 'Where can I find my bonuses?',
    answer: 'Open Bonuses from your account menu to see available offers and rewards. Check the terms of each offer, including any wagering requirements and expiry date, before activating it. Different promotions may apply to different games, payment methods or account levels. Your bonus details should explain which games contribute to the requirements and whether any limits apply. If you are unsure how an offer works, contact support before claiming it so you know what to expect.',
  },
  {
    question: 'How do withdrawals work?',
    answer: 'Open Wallet, choose Withdraw and select an available payment method. You may need to verify your account first. Processing information and the status of your request will appear in your transaction history. Before submitting, check that your payment details are correct and review any withdrawal limits or fees. An active bonus may also have conditions that need to be completed first. If a request needs more information, check your account notifications or contact support with the transaction reference.',
  },
  {
    question: 'How can I contact support?',
    answer: 'Choose Support to get help with your account, payments or games. Include a short description of the issue and any relevant transaction or game details so the team can assist you. A screenshot, the approximate time of the issue and the name of the game can help explain what happened. For payment questions, include the transaction reference when available. Never share your password or wallet recovery phrase. You can also check these frequently asked questions for quick guidance before contacting the team.',
  },
];
