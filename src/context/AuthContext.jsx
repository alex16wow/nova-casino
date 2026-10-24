import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { readJSON, writeJSON } from '../lib/storage.js';
import { usePreviewAction } from './ToastContext.jsx';

// Session and the auth modal. A guest sees sign-in / sign-up instead of the wallet and account controls.
const AuthContext = createContext(null);
const KEY = 'nova-session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(KEY, null));
  // Auth modal view: null | 'login' | 'register' | 'forgot' | 'logout'
  const [view, setView] = useState(null);

  const startSession = useCallback((account) => {
    setUser(account);
    writeJSON(KEY, account);
  }, []);
  const endSession = useCallback(() => {
    setUser(null);
    writeJSON(KEY, null);
  }, []);

  const value = useMemo(() => ({
    user,
    isGuest: !user,
    startSession,
    endSession,
    authView: view,
    openAuth: setView,
    closeAuth: () => setView(null),
  }), [user, view, startSession, endSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

// Wraps an action that needs an account: guests get the auth modal instead.
export function useAccountAction() {
  const { isGuest, openAuth } = useAuth();
  return useCallback((action, view = 'register') => (...args) => {
    if (isGuest) {
      args[0]?.preventDefault?.();
      openAuth(view);
      return;
    }
    return action(...args);
  }, [isGuest, openAuth]);
}

// Placeholder action that needs an account (join, claim, deposit): guests are asked to sign up first.
export function useAccountPreview(view = 'register') {
  const preview = usePreviewAction();
  const gate = useAccountAction();
  return useMemo(() => gate(preview, view), [gate, preview, view]);
}
