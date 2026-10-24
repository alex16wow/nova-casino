import { formatAmount, usePlayer } from '../../context/PlayerContext.jsx';

// Balances of the selected currency (same selection as the header wallet).
// Available to withdraw = Real balance − Pending withdrawals. Bonus funds are never withdrawable.
export default function BalanceOverview() {
  const { currencies, currency, setCurrencyCode } = usePlayer();
  const fmt = (n) => `${formatAmount(currency.code, n)} ${currency.code}`;
  const stats = [
    ['real', 'Real balance', fmt(currency.amount), 'Your deposits and winnings. This is the balance in the header.'],
    ['bonus', 'Bonus balance', fmt(currency.bonus), 'Bonus funds for play. They can’t be withdrawn until wagering is complete.'],
    ['available', 'Available to withdraw', fmt(currency.available), 'Real balance minus pending withdrawals.'],
    ['pending', 'Pending withdrawals', fmt(currency.pending), 'Reserved for payouts in progress.'],
  ];

  return (
    <section className="nv-wallet-overview" aria-labelledby="walletOverviewTitle">
      <div className="nv-wallet-overview-head">
        <h2 id="walletOverviewTitle">Balance</h2>
        <div className="nv-wallet-currencies" role="radiogroup" aria-label="Currency">
          {currencies.map((c) => (
            <button key={c.code} type="button" role="radio" aria-checked={c.code === currency.code} className={`nv-chip${c.code === currency.code ? ' is-selected' : ''}`} onClick={() => setCurrencyCode(c.code)}>
              <span className={`currency-dot ${c.dot}`} aria-hidden="true">{c.symbol}</span>{c.code}
            </button>
          ))}
        </div>
      </div>
      <div className="nv-wallet-stats">
        {stats.map(([id, label, value, hint]) => (
          <div key={id} className={`nv-panel nv-wallet-stat is-${id}`}>
            <span className="nv-wallet-stat-label">{label}</span>
            <strong className="nv-wallet-stat-value">{value}</strong>
            <p>{hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
