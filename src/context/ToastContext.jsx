import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(() => {});

export const PREVIEW_MESSAGE = 'This preview action will be connected in the next iteration';

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ text: '', show: false });
  const timer = useRef();
  const notify = useCallback((text) => {
    setToast({ text, show: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2300);
  }, []);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className={`toast${toast.show ? ' show' : ''}`} id="toast" role="status" aria-live="polite">{toast.text}</div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// Placeholder for actions whose destination is not built yet.
export function usePreviewAction() {
  const toast = useToast();
  return useCallback((e) => {
    e?.preventDefault();
    toast(PREVIEW_MESSAGE);
  }, [toast]);
}
