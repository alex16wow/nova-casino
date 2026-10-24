import { useSyncExternalStore } from 'react';

// Breakpoints shared by every page: mobile ≤680, tablet 681–1279, desktop ≥1280.
export const MOBILE = '(max-width:680px)';
export const TOUCH = '(max-width:1279px)';
export const TABLET = '(min-width:681px) and (max-width:1279px)';

export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
  );
}

export function useBreakpoint() {
  const mobile = useMediaQuery(MOBILE);
  const touch = useMediaQuery(TOUCH);
  return { mobile, tablet: touch && !mobile, touch, desktop: !touch };
}

export const matches = (query) => window.matchMedia(query).matches;
