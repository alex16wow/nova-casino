// Site navigation. `page` slugs are routes; links to pages that don't exist yet stay inert (see `livePages`).

export const sidebarGroups = [
  {
    label: 'Main navigation',
    className: 'lobby-group',
    links: [
      { page: 'home', to: '/', label: 'Lobby', icon: 'home', wrap: true },
      { page: 'lobby', label: 'All Games', icon: 'lobby', wrap: true },
      { page: 'top-games', label: 'Top Games', icon: 'topGames' },
      { page: 'new-games', label: 'New Games', icon: 'newGames' },
      { page: 'live-games', label: 'Live Games', icon: 'liveGames' },
      { page: 'table-games', label: 'Table Games', icon: 'tableGames' },
      { page: 'roulette', label: 'Roulette', icon: 'roulette' },
      { page: 'game-shows', label: 'Game Shows', icon: 'gameShows' },
    ],
  },
  {
    label: 'Promotions',
    links: [
      { page: 'promotions', label: 'Promotions', icon: 'promotions', wrap: true },
      { page: 'tournaments', label: 'Tournaments', icon: 'tournaments', wrap: true },
      { page: 'vip', label: 'VIP Club', icon: 'vip', wrap: true },
    ],
  },
  {
    label: 'Personal',
    links: [
      { page: 'favorites', label: 'Favorites', icon: 'favorites', wrap: true },
      { page: 'recently-played', label: 'Recently Played', icon: 'recent', wrap: true },
    ],
  },
];

export const supportLink = { page: 'support', label: 'Support', icon: 'support', wrap: true };

export const mobileNav = [
  { to: '/', label: 'Lobby', icon: 'dockLobby' },
  { to: '/top-games', label: 'Top games', icon: 'dockTop' },
  { to: '/live-games', label: 'Live', icon: 'dockLive' },
  { to: '/favorites', label: 'Favorites', icon: 'dockFavorites' },
  { href: '#top', label: 'Account', icon: 'dockAccount' },
];

export const footerColumns = [
  { title: 'Resources', links: [['Promotions', '#promotions'], ['VIP Club', '#promotions'], ['Tournaments', '#top-games']] },
  { title: 'Company', links: [['About us', '#top'], ['Responsible gaming', '#top'], ['Careers', '#top']] },
  { title: 'Help', links: [['Support', '#top'], ['FAQ', '#top'], ['Contact us', '#top']] },
  { title: 'Legal', links: [['Terms & Conditions', '#top'], ['Privacy policy', '#top'], ['Fair play', '#top']] },
];

export const paymentMethods = ['VISA', 'Mastercard', 'Skrill', 'NETELLER', 'Crypto'];

export const socialLinks = ['Discord', 'Telegram', 'X', 'YouTube'];

// Pages that exist. Other nav slugs keep a placeholder address and do nothing on click.
export const livePages = new Set(['lobby', 'top-games', 'new-games', 'live-games', 'table-games', 'roulette', 'game-shows', 'favorites', 'recently-played']);
export const pageHref = (page) => (livePages.has(page) ? `/${page}` : `pages/${page}.html`);
