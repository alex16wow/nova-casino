import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { SkeletonLine } from '../../components/ui/Skeleton.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { MenuIcon } from '../../components/ui/icons.jsx';
import { formatAmount, usePlayer } from '../../context/PlayerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { findGame, gameSlug } from '../../data/games.js';
import { offerExpiry, offers } from '../../data/bonuses.js';
import { asset } from '../../lib/asset.js';
import { fetchBonuses } from '../../lib/api.js';
import StatusBadge from '../profile/StatusBadge.jsx';
import ActiveBonus from './ActiveBonus.jsx';
import { BonusDetails, CancelBonus, EligibleGames, OneActive } from './BonusModals.jsx';
import PromoCode from './PromoCode.jsx';
import { keyTerms, shortDate, statusInfo, valueOf } from './terms.js';

const DAY = 86400000;
const tabs = [['available', 'Available'], ['active', 'Active'], ['history', 'History']];

// Bonuses (/account/bonuses?tab=available|active|history): the player's own offers, active bonuses and history.
// Promotions stays the public catalogue. All data comes from PlayerContext (shared with the header and Wallet).
export default function BonusesPage() {
  const player = usePlayer();
  const { bonuses, rewards, bonusSince, currency, activeMoneyBonus, claimOffer, cancelBonus } = player;
  const toast = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = tabs.some(([id]) => id === params.get('tab')) ? params.get('tab') : 'available';
  const [status, setStatus] = useState('loading');
  const [empty, setEmpty] = useState(false);
  const [details, setDetails] = useState(null);
  const [games, setGames] = useState(false);
  const [cancel, setCancel] = useState(null);
  const [conflict, setConflict] = useState(null);

  const load = useCallback(() => {
    setStatus('loading');
    fetchBonuses().then((r) => { setEmpty(r.empty); setStatus('ready'); }, () => setStatus('error'));
  }, []);
  useEffect(load, [load]);

  const open = (id) => setParams({ tab: id }, { replace: true });

  if (status === 'error') return <StateMessage kind="error" title="Couldn’t Load Your Bonuses" text="Connection problem. Check your internet and try again." action="Try again" onAction={load} />;
  if (status === 'loading') return <BonusesSkeleton />;

  const all = empty ? [] : bonuses;
  const active = all.filter((b) => b.status === 'active');
  const featured = active.find((b) => b.kind === 'money') ?? active[0] ?? null;
  const history = [...all].sort((a, b) => Date.parse(b.claimedAt) - Date.parse(a.claimedAt));
  // Available: unclaimed level rewards, the deposit offer until used, and upcoming offers.
  const since = Date.parse(bonusSince);
  const available = empty ? [] : Object.values(offers).filter((o) => (o.rewardId
    ? rewards.some((r) => r.id === o.rewardId && !r.claimed)
    : !bonuses.some((b) => b.offerId === o.id)));

  const claim = (offer) => {
    const result = claimOffer(offer.id);
    if (result.ok) { toast(`${offer.title} claimed`); setDetails(null); return; }
    if (result.reason === 'one-active') { setDetails(null); setConflict({ offer, active: result.active }); return; }
    toast('This reward has already been claimed');
  };
  const toDeposit = (offer) => {
    setDetails(null);
    if (activeMoneyBonus) { setConflict({ offer, active: activeMoneyBonus }); return; }
    navigate(`/account/wallet?tab=deposit&bonus=${offer.id}`);
  };
  const ctaFor = (o) => (o.cta === 'claim' ? <Button onClick={() => claim(o)}>Claim</Button>
    : o.cta === 'deposit' ? <Button onClick={() => toDeposit(o)}>Deposit to activate</Button>
    : null);
  const realBalance = cancel ? player.currencies.find((c) => c.code === cancel.code) : currency;

  return (
    <div className="nv-bonuses">
      <div className="nv-bonuses-top">
        <ActiveBonus bonus={featured} onTerms={setDetails} onGames={() => setGames(true)} onCancel={setCancel} onBrowse={() => open('available')} />
        <PromoCode onApplied={() => open('active')} />
      </div>

      <section className="nv-panel nv-bonuses-main">
        <div className="nv-wallet-tabs" role="tablist" aria-label="Bonuses">
          {tabs.map(([id, label]) => {
            const count = { available: available.length, active: active.length, history: history.length }[id];
            return (
              <button key={id} type="button" role="tab" aria-selected={tab === id} aria-controls="bonuses-panel" className={`nv-wallet-tab${tab === id ? ' is-current' : ''}`} onClick={() => open(id)}>
                {label}<span className="nv-tab-count">{count}</span>
              </button>
            );
          })}
        </div>
        <div id="bonuses-panel" role="tabpanel" className="nv-wallet-panel">
          {tab === 'available' && (available.length ? (
            <div className="nv-offer-grid">
              {available.map((o) => <OfferCard key={o.id} offer={o} until={offerExpiry(o, since)} cta={ctaFor(o)} onDetails={() => setDetails(o)} />)}
            </div>
          ) : (
            <StateMessage kind="empty" title="No Offers Right Now" text="New rewards appear as you level up. Check back soon or enter a promo code." />
          ))}
          {tab === 'active' && (active.length ? (
            <div className="nv-bonus-list">
              {active.map((b) => <BonusRow key={b.id} bonus={b} onOpen={() => setDetails(b)} />)}
            </div>
          ) : (
            <StateMessage kind="empty" title="No Active Bonuses" text="Claim a reward or activate an offer to see it here." action="Browse available" onAction={() => open('available')} />
          ))}
          {tab === 'history' && (history.length ? (
            <div className="nv-bonus-list">
              {history.map((b) => <BonusRow key={b.id} bonus={b} history onOpen={() => setDetails(b)} />)}
            </div>
          ) : (
            <StateMessage kind="empty" title="No Bonus History" text="Bonuses you receive, finish, cancel or let expire will be listed here." />
          ))}
        </div>
      </section>

      <BonusDetails
        item={details}
        onClose={() => setDetails(null)}
        action={details && !details.status ? ctaFor(details) : details?.status === 'active' ? <Button variant="ghost" className="nv-btn--danger-text" onClick={() => { setCancel(details); setDetails(null); }}>Cancel bonus</Button> : null}
      />
      <EligibleGames open={games} onClose={() => setGames(false)} />
      <CancelBonus bonus={cancel} realBalance={realBalance} onKeep={() => setCancel(null)} onConfirm={() => { cancelBonus(cancel.id); toast(`${cancel.title} cancelled`); setCancel(null); }} />
      <OneActive info={conflict} onClose={() => setConflict(null)} onShowActive={() => { setConflict(null); open('active'); }} />
    </div>
  );
}

function OfferCard({ offer, until, cta, onDetails }) {
  const game = offer.game && findGame(gameSlug(offer.game));
  const image = offer.image ?? game?.image;
  const upcoming = offer.cta === 'details';
  return (
    <article className={`nv-offer${upcoming ? ' is-upcoming' : ''}`}>
      <div className="nv-offer-art">
        {image ? <img src={asset(image)} alt="" className={game ? 'is-game' : ''} /> : <MenuIcon name="gift" />}
        <span className="nv-offer-type">{offer.type}</span>
      </div>
      <div className="nv-offer-body">
        <h3>{offer.title}</h3>
        <strong className="nv-offer-value">{valueOf(offer)}</strong>
        <p>{offer.short}</p>
        <ul className="nv-offer-terms">{keyTerms(offer).map((t) => <li key={t}>{t}</li>)}</ul>
        <p className="nv-offer-until">{upcoming ? `Opens ${shortDate(new Date(Date.now() + offer.opensInDays * DAY).toISOString())}` : `Available until ${shortDate(until)}`}</p>
      </div>
      <div className="nv-offer-actions">
        {cta}
        <Button variant={upcoming ? 'primary' : 'ghost'} onClick={onDetails}>View details</Button>
      </div>
    </article>
  );
}

function BonusRow({ bonus, history, onOpen }) {
  const [label, tone] = statusInfo[bonus.status];
  const date = history ? (bonus.finishedAt ? `Ended ${shortDate(bonus.finishedAt)}` : `Claimed ${shortDate(bonus.claimedAt)}`) : `Expires ${shortDate(bonus.expiresAt)}`;
  const progress = bonus.kind === 'money' && bonus.status === 'active' ? ` · ${Math.round((bonus.wagered / (bonus.amount * bonus.wager)) * 100)}% wagered` : '';
  return (
    <button type="button" className="nv-bonus-row" onClick={onOpen} aria-label={`${bonus.title}, ${label}. Show details`}>
      <span className="nv-bonus-row-icon" aria-hidden="true"><MenuIcon name="gift" /></span>
      <span className="nv-bonus-row-main"><strong>{bonus.title}</strong><small>{bonus.type} · {date}{progress}</small></span>
      <span className="nv-bonus-row-value">{bonus.kind === 'money' ? `${formatAmount(bonus.code, bonus.amount)} ${bonus.code}` : `${bonus.spins} spins`}</span>
      <StatusBadge tone={tone}>{label}</StatusBadge>
    </button>
  );
}

function BonusesSkeleton() {
  return (
    <div className="nv-bonuses" aria-busy="true" aria-label="Loading bonuses">
      <div className="nv-bonuses-top">
        <section className="nv-panel nv-active-bonus" aria-hidden="true">
          {['30%', '55%', '100%', '80%'].map((w, i) => <SkeletonLine key={i} width={w} className="nv-wallet-skeleton-field" />)}
        </section>
        <section className="nv-panel nv-promo" aria-hidden="true"><SkeletonLine width="50%" /><SkeletonLine width="100%" className="nv-wallet-skeleton-field" /></section>
      </div>
      <section className="nv-panel" aria-hidden="true">
        {[0, 1, 2].map((i) => <SkeletonLine key={i} width="100%" className="nv-wallet-skeleton-field" />)}
      </section>
    </div>
  );
}
