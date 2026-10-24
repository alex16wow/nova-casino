import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { profileMenu } from '../../data/account.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDismiss } from '../../hooks/useDismiss.js';
import Avatar from '../ui/Avatar.jsx';
import { MenuIcon } from '../ui/icons.jsx';

// Avatar button with the account menu.
export default function ProfileMenu({ open, setOpen }) {
  const toast = useToast();
  const { openAuth } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const toggle = useRef(null), menu = useRef(null);
  const items = () => [...menu.current.querySelectorAll('[role="menuitem"]')];

  useDismiss(open, () => setOpen(false), [toggle, menu], { onEscape: () => toggle.current?.focus() });

  const onToggleKey = (e) => {
    if (e.key !== 'ArrowDown') return;
    e.preventDefault();
    flushSync(() => setOpen(true));
    items()[0]?.focus();
  };
  const onMenuKey = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const list = items(), i = list.indexOf(document.activeElement);
    list[(i + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length].focus();
  };
  const choose = (item) => {
    setOpen(false);
    toggle.current.focus();
    if (item.signout) openAuth('logout');
    else if (item.live) navigate(item.to);
    else toast(`${item.label}: coming soon`);
  };

  return (
    <>
      <button ref={toggle} className="profile" id="profileToggle" aria-label="Account menu" aria-haspopup="menu" aria-expanded={open} aria-controls="profileMenu" onClick={() => setOpen(!open)} onKeyDown={onToggleKey}>
        <Avatar profile={profile} />
      </button>
      <div ref={menu} className="profile-menu" id="profileMenu" role="menu" aria-label="Account" hidden={!open} onKeyDown={onMenuKey}>
        {profileMenu.map((item) => (
          <button key={item.label} type="button" role="menuitem" className="profile-menu-item" data-signout={item.signout ? 'true' : undefined} onClick={() => choose(item)}>
            <MenuIcon name={item.icon} /><span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
