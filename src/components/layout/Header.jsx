import { useLayoutEffect, useRef } from 'react';
import { useBreakpoint } from '../../hooks/useMediaQuery.js';
import { asset } from '../../lib/asset.js';
import CurrencySelect from '../header/CurrencySelect.jsx';
import DepositButton from '../header/DepositButton.jsx';
import HeaderSearch from '../header/HeaderSearch.jsx';
import Notifications from '../header/Notifications.jsx';
import PlayerLevel from '../header/PlayerLevel.jsx';
import ProfileMenu from '../header/ProfileMenu.jsx';
import { Burger } from '../ui/icons.jsx';

export function Brand() {
  return (
    <a className="brand" href="#top" aria-label="NOVA Casino home">
      <img className="brand-image" src={asset('nova-casino-logo.png')} alt="NOVA Casino" width="323" height="120" />
    </a>
  );
}

// Top bar. On mobile the level and wallet move to the bottom dock (see AccountDock).
export default function Header({ popups, drawerOpen, onBurger, searchOpen, setSearchOpen }) {
  const { mobile, tablet, touch } = useBreakpoint();
  const header = useRef(null), burger = useRef(null), slot = useRef(null), search = useRef(null);

  // On tablets the expanded search grows left up to the level block or the burger.
  useLayoutEffect(() => {
    const wrap = search.current;
    if (!tablet) { wrap.style.removeProperty('--tablet-search-expanded-width'); return; }
    const update = () => {
      const level = header.current.querySelector('.player-level');
      const end = slot.current.getBoundingClientRect().right, box = level.getBoundingClientRect();
      const start = innerWidth < 960 ? burger.current.getBoundingClientRect().left : innerWidth < 1160 ? box.left : box.right + 12;
      wrap.style.setProperty('--tablet-search-expanded-width', Math.max(slot.current.clientWidth, end - start) + 'px');
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header.current);
    window.addEventListener('resize', update);
    return () => { observer.disconnect(); window.removeEventListener('resize', update); };
  }, [tablet, searchOpen]);

  return (
    <header ref={header} className={`topbar${touch && searchOpen ? ' is-mobile-search-open' : ''}`}>
      <button ref={burger} className="icon-button mobile-menu" id="menuToggle" aria-label={drawerOpen ? 'Close menu' : 'Open menu'} aria-expanded={drawerOpen} aria-controls="sidebar" onClick={onBurger}>
        <span className="burger-line" /><span className="burger-line" /><span className="burger-line" />
        <Burger />
      </button>
      <Brand />
      {!mobile && <PlayerLevel open={popups.rewards} setOpen={popups.set('rewards')} />}
      <div className="top-actions">
        <HeaderSearch open={searchOpen} setOpen={setSearchOpen} wrapRef={search} slotRef={slot} closeOnOutsideClick={touch} />
        {!mobile && (
          <CurrencySelect open={popups.currency} setOpen={popups.set('currency')}>
            {tablet && <DepositButton compact />}
          </CurrencySelect>
        )}
        {!touch && <DepositButton />}
        <Notifications open={popups.notifications} setOpen={popups.set('notifications')} />
        <ProfileMenu open={popups.profile} setOpen={popups.set('profile')} />
      </div>
    </header>
  );
}
