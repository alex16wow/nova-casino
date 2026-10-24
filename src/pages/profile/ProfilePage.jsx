import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SkeletonLine } from '../../components/ui/Skeleton.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { fetchProfile } from '../../lib/api.js';
import LevelCard from './LevelCard.jsx';
import PersonalInfo from './PersonalInfo.jsx';
import PlayerCard from './PlayerCard.jsx';
import Verification from './Verification.jsx';

// My profile (/account/profile): player card, level, verification and personal information.
// Data lives in ProfileContext; the fake request only drives the loading / error states.
export default function ProfilePage() {
  const [status, setStatus] = useState('loading');
  const load = useCallback(() => {
    setStatus('loading');
    fetchProfile().then(() => setStatus('ready'), () => setStatus('error'));
  }, []);
  useEffect(load, [load]);

  // /account/profile#verification (e.g. from Wallet → Withdraw) scrolls to the Verification block.
  const { hash } = useLocation();
  useEffect(() => {
    if (status !== 'ready' || !hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [status, hash]);

  if (status === 'error') {
    return <StateMessage kind="error" title="Couldn’t Load Your Profile" text="Connection problem. Check your internet and try again." action="Try again" onAction={load} />;
  }
  if (status === 'loading') return <ProfileSkeleton />;

  return (
    <div className="nv-profile">
      <PlayerCard />
      <LevelCard />
      <Verification />
      <PersonalInfo />
    </div>
  );
}

function ProfileSkeleton() {
  const card = (lines, area) => (
    <section className={`nv-panel nv-profile-${area}`} aria-hidden="true">
      {lines.map((w, i) => <SkeletonLine key={i} width={w} className="nv-profile-skeleton-line" />)}
    </section>
  );
  return (
    <div className="nv-profile" aria-busy="true" aria-label="Loading profile">
      {card(['40%', '70%', '55%', '60%'], 'card')}
      {card(['35%', '100%', '65%'], 'level')}
      {card(['45%', '80%'], 'verify')}
      {card(['30%', '100%', '100%', '100%', '100%', '100%'], 'info')}
    </div>
  );
}
