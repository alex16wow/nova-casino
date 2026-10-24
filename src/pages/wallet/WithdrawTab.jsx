import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { TextField } from '../../components/ui/Field.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';
import { cryptoNetworks, withdrawMethods, withdrawRules } from '../../data/wallet.js';
import { processWithdrawal } from '../../lib/api.js';
import { AmountField, ChipChoice, OptionCards, ResultScreen, money, parseAmount } from './parts.jsx';

const round = (n) => Math.round(n * 1e8) / 1e8;
const compact = (v) => v.replace(/\s+/g, '').toUpperCase();
const mask = (v) => (v.length > 12 ? `${v.slice(0, 6)}…${v.slice(-4)}` : v);

const terms = (code, method, network) => (method === 'bank'
  ? withdrawRules[code].bank
  : cryptoNetworks[code].find((n) => n.id === network));

function validate(v, c, rules, term) {
  const e = {};
  const n = parseAmount(v.amount);
  if (v.amount === '') e.amount = 'Enter an amount';
  else if (!Number.isFinite(n) || n <= 0) e.amount = 'Enter a valid amount';
  else if (n > c.available) e.amount = `Not enough funds. Available: ${money(c.code, c.available)}`;
  else if (n < rules.min) e.amount = `The minimum is ${money(c.code, rules.min)}`;
  else if (n <= term.fee) e.amount = `The amount must be more than the ${money(c.code, term.fee)} fee`;
  if (v.method === 'crypto') {
    const a = v.address.trim();
    if (!a) e.address = 'Enter your wallet address';
    else if (!/^[A-Za-z0-9]{26,64}$/.test(a)) e.address = 'This doesn’t look like a wallet address (26–64 letters and numbers)';
  } else {
    if (!v.holder.trim()) e.holder = 'Enter the account holder’s name';
    else if (!/^[\p{L}][\p{L} .'-]{1,59}$/u.test(v.holder.trim())) e.holder = 'Use letters, spaces, hyphens or apostrophes';
    const iban = compact(v.iban);
    if (!iban) e.iban = 'Enter your IBAN';
    else if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) e.iban = 'Enter a valid IBAN, e.g. DE89 3704 0044 0532 0130 00';
  }
  return e;
}

// Withdraw: verified players only. Form → review → processing → pending request (amount reserved) or error.
export default function WithdrawTab({ onHistory }) {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { currencies, currency, setCurrencyCode, requestWithdrawal, recordFailure } = usePlayer();
  const [values, setValues] = useState(() => ({
    method: withdrawRules[currency.code].methods[0],
    network: cryptoNetworks[currency.code]?.[0].id,
    amount: '', address: '', holder: '', iban: '',
  }));
  const [errors, setErrors] = useState({});
  const [tried, setTried] = useState(false);
  // step: form | review | done | error
  const [step, setStep] = useState('form');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const attempt = useRef(null);

  // The currency can also change from the overview or the header: keep the method and network valid for it.
  useEffect(() => {
    setValues((v) => (withdrawRules[currency.code].methods.includes(v.method) && (v.method !== 'crypto' || cryptoNetworks[currency.code].some((x) => x.id === v.network))
      ? v
      : { ...v, method: withdrawRules[currency.code].methods[0], network: cryptoNetworks[currency.code]?.[0].id, amount: '' }));
    setErrors({});
    setTried(false);
  }, [currency.code]);

  if (profile.verification !== 'verified') {
    const pending = profile.verification === 'pending';
    return (
      <StateMessage
        kind="lock"
        title={pending ? 'Verification in Progress' : 'Verify Your Identity to Withdraw'}
        text={pending
          ? 'We’re reviewing your document. Withdrawals open as soon as your identity is confirmed, usually within 24 hours.'
          : 'For your security, withdrawals are available after identity verification. It takes about 2 minutes.'}
        action="Go to Verification"
        onAction={() => navigate('/account/profile#verification')}
      />
    );
  }

  const c = currency;
  const rules = withdrawRules[c.code];
  const term = terms(c.code, values.method, values.network);
  const n = parseAmount(values.amount);
  const amountOk = Number.isFinite(n) && n > 0;
  const receive = amountOk ? Math.max(0, round(n - term.fee)) : 0;

  const update = (patch) => {
    const next = { ...values, ...patch };
    setValues(next);
    if (tried) setErrors(validate(next, c, rules, terms(c.code, next.method, next.network)));
  };
  const set = (key) => (e) => update({ [key]: e.target.value });
  const chooseCode = (code) => setCurrencyCode(code);

  const review = (e) => {
    e.preventDefault();
    setTried(true);
    const found = validate(values, c, rules, term);
    setErrors(found);
    if (Object.keys(found).length) { e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus(); return; }
    attempt.current = null;
    setStep('review');
  };

  const confirm = async () => {
    if (busy) return;
    setBusy(true);
    const order = { code: c.code, amount: n, fee: term.fee, method: values.method, network: values.method === 'crypto' ? values.network : null };
    try {
      await processWithdrawal();
      attempt.current ??= `WD-${Date.now().toString(36).toUpperCase().slice(-8)}`;
      requestWithdrawal({ id: attempt.current, ...order });
      setResult({ ...order, id: attempt.current, receive, time: term.time });
      setStep('done');
    } catch (err) {
      const id = recordFailure({ type: 'withdrawal', ...order, failReason: err.message });
      setResult({ ...order, id, message: err.message });
      setStep('error');
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    setValues((v) => ({ ...v, amount: '' }));
    setErrors({}); setTried(false); setResult(null); attempt.current = null;
    setStep('form');
  };

  const recipient = values.method === 'crypto' ? mask(values.address.trim()) : `${values.holder.trim()} · ${mask(compact(values.iban))}`;

  if (step === 'done') {
    return (
      <ResultScreen title="Withdrawal requested" actions={<><Button variant="secondary" onClick={onHistory}>View transactions</Button><Button onClick={restart}>New withdrawal</Button></>}>
        <p><b>{money(result.code, result.amount)}</b> is reserved for this payout and no longer available to withdraw.</p>
        <dl className="nv-summary">
          <div><dt>You receive</dt><dd>{money(result.code, result.receive)}</dd></div>
          <div><dt>Estimated time</dt><dd>{result.time}</dd></div>
          <div><dt>Available to withdraw</dt><dd>{money(c.code, c.available)}</dd></div>
          <div><dt>Transaction ID</dt><dd>{result.id}</dd></div>
          <div><dt>Status</dt><dd className="is-warning">Pending</dd></div>
        </dl>
      </ResultScreen>
    );
  }

  if (step === 'error') {
    return (
      <ResultScreen kind="error" title="Withdrawal failed" actions={<><Button variant="secondary" onClick={() => setStep('form')}>Change details</Button><Button onClick={() => setStep('review')}>Try again</Button></>}>
        <p>{result.message}</p>
        <dl className="nv-summary">
          <div><dt>Amount</dt><dd>{money(result.code, result.amount)}</dd></div>
          <div><dt>Transaction ID</dt><dd>{result.id}</dd></div>
          <div><dt>Balance</dt><dd>Not changed</dd></div>
        </dl>
      </ResultScreen>
    );
  }

  if (step === 'review') {
    return (
      <div className="nv-form nv-wallet-step">
        <h3 className="nv-wallet-step-title">Check your request</h3>
        <dl className="nv-summary">
          <div><dt>Method</dt><dd>{withdrawMethods[values.method].title}{values.method === 'crypto' && ` · ${values.network}`}</dd></div>
          <div><dt>To</dt><dd>{recipient}</dd></div>
          <div><dt>Amount</dt><dd>{money(c.code, n)}</dd></div>
          <div><dt>Fee</dt><dd>{money(c.code, term.fee)}</dd></div>
          <div className="is-total"><dt>You receive</dt><dd>{money(c.code, receive)}</dd></div>
          <div><dt>Estimated time</dt><dd>{term.time}</dd></div>
        </dl>
        <p className="nv-note">Check the {values.method === 'crypto' ? 'address and network' : 'account details'} carefully. Payouts sent to a wrong {values.method === 'crypto' ? 'address' : 'account'} can’t be reversed.</p>
        <div className="nv-wallet-actions">
          <Button variant="secondary" onClick={() => setStep('form')} disabled={busy}>Edit</Button>
          <Button loading={busy} onClick={confirm}>{busy ? 'Sending request…' : 'Confirm withdrawal'}</Button>
        </div>
      </div>
    );
  }

  const field = (key, label, props = {}) => <TextField name={key} label={label} value={values[key]} onChange={set(key)} error={errors[key]} {...props} />;

  return (
    <form className="nv-form nv-wallet-form" onSubmit={review} noValidate>
      <ChipChoice label="Currency" options={currencies.map((x) => x.code)} value={c.code} onChange={chooseCode} currencies={currencies} />
      <OptionCards
        legend="Withdrawal method"
        name="withdraw-method"
        value={values.method}
        onChange={(method) => update({ method })}
        options={Object.entries(withdrawMethods).map(([id, m]) => ({ id, ...m, disabled: !rules.methods.includes(id), text: rules.methods.includes(id) ? m.text : `Not available for ${c.code}` }))}
      />
      {values.method === 'crypto' ? (
        <>
          <ChipChoice label="Network" options={cryptoNetworks[c.code].map((x) => x.id)} value={values.network} onChange={(network) => update({ network })} />
          {field('address', `Your ${c.code} wallet address`, { autoComplete: 'off', spellCheck: false, placeholder: 'Paste your address', hint: `Only a ${values.network} address. Demo: not saved anywhere.` })}
        </>
      ) : (
        <div className="nv-wallet-pair">
          {field('holder', 'Account holder', { autoComplete: 'name' })}
          {field('iban', 'IBAN', { autoComplete: 'off', spellCheck: false, placeholder: 'DE89 3704 0044 0532 0130 00' })}
        </div>
      )}
      <AmountField
        code={c.code}
        value={values.amount}
        onChange={(amount) => update({ amount })}
        error={errors.amount}
        hint={`Available: ${money(c.code, c.available)} · minimum ${money(c.code, rules.min)}`}
        extra={<button type="button" className="nv-chip" onClick={() => update({ amount: String(c.available) })} disabled={!c.available}>Max</button>}
      />
      <dl className="nv-summary">
        <div><dt>Available to withdraw</dt><dd>{money(c.code, c.available)}</dd></div>
        <div><dt>Fee</dt><dd>{money(c.code, term.fee)}</dd></div>
        <div className="is-total"><dt>You receive</dt><dd>{receive ? money(c.code, receive) : '—'}</dd></div>
        <div><dt>Estimated time</dt><dd>{term.time}</dd></div>
      </dl>
      <Button type="submit" size="lg" block>Review withdrawal</Button>
    </form>
  );
}
