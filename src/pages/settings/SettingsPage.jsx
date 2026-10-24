import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SkeletonLine } from '../../components/ui/Skeleton.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { fetchSettings } from '../../lib/api.js';
import AccountSettings from './AccountSettings.jsx';
import NotificationSettings from './NotificationSettings.jsx';
import Preferences from './Preferences.jsx';
import ResponsibleGaming from './ResponsibleGaming.jsx';
import Security from './Security.jsx';

// Settings (/account/settings): preferences, notifications, security, responsible gaming and account.
// Values live in SettingsContext; the fake request only drives the loading / error states.
export default function SettingsPage() {
  const [status, setStatus] = useState('loading');
  const load = useCallback(() => {
    setStatus('loading');
    fetchSettings().then(() => setStatus('ready'), () => setStatus('error'));
  }, []);
  useEffect(load, [load]);

  // /account/settings#rg (e.g. from the session reminder) scrolls to that card.
  const { hash } = useLocation();
  useEffect(() => {
    if (status === 'ready' && hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [status, hash]);

  if (status === 'error') {
    return <StateMessage kind="error" title="Couldn’t Load Your Settings" text="Connection problem. Check your internet and try again." action="Try again" onAction={load} />;
  }
  if (status === 'loading') {
    return (
      <div className="nv-settings" aria-busy="true" aria-label="Loading settings">
        {[['prefs', 3], ['notify', 4], ['security wide', 3], ['rg wide', 4], ['account wide', 2]].map(([key, lines]) => (
          <section key={key} className={`nv-panel nv-settings-card${key.includes('wide') ? ' nv-settings-card--wide' : ''}`} aria-hidden="true">
            <SkeletonLine width="35%" />
            {Array.from({ length: lines }, (_, i) => <SkeletonLine key={i} width="100%" className="nv-settings-skeleton" />)}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="nv-settings">
      <Preferences />
      <NotificationSettings />
      <Security />
      <ResponsibleGaming />
      <AccountSettings />
    </div>
  );
}
