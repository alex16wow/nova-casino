import { useCallback, useEffect, useState } from 'react';
import { fetchGame } from '../../lib/api.js';

// Loads one game by slug. status: 'loading' | 'ready' | 'error'; error.code 'not_found' for unknown games.
export function useGameData(slug) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    setState({ status: 'loading', data: null, error: null });
    fetchGame(slug)
      .then((data) => live && setState({ status: 'ready', data, error: null }))
      .catch((error) => live && setState({ status: 'error', data: null, error }));
    return () => { live = false; };
  }, [slug, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
