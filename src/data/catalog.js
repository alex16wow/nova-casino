// Category and provider pages: which games each one lists. Sample data built from the home page shelves.
import { gameSets, shelves } from './games.js';
import { lobbyCategories, providers } from './lobby.jsx';

const kindByPage = Object.fromEntries(Object.values(shelves).map((s) => [s.page, s.kind]));

// Lobby mixes every home shelf except Game Shows, one game from each shelf in turn.
const mixKinds = ['top', 'fresh', 'live', 'table', 'roulette'];
const lobbyMix = gameSets.top.flatMap((_, i) => mixKinds.map((k) => gameSets[k][i]).filter(Boolean));

export const categoryPage = (page) => {
  const category = lobbyCategories.find((c) => c.page === page);
  if (!category) return null;
  const kind = kindByPage[page];
  return { ...category, title: category.label, kind: kind ?? 'lobby', games: kind ? gameSets[kind] : lobbyMix };
};

// Provider pages look like the lobby: the provider's own games first, then the rest of the mix.
export const providerPage = (slug) => {
  const entry = providers.find(([, file]) => file === slug);
  if (!entry) return null;
  const [name, file] = entry;
  const own = lobbyMix.filter((g) => g.provider.startsWith(name));
  return { page: `providers/${file}`, title: name, logo: `provider-${file}.svg`, kind: 'lobby', games: [...own, ...lobbyMix.filter((g) => !own.includes(g))] };
};

// Short lists are repeated forward, then backward (1…n, n…1, 1…n…) so pages look full.
export function fillGames(list, count) {
  const out = [];
  for (let pass = 0; list.length && out.length < count; pass++) {
    const run = pass % 2 ? [...list].reverse() : list;
    out.push(...run.slice(0, count - out.length));
  }
  return out;
}

// Cards per Show More: whole rows at every grid width (8/6/4/3 columns, Game Shows 4/3/2).
export const pageSize = (kind) => (kind === 'shows' ? 12 : 24);
export const MAX_PAGES = 5;
