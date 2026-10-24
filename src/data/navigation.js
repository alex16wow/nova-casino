// Site navigation. `page` slugs are the future routes; they are inert until each page exists.

export const sidebarGroups = [
  {
    label: 'Main navigation',
    className: 'lobby-group',
    links: [
      { page: 'lobby', label: 'Lobby', icon: 'lobby', wrap: true },
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
      { page: 'recent', label: 'Recently Played', icon: 'recent', wrap: true },
    ],
  },
];

export const supportLink = { page: 'support', label: 'Support', icon: 'support', wrap: true };

export const mobileNav = [
  { href: '#top', label: 'Lobby', icon: 'dockLobby' },
  { href: '#top-games', label: 'Top games', icon: 'dockTop' },
  { href: '#live-games', label: 'Live', icon: 'dockLive' },
  { href: '#favorites', label: 'Favorites', icon: 'dockFavorites' },
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

// Future page path for a nav slug. Pages are not implemented yet, so links stay inert.
export const pageHref = (page) => `pages/${page}.html`;
