import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { mobileNav } from '../../data/navigation.js';
import CurrencySelect from '../header/CurrencySelect.jsx';
import DepositButton from '../header/DepositButton.jsx';
import PlayerLevel from '../header/PlayerLevel.jsx';
import { NavIcon } from '../ui/icons.jsx';

// Fixed bottom bar: section links on tablets, level + wallet on phones. Not shown to guests on phones.
export default function AccountDock({ mobile, popups }) {
  const dock = useRef(null);

  // Firefox browser chrome changes the visible viewport without reliably moving bottom:0.
  useEffect(() => {
    const el = dock.current, viewport = window.visualViewport;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!mobile || !viewport) { el.classList.remove('visual-viewport-dock'); el.style.removeProperty('--dock-visible-top'); return; }
      el.style.setProperty('--dock-visible-top', Math.max(0, viewport.offsetTop + viewport.height - 73) + 'px');
      el.classList.add('visual-viewport-dock');
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    viewport?.addEventListener('resize', schedule, { passive: true });
    viewport?.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('pageshow', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener('resize', schedule);
      viewport?.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
    };
  }, [mobile]);

  return (
    <nav ref={dock} className={`mobile-nav${mobile ? ' account-dock' : ''}`} aria-label={mobile ? 'Wallet and account' : 'Mobile navigation'}>
      {mobile ? (
        <>
          <PlayerLevel />
          <CurrencySelect open={popups.currency} setOpen={popups.set('currency')}>
            <DepositButton compact />
          </CurrencySelect>
        </>
      ) : (
        mobileNav.map((link) => (link.to
          ? <Link key={link.label} to={link.to}><NavIcon name={link.icon} />{link.label}</Link>
          : <a key={link.label} href={link.href}><NavIcon name={link.icon} />{link.label}</a>))
      )}
    </nav>
  );
}
