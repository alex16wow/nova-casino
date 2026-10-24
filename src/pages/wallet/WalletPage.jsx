import { useCallback, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { SkeletonLine } from '../../components/ui/Skeleton.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { fetchWallet } from '../../lib/api.js';
import BalanceOverview from './BalanceOverview.jsx';
import DepositTab from './DepositTab.jsx';
import TransactionsTab from './TransactionsTab.jsx';
import WithdrawTab from './WithdrawTab.jsx';

const tabs = [
  ['deposit', 'Deposit'],
  ['withdraw', 'Withdraw'],
  ['transactions', 'Transactions'],
];

// Wallet (/account/wallet?tab=deposit|withdraw|transactions): balance overview and the three wallet tabs.
// Balances and history live in PlayerContext, the same source as the header wallet.
export default function WalletPage() {
  const [params, setParams] = useSearchParams();
  const { key } = useLocation();
  const tab = tabs.some(([id]) => id === params.get('tab')) ? params.get('tab') : 'deposit';
  const [status, setStatus] = useState('loading');
  const [empty, setEmpty] = useState(false);

  const load = useCallback(() => {
    setStatus('loading');
    fetchWallet().then((r) => { setEmpty(r.empty); setStatus('ready'); }, () => setStatus('error'));
  }, []);
  useEffect(load, [load]);

  const open = (id) => setParams({ tab: id }, { replace: true });
  const onTabKey = (e) => {
    const i = tabs.findIndex(([id]) => id === tab);
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = tabs[(i + step + tabs.length) % tabs.length][0];
    open(next);
    requestAnimationFrame(() => document.getElementById(`wallet-tab-${next}`)?.focus());
  };

  if (status === 'error') {
    return <StateMessage kind="error" title="Couldn’t Load Your Wallet" text="Connection problem. Check your internet and try again." action="Try again" onAction={load} />;
  }
  if (status === 'loading') return <WalletSkeleton />;

  return (
    <div className="nv-wallet">
      <BalanceOverview />
      <section className="nv-panel nv-wallet-main">
        <div className="nv-wallet-tabs" role="tablist" aria-label="Wallet" onKeyDown={onTabKey}>
          {tabs.map(([id, label]) => (
            <button key={id} id={`wallet-tab-${id}`} type="button" role="tab" aria-selected={tab === id} aria-controls="wallet-panel" tabIndex={tab === id ? 0 : -1} className={`nv-wallet-tab${tab === id ? ' is-current' : ''}`} onClick={() => open(id)}>{label}</button>
          ))}
          <span className="nv-demo-tag">Demo — no real payment</span>
        </div>
        <div id="wallet-panel" role="tabpanel" aria-labelledby={`wallet-tab-${tab}`} className="nv-wallet-panel">
          {tab === 'deposit' && <DepositTab key={key} onHistory={() => open('transactions')} />}
          {tab === 'withdraw' && <WithdrawTab key={key} onHistory={() => open('transactions')} />}
          {tab === 'transactions' && <TransactionsTab empty={empty} onDeposit={() => open('deposit')} />}
        </div>
      </section>
    </div>
  );
}

function WalletSkeleton() {
  return (
    <div className="nv-wallet" aria-busy="true" aria-label="Loading wallet">
      <div className="nv-wallet-stats">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="nv-panel nv-wallet-stat" aria-hidden="true">
            <SkeletonLine width="50%" />
            <SkeletonLine width="70%" className="nv-wallet-skeleton-big" />
            <SkeletonLine width="90%" />
          </div>
        ))}
      </div>
      <section className="nv-panel nv-wallet-main" aria-hidden="true">
        <SkeletonLine width="40%" className="nv-wallet-skeleton-big" />
        {[0, 1, 2, 3].map((i) => <SkeletonLine key={i} width="100%" className="nv-wallet-skeleton-field" />)}
      </section>
    </div>
  );
}
