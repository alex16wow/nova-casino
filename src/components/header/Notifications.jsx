import { useLayoutEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useDismiss } from '../../hooks/useDismiss.js';
import StateMessage from '../ui/StateMessage.jsx';
import { Bell, MenuIcon } from '../ui/icons.jsx';

// Bell button with the unread badge and the notifications popup.
export default function Notifications({ open, setOpen }) {
  const { notifications, markRead } = usePlayer();
  const toggle = useRef(null), panel = useRef(null), markAll = useRef(null);
  const unread = notifications.filter((n) => n.unread).length;

  useDismiss(open, () => setOpen(false), [toggle, panel], { onEscape: () => toggle.current?.focus() });

  // Keep the panel inside the header's right edge.
  useLayoutEffect(() => {
    if (!open) return;
    const position = () => {
      const parent = toggle.current.parentElement.getBoundingClientRect(), anchor = toggle.current.getBoundingClientRect();
      panel.current.style.right = Math.max(0, Math.min(parent.right - anchor.right, parent.right - panel.current.offsetWidth - 12)) + 'px';
    };
    position();
    window.addEventListener('resize', position);
    return () => window.removeEventListener('resize', position);
  }, [open]);

  const onToggleKey = (e) => {
    if (e.key !== 'ArrowDown') return;
    e.preventDefault();
    flushSync(() => setOpen(true));
    (markAll.current.disabled ? panel.current.querySelector('.notification-item') : markAll.current)?.focus();
  };

  return (
    <>
      <button
        ref={toggle}
        className="icon-button"
        id="notificationsToggle"
        aria-label={unread ? `Notifications: ${unread} unread` : 'Notifications'}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="notificationsPanel"
        onClick={() => setOpen(!open)}
        onKeyDown={onToggleKey}
      >
        <Bell />
        <span className="count-badge" aria-hidden="true" hidden={!unread} style={unread ? undefined : { display: 'none' }}>{unread}</span>
      </button>
      <section ref={panel} className="notifications-panel" id="notificationsPanel" role="dialog" aria-labelledby="notificationsHeading" hidden={!open}>
        <div className="notifications-heading">
          <div>
            <h2 id="notificationsHeading">Notifications</h2>
            <span className="notifications-status" id="notificationsStatus">{unread ? `${unread} unread` : 'You’re all caught up'}</span>
          </div>
          <button ref={markAll} type="button" className="notifications-mark-all" disabled={!unread} onClick={() => markRead(null)}>Mark all as read</button>
        </div>
        <div className="notifications-list">
          {!notifications.length && <StateMessage compact kind="empty" title="No notifications yet" text="News about rewards and tournaments will show up here." role="status" />}
          {notifications.map((n) => (
            <button key={n.id} type="button" className={`notification-item${n.unread ? ' is-unread' : ''}`} aria-label={n.unread ? `${n.title}. Unread` : n.title} onClick={() => markRead(n.id)}>
              <span className="notification-icon"><MenuIcon name={n.icon} /></span>
              <span className="notification-copy"><strong>{n.title}</strong><span>{n.text}</span><time>{n.time}</time></span>
              <span className="notification-unread-dot" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
