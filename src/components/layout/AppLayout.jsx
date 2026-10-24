import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useMediaQuery.js';
import AccountDock from './AccountDock.jsx';
import AmbientVideo from './AmbientVideo.jsx';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import Sidebar, { DrawerScrollIndicator } from './Sidebar.jsx';

const closed = { rewards: false, currency: false, notifications: false, profile: false };

// Shared page frame: header, sidebar/drawer, footer and bottom dock. Pages render into <Outlet />.
export default function AppLayout() {
  const { mobile, touch } = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [open, setOpen] = useState(closed);

  const popups = useMemo(() => ({
    ...open,
    set: (name) => (value) => setOpen((s) => ({ ...s, [name]: value })),
  }), [open]);

  // Popups move between the header and the dock, so close them when the layout switches.
  useEffect(() => setOpen(closed), [mobile]);
  useEffect(() => setDrawerOpen(false), [touch]);

  useEffect(() => {
    document.documentElement.classList.toggle('mobile-drawer-open', touch && drawerOpen);
  }, [touch, drawerOpen]);

  useEffect(() => {
    if (!touch || !drawerOpen) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setDrawerOpen(false);
      document.getElementById('menuToggle').focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [touch, drawerOpen]);

  const openSearch = useCallback((value) => {
    setSearchOpen(value);
    if (value && touch) {
      setDrawerOpen(false);
      setOpen((s) => ({ ...s, notifications: false, profile: false }));
    }
  }, [touch]);

  return (
    <>
      <AmbientVideo />
      <Header popups={popups} drawerOpen={touch && drawerOpen} onBurger={() => touch && setDrawerOpen(!drawerOpen)} searchOpen={searchOpen} setSearchOpen={openSearch} />
      <div className="shell" id="top">
        <div className={`mobile-drawer-backdrop${touch && drawerOpen ? ' is-visible' : ''}`} aria-hidden="true" onClick={() => setDrawerOpen(false)} />
        <Sidebar touch={touch} open={drawerOpen} setOpen={setDrawerOpen} />
        <main className="main">
          <Outlet />
        </main>
      </div>
      <Footer />
      <AccountDock mobile={mobile} popups={popups} />
      <DrawerScrollIndicator open={drawerOpen} />
    </>
  );
}
