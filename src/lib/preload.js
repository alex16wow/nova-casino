// Keeps slider artwork decoded in memory so every slide change shows its images at once,
// even when the host serves files without caching (slides mount fresh <img> elements on each change).
const kept = new Map();

export function preloadImages(urls) {
  for (const url of urls) {
    if (kept.has(url)) continue;
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    img.decode?.().catch(() => {});
    kept.set(url, img);
  }
}
