import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { profileMenu } from '../../data/account.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useDismiss } from '../../hooks/useDismiss.js';
import { asset } from '../../lib/asset.js';
import { MenuIcon } from '../ui/icons.jsx';

// Avatar button with the account menu.
export default function ProfileMenu({ open, setOpen }) {
  const toast = useToast();
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
  const choose = (label) => {
    setOpen(false);
    toggle.current.focus();
    toast(`${label}: coming soon`);
  };

  return (
    <>
      <button ref={toggle} className="profile" id="profileToggle" aria-label="Account menu" aria-haspopup="menu" aria-expanded={open} aria-controls="profileMenu" onClick={() => setOpen(!open)} onKeyDown={onToggleKey}>
        <img src={asset('user-avatar.webp')} alt="User avatar" width="74" height="74" />
      </button>
      <div ref={menu} className="profile-menu" id="profileMenu" role="menu" aria-label="Account" hidden={!open} onKeyDown={onMenuKey}>
        {profileMenu.map((item) => (
          <button key={item.label} type="button" role="menuitem" className="profile-menu-item" data-signout={item.signout ? 'true' : undefined} onClick={() => choose(item.label)}>
            <MenuIcon name={item.icon} /><span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
