import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import StateMessage from '../ui/StateMessage.jsx';
import { MenuIcon } from '../ui/icons.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { accountSections } from '../../data/account.js';

// Frame for account pages (/account/*): page title and the section tabs. Pages render into <Outlet />.
// Guests get a log-in prompt instead of the page.
export default function AccountLayout() {
  const { pathname } = useLocation();
  const { isGuest, openAuth } = useAuth();
  const current = accountSections.find((s) => s.to === pathname) ?? accountSections[0];

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="nv-account">
      <div className="section-head nv-account-head">
        <h1 className="section-title-with-icon">
          <span className="section-title-icon nv-title-glyph" aria-hidden="true"><MenuIcon name={current.icon} /></span>
          <span>{current.label}</span>
        </h1>
      </div>
      <AccountNav current={current.id} />
      {isGuest ? (
        <StateMessage
          kind="lock"
          title="Log In to See Your Account"
          text="Your profile, wallet and bonuses are available once you log in."
          action="Log In"
          onAction={() => openAuth('login')}
        />
      ) : (
        <Outlet />
      )}
    </div>
  );
}

// Section tabs. Sections without a page yet say so instead of navigating.
export function AccountNav({ current }) {
  const toast = useToast();
  return (
    <nav className="nv-account-nav" aria-label="Account sections">
      {accountSections.map((s) => {
        const inner = <><MenuIcon name={s.icon} /><span>{s.label}</span></>;
        const active = s.id === current;
        return s.live ? (
          <Link key={s.id} to={s.to} className={`nv-account-tab${active ? ' is-current' : ''}`} aria-current={active ? 'page' : undefined}>{inner}</Link>
        ) : (
          <button key={s.id} type="button" className="nv-account-tab" onClick={() => toast(`${s.label}: coming soon`)}>{inner}</button>
        );
      })}
    </nav>
  );
}
