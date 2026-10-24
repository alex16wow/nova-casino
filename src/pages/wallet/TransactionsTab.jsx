import { useMemo, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import { SelectField } from '../../components/ui/Field.jsx';
import Modal from '../../components/ui/Modal.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { methodLabel } from '../../data/wallet.js';
import StatusBadge from '../profile/StatusBadge.jsx';
import { CopyButton, money } from './parts.jsx';

const PAGE = 8;
const DAY = 86400000;
const defaults = { type: 'all', status: 'all', period: 'all' };
const typeOptions = [{ value: 'all', label: 'All types' }, { value: 'deposit', label: 'Deposits' }, { value: 'withdrawal', label: 'Withdrawals' }];
const statusOptions = [{ value: 'all', label: 'All statuses' }, { value: 'completed', label: 'Completed' }, { value: 'pending', label: 'Pending' }, { value: 'failed', label: 'Failed' }];
const periodOptions = [{ value: '7', label: 'Last 7 days' }, { value: '30', label: 'Last 30 days' }, { value: '90', label: 'Last 90 days' }, { value: 'all', label: 'All time' }];

export const statusTone = { completed: 'success', pending: 'warning', failed: 'danger' };
export const statusLabel = { completed: 'Completed', pending: 'Pending', failed: 'Failed' };
const typeLabel = { deposit: 'Deposit', withdrawal: 'Withdrawal' };
const shortDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const time = (iso) => new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
const signed = (tx) => `${tx.type === 'deposit' ? '+' : '−'}${money(tx.code, tx.amount)}`;

// History of deposits and withdrawals in all currencies, newest first, with filters, pages and details.
export default function TransactionsTab({ empty, onDeposit }) {
  const { transactions } = usePlayer();
  const [filters, setFilters] = useState(defaults);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);
  const all = empty ? [] : transactions;

  const list = useMemo(() => {
    const since = filters.period === 'all' ? 0 : Date.now() - Number(filters.period) * DAY;
    return all
      .filter((t) => (filters.type === 'all' || t.type === filters.type) && (filters.status === 'all' || t.status === filters.status) && Date.parse(t.date) >= since)
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  }, [all, filters]);

  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const current = Math.min(page, pages);
  const rows = list.slice((current - 1) * PAGE, current * PAGE);
  const filtered = Object.keys(defaults).some((k) => filters[k] !== defaults[k]);
  const set = (key) => (e) => { setFilters((f) => ({ ...f, [key]: e.target.value })); setPage(1); };
  const reset = () => { setFilters(defaults); setPage(1); };

  if (!all.length) {
    return <StateMessage kind="empty" title="No Transactions Yet" text="Your deposits and withdrawals will appear here." action="Make a deposit" onAction={onDeposit} />;
  }

  return (
    <div className="nv-tx">
      <div className="nv-tx-filters">
        <SelectField label="Type" options={typeOptions} value={filters.type} onChange={set('type')} />
        <SelectField label="Status" options={statusOptions} value={filters.status} onChange={set('status')} />
        <SelectField label="Period" options={periodOptions} value={filters.period} onChange={set('period')} />
        <Button variant="secondary" onClick={reset} disabled={!filtered}>Reset filters</Button>
      </div>

      {list.length ? (
        <>
          <p className="nv-tx-count" role="status">{list.length} {list.length === 1 ? 'transaction' : 'transactions'}</p>
          <div className="nv-tx-table" role="table" aria-label="Transactions">
            <div className="nv-tx-row nv-tx-head" role="row">
              {['Date', 'ID', 'Type', 'Method', 'Amount', 'Status'].map((h) => <span key={h} role="columnheader">{h}</span>)}
            </div>
            {rows.map((tx) => (
              <button key={tx.id} type="button" role="row" className={`nv-tx-row is-${tx.type} is-${tx.status}`} onClick={() => setOpen(tx)} aria-label={`${typeLabel[tx.type]} ${signed(tx)}, ${statusLabel[tx.status]}, ${shortDate(tx.date)}. Show details`}>
                <span role="cell" className="nv-tx-date">{shortDate(tx.date)}<small>{time(tx.date)}</small></span>
                <span role="cell" className="nv-tx-id">{tx.id}</span>
                <span role="cell" className="nv-tx-type">{typeLabel[tx.type]}</span>
                <span role="cell" className="nv-tx-method">{methodLabel(tx)}</span>
                <span role="cell" className="nv-tx-amount">{signed(tx)}</span>
                <span role="cell" className="nv-tx-status"><StatusBadge tone={statusTone[tx.status]}>{statusLabel[tx.status]}</StatusBadge></span>
              </button>
            ))}
          </div>
          {pages > 1 && (
            <nav className="nv-pager" aria-label="Pages">
              <Button variant="secondary" size="sm" onClick={() => setPage(current - 1)} disabled={current === 1}>Previous</Button>
              <span>Page {current} of {pages}</span>
              <Button variant="secondary" size="sm" onClick={() => setPage(current + 1)} disabled={current === pages}>Next</Button>
            </nav>
          )}
        </>
      ) : (
        <StateMessage kind="search" title="No Matching Transactions" text="Try another type, status or period." action="Reset filters" onAction={reset} />
      )}

      <TransactionDetails tx={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function TransactionDetails({ tx, onClose }) {
  return (
    <Modal open={Boolean(tx)} onClose={onClose} title={tx ? `${typeLabel[tx.type]} details` : ''} size="sm">
      {tx && (
        <div className="nv-form">
          <div className="nv-tx-detail-top">
            <strong className={`nv-tx-detail-amount is-${tx.type}`}>{signed(tx)}</strong>
            <StatusBadge tone={statusTone[tx.status]}>{statusLabel[tx.status]}</StatusBadge>
          </div>
          <div className="nv-address"><code>{tx.id}</code><CopyButton text={tx.id} label="Copy ID" done="ID copied" /></div>
          <dl className="nv-summary">
            <div><dt>Date</dt><dd>{shortDate(tx.date)}, {time(tx.date)}</dd></div>
            <div><dt>Type</dt><dd>{typeLabel[tx.type]}</dd></div>
            <div><dt>Method</dt><dd>{methodLabel(tx)}</dd></div>
            <div><dt>Amount</dt><dd>{money(tx.code, tx.amount)}</dd></div>
            {tx.type === 'withdrawal' && <div><dt>Fee</dt><dd>{money(tx.code, tx.fee)}</dd></div>}
            {tx.type === 'withdrawal' && <div><dt>You receive</dt><dd>{money(tx.code, Math.max(0, tx.amount - tx.fee))}</dd></div>}
          </dl>
          {tx.status === 'failed' && <p className="nv-form-alert">{tx.failReason ?? 'This operation failed.'} Your balance was not changed.</p>}
          {tx.status === 'pending' && tx.type === 'withdrawal' && <p className="nv-note">This amount is reserved and not available to withdraw until the payout completes.</p>}
          <Button variant="secondary" block onClick={onClose} data-autofocus>Close</Button>
        </div>
      )}
    </Modal>
  );
}
