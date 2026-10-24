import { useCallback, useEffect, useState } from 'react';
import { fetchLobby } from '../lib/api.js';

// Loads the lobby shelves and activity feed. status: 'loading' | 'ready' | 'error'.
export function useLobbyData() {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, status: 'loading', error: null }));
    fetchLobby()
      .then((data) => live && setState({ status: 'ready', data, error: null }))
      .catch((error) => live && setState({ status: 'error', data: null, error }));
    return () => { live = false; };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
