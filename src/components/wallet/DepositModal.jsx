import { useState } from 'react';
import { formatAmount, usePlayer } from '../../context/PlayerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { depositAddresses, depositMethods, depositRules } from '../../data/wallet.js';
import { makeDeposit } from '../../lib/api.js';
import Button from '../ui/Button.jsx';
import { Checkbox, TextField } from '../ui/Field.jsx';
import Modal from '../ui/Modal.jsx';
import RestrictionNotice from '../account/RestrictionNotice.jsx';
import useDepositGuard from '../../hooks/useDepositGuard.js';

const parseAmount = (v) => Number(String(v).replace(',', '.'));
const digits = (v) => v.replace(/\D/g, '');
const formatCardNumber = (v) => digits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const formatExpiry = (v) => {
  const d = digits(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function validateAmount(value, rules, code) {
  if (value === '') return 'Enter an amount.';
  const n = parseAmount(value);
  if (!Number.isFinite(n) || n <= 0) return 'Enter a valid amount.';
  if (n < rules.min) return `The minimum is ${formatAmount(code, rules.min)} ${code}.`;
  if (n > rules.max) return `The maximum is ${formatAmount(code, rules.max)} ${code}.`;
  return '';
}

function validateCard({ number, expiry, cvc }) {
  const errors = {};
  if (digits(number).length !== 16) errors.number = 'Enter the 16-digit card number.';
  const [mm, yy] = expiry.split('/').map(Number);
  const now = new Date(), year = now.getFullYear() % 100, month = now.getMonth() + 1;
  if (!/^\d{2}\/\d{2}$/.test(expiry) || mm < 1 || mm > 12) errors.expiry = 'Use MM/YY.';
  else if (yy < year || (yy === year && mm < month)) errors.expiry = 'This card has expired.';
  if (!/^\d{3}$/.test(cvc)) errors.cvc = 'Enter the 3 digits on the back.';
  return errors;
}

function OptionList({ legend, name, options, value, onChange }) {
  return (
    <fieldset className="nv-bonus-choice">
      <legend>{legend}</legend>
      {options.map((o) => (
        <label key={o.id} className={`nv-bonus-option${value === o.id ? ' is-selected' : ''}`}>
          <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
          <span className="nv-bonus-radio" aria-hidden="true" />
          <span><strong>{o.title}</strong><small>{o.text}</small></span>
        </label>
      ))}
    </fieldset>
  );
}

function DepositForm({ wallet, initial, onAddress, onDone }) {
  const [code, setCode] = useState(initial.code);
  const rules = depositRules[code];
  const [amount, setAmount] = useState(String(initial.amount ?? rules.presets[1]));
  const [method, setMethod] = useState(initial.method ?? rules.methods[0]);
  const { bonuses, activeMoneyBonus } = usePlayer();
  const [bonus, setBonus] = useState(initial.bonus == null ? true : initial.bonus > 0);
  // The deposit bonus (offers.deposit100) is given once and never next to another active money bonus.
  const bonusOpen = rules.bonusCap && !bonuses.some((b) => b.offerId === 'deposit100');
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' });
  const [touched, setTouched] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  const chooseCurrency = (next) => {
    const r = depositRules[next];
    setCode(next);
    setAmount(String(r.presets[1]));
    setMethod(r.methods[0]);
    setTouched({});
    setServerError('');
  };

  const { limitError } = useDepositGuard();
  const amountError = validateAmount(amount, rules, code) || limitError(code, parseAmount(amount));
  const cardErrors = method === 'card' ? validateCard(card) : {};
  const shown = (key, error) => (touched[key] ? error : '');
  const value = amountError ? 0 : parseAmount(amount);
  const bonusValue = bonusOpen && !activeMoneyBonus && bonus ? Math.min(value, rules.bonusCap) : 0;
  const cardField = (key) => ({
    value: card[key],
    onBlur: () => setTouched((t) => ({ ...t, [key]: true })),
  });

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ amount: true, number: true, expiry: true, cvc: true });
    if (amountError || Object.keys(cardErrors).length) return;
    const order = { code, amount: value, bonus: bonusValue, method };
    if (method === 'crypto') { onAddress(order); return; }
    setBusy(true);
    setServerError('');
    try {
      const { id } = await makeDeposit({ method, card });
      onDone({ ...order, id });
    } catch (err) {
      setServerError(err.message);
      setBusy(false);
    }
  };

  const label = method === 'crypto' ? 'Get deposit address'
    : method === 'card' ? `Deposit ${value ? formatAmount(code, value) : ''} ${code}`
    : `Continue to ${depositMethods[method].title}`;

  return (
    <form className="nv-form" onSubmit={submit} noValidate>
      {serverError && <div className="nv-form-alert" role="alert">{serverError}</div>}

      <div className="nv-field">
        <span className="nv-field-label" id="deposit-currency">Currency</span>
        <div className="nv-chips" role="radiogroup" aria-labelledby="deposit-currency">
          {wallet.map((c) => (
            <button key={c.code} type="button" role="radio" aria-checked={c.code === code} className={`nv-chip${c.code === code ? ' is-selected' : ''}`} onClick={() => chooseCurrency(c.code)}>
              <span className={`currency-dot ${c.dot}`} aria-hidden="true">{c.symbol}</span>{c.code}
            </button>
          ))}
        </div>
        <p className="nv-field-hint">Balance: {wallet.find((c) => c.code === code).balance} {code}</p>
      </div>

      <div className="nv-deposit-amount">
        <TextField
          label="Amount"
          inputMode="decimal"
          autoComplete="off"
          data-autofocus
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ''))}
          onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
          error={shown('amount', amountError)}
          hint={`From ${formatAmount(code, rules.min)} to ${formatAmount(code, rules.max)} ${code}`}
          trailing={<span className="nv-field-suffix">{code}</span>}
        />
        <div className="nv-chips nv-chips--fill">
          {rules.presets.map((p) => (
            <button key={p} type="button" className={`nv-chip${parseAmount(amount) === p ? ' is-selected' : ''}`} onClick={() => { setAmount(String(p)); setTouched((t) => ({ ...t, amount: true })); }}>
              {formatAmount(code, p)}
            </button>
          ))}
        </div>
      </div>

      <OptionList legend="Payment method" name="method" value={method} onChange={(m) => { setMethod(m); setServerError(''); }} options={rules.methods.map((id) => ({ id, ...depositMethods[id] }))} />

      {method === 'card' && (
        <div className="nv-card-fields">
          <TextField label="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" {...cardField('number')} onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))} error={shown('number', cardErrors.number)} />
          <div className="nv-form-row">
            <TextField className="nv-grow" label="Expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" {...cardField('expiry')} onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))} error={shown('expiry', cardErrors.expiry)} />
            <TextField className="nv-grow" label="CVC" inputMode="numeric" autoComplete="cc-csc" placeholder="123" {...cardField('cvc')} onChange={(e) => setCard((c) => ({ ...c, cvc: digits(e.target.value).slice(0, 3) }))} error={shown('cvc', cardErrors.cvc)} />
          </div>
        </div>
      )}

      {bonusOpen && !activeMoneyBonus && (
        <Checkbox checked={bonus} onChange={(e) => setBonus(e.target.checked)} label={<>Get a 100% deposit bonus up to {rules.bonusCap} {code}</>} />
      )}

      <dl className="nv-summary">
        <div><dt>You deposit</dt><dd>{value ? `${formatAmount(code, value)} ${code}` : '—'}</dd></div>
        {bonusValue > 0 && <div><dt>Bonus</dt><dd className="is-accent">+{formatAmount(code, bonusValue)} {code}</dd></div>}
        <div><dt>Fee</dt><dd>Free</dd></div>
      </dl>

      <Button type="submit" size="lg" block loading={busy}>{busy ? 'Processing…' : label}</Button>
    </form>
  );
}

function AddressStep({ order, onBack, onDone }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');
  const address = depositAddresses[order.code];
  const { network } = depositRules[order.code];

  const copy = async () => {
    try { await navigator.clipboard.writeText(address); toast('Address copied'); }
    catch { toast('Copy the address manually'); }
  };
  const confirm = async () => {
    setBusy(true);
    setServerError('');
    try {
      const { id } = await makeDeposit({ method: 'crypto' });
      onDone({ ...order, id });
    } catch (err) {
      setServerError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="nv-form">
      {serverError && <div className="nv-form-alert" role="alert">{serverError}</div>}
      <dl className="nv-summary">
        <div><dt>Send exactly</dt><dd>{formatAmount(order.code, order.amount)} {order.code}</dd></div>
        <div><dt>Network</dt><dd>{network}</dd></div>
      </dl>
      <div className="nv-field">
        <span className="nv-field-label">Deposit address</span>
        <div className="nv-address">
          <code>{address}</code>
          <Button variant="secondary" size="sm" onClick={copy} data-autofocus>Copy</Button>
        </div>
      </div>
      <p className="nv-note">Send only {order.code} on the {network} network. Other coins or networks can’t be recovered.</p>
      <div className="nv-form-row">
        <Button variant="secondary" size="lg" onClick={onBack} disabled={busy}>Back</Button>
        <Button size="lg" className="nv-grow" loading={busy} onClick={confirm}>{busy ? 'Checking payment…' : 'I’ve sent it'}</Button>
      </div>
    </div>
  );
}

function DoneStep({ result, balance, onClose }) {
  return (
    <div className="nv-form nv-form--done">
      <span className="nv-done-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
      </span>
      <p><b>{formatAmount(result.code, result.amount)} {result.code}</b> has been added to your balance.{result.bonus > 0 && <> Your bonus of {formatAmount(result.code, result.bonus)} {result.code} is in Bonuses.</>}</p>
      <dl className="nv-summary">
        <div><dt>New balance</dt><dd>{balance} {result.code}</dd></div>
        <div><dt>Transaction</dt><dd>{result.id}</dd></div>
      </dl>
      <Button size="lg" block onClick={onClose} data-autofocus>Start playing</Button>
    </div>
  );
}

const titles = {
  form: ['Deposit', 'Add funds to your wallet.'],
  address: ['Send your deposit', 'Use the address below in your wallet or exchange.'],
  done: ['Deposit successful', null],
};

// Wallet top-up: currency, amount and method, then a crypto address or card payment, then a receipt.
export default function DepositModal() {
  const { depositOpen, closeDeposit, currencies, currency, deposit, setCurrencyCode, activateDepositBonus } = usePlayer();
  const [step, setStep] = useState({ view: 'form' });
  const [session, setSession] = useState(0);
  const { restriction } = useDepositGuard();

  const close = () => {
    closeDeposit();
    setStep({ view: 'form' });
    setSession((n) => n + 1);
  };
  const done = (result) => {
    deposit(result.code, result.amount, { id: result.id, method: result.method, network: result.method === 'crypto' ? depositRules[result.code].network : null });
    const bonus = result.bonus > 0 ? activateDepositBonus(result.code, result.amount) : null;
    setCurrencyCode(result.code);
    setStep({ view: 'done', result: { ...result, bonus: bonus?.ok ? bonus.bonus.amount : 0 } });
  };

  const [title, subtitle] = titles[step.view];
  return (
    <Modal open={depositOpen} onClose={close} title={title} subtitle={subtitle} focusKey={step.view}>
      {restriction && step.view !== 'done' && <RestrictionNotice restriction={restriction} what="Deposits are" />}
      {!restriction && step.view === 'form' && <DepositForm key={session} wallet={currencies} initial={step.order ?? { code: currency.code }} onAddress={(order) => setStep({ view: 'address', order })} onDone={done} />}
      {!restriction && step.view === 'address' && <AddressStep order={step.order} onBack={() => setStep({ view: 'form', order: step.order })} onDone={done} />}
      {step.view === 'done' && <DoneStep result={step.result} balance={currencies.find((c) => c.code === step.result.code).balance} onClose={close} />}
    </Modal>
  );
}
