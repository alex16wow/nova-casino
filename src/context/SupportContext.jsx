import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { chatAutoReply } from '../data/support.js';
import { readJSON, writeJSON } from '../lib/storage.js';

// Support widget state. Everything except "open" lives in sessionStorage (`nova-support`):
// screen history per tab, search, conversation, draft, article ratings and scroll positions
// survive closing the panel, page changes and reloads; a new tab starts fresh.
const KEY = 'nova-support';
const REPLY_DELAY = 1400;

const initial = {
  tab: 'home', // 'home' | 'messages' | 'help'
  stacks: { home: [], messages: [], help: [] }, // screens over the tab root: { type: 'article' | 'category' | 'chat', id? }
  query: '',
  messages: [], // { id, from: 'user' | 'support', text, time }
  draft: '',
  pending: false,
  ratings: {}, // articleId -> 'bad' | 'ok' | 'good'
};

const SupportContext = createContext(null);

export const screenKey = (tab, stack) => {
  const top = stack[stack.length - 1];
  return `${tab}/${stack.length}/${top ? `${top.type}:${top.id ?? ''}` : 'root'}`;
};

const message = (from, text) => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, from, text, time: Date.now() });

export function SupportProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(() => ({ ...initial, ...readJSON(KEY, {}, { session: true }) }));
  // Scroll positions (screen key -> scrollTop) change on every scroll event, so they skip React state.
  const scroll = useRef(readJSON(`${KEY}-scroll`, {}, { session: true }));
  const timer = useRef(0);

  useEffect(() => writeJSON(KEY, state, { session: true }), [state]);

  // The demo reply is timed here, not in the chat screen, so it still arrives if the panel is closed.
  useEffect(() => {
    if (!state.pending) return;
    timer.current = setTimeout(() => {
      setState((s) => ({ ...s, pending: false, messages: [...s.messages, message('support', chatAutoReply)] }));
    }, REPLY_DELAY);
    return () => clearTimeout(timer.current);
  }, [state.pending]);

  const actions = useMemo(() => {
    const update = (fn) => setState((s) => ({ ...s, ...fn(s) }));
    // Opening a screen forgets any scroll position left from an earlier visit at the same depth.
    // Screens open in the current tab.
    const forget = (key) => {
      delete scroll.current[key];
      writeJSON(`${KEY}-scroll`, scroll.current, { session: true });
    };
    const push = (screen) => update((s) => {
      const stack = [...s.stacks[s.tab], screen];
      forget(screenKey(s.tab, stack));
      return { stacks: { ...s.stacks, [s.tab]: stack } };
    });
    return {
      // Tab buttons always show the tab's main screen.
      selectTab: (tab) => update((s) => ({ tab, stacks: { ...s.stacks, [tab]: [] } })),
      openArticle: (id) => push({ type: 'article', id }),
      openCategory: (id) => push({ type: 'category', id }),
      back: () => update((s) => {
        const stack = s.stacks[s.tab];
        forget(screenKey(s.tab, stack));
        return { stacks: { ...s.stacks, [s.tab]: stack.slice(0, -1) } };
      }),
      openChat: () => update((s) => ({ tab: 'messages', stacks: { ...s.stacks, messages: [{ type: 'chat' }] } })),
      setQuery: (query) => update(() => ({ query })),
      setDraft: (draft) => update(() => ({ draft })),
      send: (text) => update((s) => ({ draft: '', pending: true, messages: [...s.messages, message('user', text)] })),
      rate: (id, value) => update((s) => ({ ratings: { ...s.ratings, [id]: value } })),
      getScroll: (key) => scroll.current[key] ?? 0,
      saveScroll: (key, top) => {
        scroll.current[key] = top;
        writeJSON(`${KEY}-scroll`, scroll.current, { session: true });
      },
    };
  }, []);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, toggle, close, state, ...actions }), [open, toggle, close, state, actions]);
  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>;
}

export const useSupport = () => useContext(SupportContext);
