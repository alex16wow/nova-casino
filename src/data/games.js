// Game catalogue for the lobby shelves and header search. Sample data.

const pad = (n) => String(n).padStart(2, '0');

// Shelf kind → artwork file prefix in public/assets.
export const imagePrefixes = {
  top: 'nova-top',
  fresh: 'nova-new',
  live: 'nova-live',
  table: 'nova-table',
  roulette: 'nova-roulette',
  shows: 'nova-show',
};

export const gameImage = (kind, n) => `${imagePrefixes[kind]}-${pad(n)}.webp`;

const toGames = (kind, rows) => rows.map(([name, provider, n]) => ({ name, provider, image: gameImage(kind, n), kind }));

export const gameSets = {
  top: toGames('top', [
    ['Gates of Olympus', 'Pragmatic Play', 7],
    ['Sugar Rush 1000', 'Pragmatic Play', 4],
    ['Wanted Dead or a Wild', 'Hacksaw Gaming', 3],
    ['Big Bass Bonanza', 'Pragmatic Play', 5],
    ['Le Bandit', 'Hacksaw Gaming', 8],
    ['Book of Dead', 'Play’n GO', 1],
    ['Starburst', 'NetEnt', 2],
    ['Wolf Gold', 'Pragmatic Play', 6],
  ]),
  fresh: toGames('fresh', [
    ['Retro Sweets', 'Push Gaming', 1],
    ['Stormforged', 'Hacksaw Gaming', 2],
    ['Dork Unit', 'Hacksaw Gaming', 3],
    ['Wild West Gold', 'Pragmatic Play', 4],
    ['Chaos Crew 2', 'Hacksaw Gaming', 5],
    ['Dragon Hero', 'Pragmatic Play', 6],
    ['Sweet Bonanza 1000', 'Pragmatic Play', 7],
    ['Book of Ra', 'Novomatic', 8],
  ]),
  live: toGames('live', [
    ['Ice Fishing', 'Evolution', 1],
    ['Red Baron', 'Evolution', 2],
    ['MONOPOLY Big Baller', 'Evolution', 3],
    ['Marble Race', 'Evolution', 4],
    ['Lightning Storm', 'Evolution', 5],
    ['Crazy Coin Flip', 'Evolution', 6],
    ['MONOPOLY Live', 'Evolution', 7],
    ['Lightning Roulette', 'Evolution', 8],
  ]),
  table: toGames('table', [
    ['Emerald VIP Blackjack 7', 'Pragmatic Play Live', 1],
    ['Mega Fire Blaze Roulette Live', 'Playtech', 2],
    ['Quantum Blackjack Plus', 'Playtech', 3],
    ['Age of the Gods Bonus Roulette Live', 'Playtech', 4],
    ['Always 8 Baccarat Live', 'Evolution', 5],
    ['First Person Golden Wealth Baccarat', 'Evolution', 6],
    ['Dragon Tiger Live', 'Pragmatic Play Live', 7],
    ['Quantum Roulette Live', 'Playtech', 8],
  ]),
  roulette: toGames('roulette', [
    ['Red Door Roulette', 'Evolution', 1],
    ['Immersive Roulette Deluxe', 'Pragmatic Play', 2],
    ['American Roulette', 'BGaming', 3],
    ['Oracle Blaze', 'LuckyStreak', 4],
    ['Gold Vault Roulette', 'Evolution', 5],
    ['Turkish Roulette', 'Ezugi', 6],
    ['Japanese Roulette', 'Evolution', 7],
    ['Auto Mega Roulette', 'Pragmatic Play', 8],
  ]),
  shows: toGames('shows', [
    ['Treasure Island', 'Pragmatic Play', 1],
    ['Auto Mega Roulette', 'Pragmatic Play', 2],
    ['Mega Wheel Latina', 'Pragmatic Play', 3],
    ['Money Time', 'Pragmatic Play', 4],
  ]),
};

// Category labels plus extra search keywords (EN + RU).
export const categoryKeywords = {
  top: ['Top Games', 'top popular топ популярные'],
  fresh: ['New Games', 'new fresh новые новинки'],
  live: ['Live Games', 'live live casino лайв живые'],
  table: ['Table Games', 'table настольные blackjack baccarat баккара блэкджек'],
  roulette: ['Roulette', 'roulette рулетка'],
  shows: ['Game Shows', 'game shows shows шоу'],
};

// Home page shelves, in page order. Promotions and providers sit between them.
export const shelves = {
  top: { id: 'top-games', rowId: 'top-row', kind: 'top', title: 'Top Games', sub: 'The games everyone is playing', icon: 'category-top-games.webp', label: 'top games' },
  fresh: { id: 'new-games', rowId: 'new-row', kind: 'fresh', title: 'New Games', sub: 'Fresh drops, just added', icon: 'category-new-games.webp', label: 'new games' },
  live: { id: 'live-games', rowId: 'live-row', kind: 'live', title: 'Live Games', sub: 'Join the table in real time', icon: 'category-live-games.webp', label: 'live games', eight: true },
  table: { id: 'table-games', rowId: 'table-row', kind: 'table', title: 'Table Games', sub: 'Classic games, new energy', icon: 'category-table-games.webp', label: 'table games', eight: true },
  roulette: { id: 'roulette', rowId: 'roulette-row', kind: 'roulette', title: 'Roulette', sub: 'Take a spin', icon: 'category-roulette.webp', label: 'roulette games', eight: true },
  shows: { id: 'game-shows', rowId: 'shows-row', kind: 'shows', title: 'Game Shows', sub: 'Big lights. Bigger moments.', icon: 'category-game-shows.webp', label: 'game shows' },
};
