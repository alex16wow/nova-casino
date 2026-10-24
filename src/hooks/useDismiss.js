import { useEffect, useRef } from 'react';

// Closes a popup on an outside click or Escape. `refs` are the elements that count as inside.
export function useDismiss(open, close, refs, { onEscape } = {}) {
  const state = useRef({});
  state.current = { open, close, refs, onEscape };

  useEffect(() => {
    const onClick = (e) => {
      const { open, close, refs } = state.current;
      if (open && !refs.some((ref) => ref.current?.contains(e.target))) close();
    };
    const onKey = (e) => {
      const { open, close, onEscape } = state.current;
      if (e.key === 'Escape' && open) {
        close();
        onEscape?.();
      }
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
}
