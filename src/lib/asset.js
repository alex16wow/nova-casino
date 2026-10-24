// Public asset URL that works under the GitHub Pages base path on every route.
// Relative-base preview builds resolve against the page, so URLs stay valid inside CSS variables.
const base = new URL(import.meta.env.BASE_URL, document.baseURI).href;
export const asset = (file) => `${base}assets/${file}`;
