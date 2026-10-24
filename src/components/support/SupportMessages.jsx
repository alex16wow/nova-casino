import { useLayoutEffect, useRef } from 'react';
import { useSupport } from '../../context/SupportContext.jsx';
import { chatGreeting } from '../../data/support.js';
import Button from '../ui/Button.jsx';
import { ChevronRight } from '../ui/icons.jsx';
import { SupportHeader, SupportScroll } from './SupportFrame.jsx';
import { AgentIcon, ChatIcon, SendIcon } from './supportIcons.jsx';

const clock = (time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Messages tab: empty state, or the one demo conversation once it has started.
export function SupportMessages({ screenKey }) {
  const { state, openChat } = useSupport();
  const last = state.messages[state.messages.length - 1];
  return (
    <>
      <SupportHeader title="Messages" titleId="nv-support-title" />
      {last ? (
        <SupportScroll screenKey={screenKey}>
          <button type="button" className="nv-support-thread" onClick={openChat}>
            <span className="nv-support-avatar is-small" aria-hidden="true"><AgentIcon /></span>
            <span className="nv-support-thread-text">
              <span className="nv-support-thread-top"><b>Support</b><time>{clock(last.time)}</time></span>
              <span className="nv-support-thread-last">{last.from === 'user' ? 'You: ' : ''}{last.text}</span>
            </span>
            <ChevronRight />
          </button>
        </SupportScroll>
      ) : (
        <>
          <SupportScroll screenKey={screenKey} className="nv-support-empty">
            <span className="nv-support-empty-icon"><ChatIcon /></span>
            <b>No messages</b>
            <p>Your conversations with support will appear here</p>
          </SupportScroll>
          <div className="nv-support-footer">
            <Button block onClick={openChat}>Send us a message</Button>
          </div>
        </>
      )}
    </>
  );
}

// The demo conversation: local only, one fixed automatic reply.
export function SupportChat() {
  const { state, setDraft, send } = useSupport();
  const field = useRef(null);
  const text = state.draft.trim();

  // Grow the field with its content up to the CSS max-height.
  useLayoutEffect(() => {
    const el = field.current;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [state.draft]);

  const submit = (e) => {
    e?.preventDefault();
    if (!text) return;
    send(text);
    field.current.focus();
  };

  return (
    <>
      <SupportHeader back title="Support" subtitle="Demo conversation · automatic replies" titleId="nv-support-title" />
      <SupportScroll screenKey="chat" bottomKey={`${state.messages.length}-${state.pending}`} className="nv-support-chat">
        <div className="nv-support-msg is-support">{chatGreeting}</div>
        {state.messages.map((m) => (
          <div key={m.id} className={`nv-support-msg is-${m.from}`}>
            {m.text}
            <time>{clock(m.time)}</time>
          </div>
        ))}
        {state.pending && (
          <div className="nv-support-msg is-support is-typing" aria-label="Support is typing">
            <span /><span /><span />
          </div>
        )}
      </SupportScroll>
      <form className="nv-support-composer" onSubmit={submit}>
        <textarea
          ref={field}
          rows={1}
          value={state.draft}
          placeholder="Write a message…"
          aria-label="Message"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
          }}
        />
        <button type="submit" className="nv-support-send" aria-label="Send message" disabled={!text}>
          <SendIcon />
        </button>
      </form>
    </>
  );
}
