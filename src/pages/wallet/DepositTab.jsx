import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { Checkbox } from '../../components/ui/Field.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { depositBonusAmount, offers } from '../../data/bonuses.js';
import { cryptoNetworks, demoAddress, depositRules, isCrypto, walletDepositMethods } from '../../data/wallet.js';
import { processDeposit } from '../../lib/api.js';
import { AmountField, ChipChoice, CopyButton, OptionCards, ResultScreen, money, parseAmount } from './parts.jsx';

const cryptoCodes = Object.keys(cryptoNetworks);

function amountError(value, code) {
  const { min, max } = depositRules[code];
  if (value === '') return 'Enter an amount';
  const n = parseAmount(value);
  if (!Number.isFinite(n) || n <= 0) return 'Enter a valid amount';
  if (n < min) return `The minimum is ${money(code, min)}`;
  if (n > max) return `The maximum is ${money(code, max)}`;
  return '';
}

// Deposit: method, currency (and network for crypto), amount → demo address or provider page → processing → result.
// One attempt has one transaction id, so a repeated click can't credit twice.
export default function DepositTab({ onHistory }) {
  const { currencies, currency, deposit, recordFailure, setCurrencyCode, bonuses, activeMoneyBonus, activateDepositBonus } = usePlayer();
  const [params] = useSearchParams();
  const offer = offers.deposit100;
  const [withBonus, setWithBonus] = useState(params.get('bonus') === offer.id);
  const [method, setMethod] = useState(isCrypto(currency.code) ? 'crypto' : 'card');
  const [code, setCode] = useState(currency.code);
  const [network, setNetwork] = useState(cryptoNetworks[currency.code]?.[0].id);
  const [amount, setAmount] = useState(String(depositRules[currency.code].presets[1]));
  const [tried, setTried] = useState(false);
  // step: form | address | provider | done | error
  const [step, setStep] = useState('form');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const attempt = useRef(null);

  const rules = depositRules[code];
  const error = amountError(amount, code);
  const value = error ? 0 : parseAmount(amount);
  // Deposit bonus (see Bonuses): offered once, for its currencies, and only without another active money bonus.
  const offerOpen = !bonuses.some((b) => b.offerId === offer.id) && offer.currencies.includes(code);
  const bonusOn = offerOpen && withBonus && !activeMoneyBonus && value >= offer.minDeposit;
  const bonusValue = bonusOn ? depositBonusAmount(offer, value) : 0;

  const chooseCode = (next) => {
    setCode(next);
    setNetwork(cryptoNetworks[next]?.[0].id);
    setAmount(String(depositRules[next].presets[1]));
    setTried(false);
  };
  const chooseMethod = (next) => {
    setMethod(next);
    if (next === 'crypto' && !isCrypto(code)) chooseCode('USDT');
  };

  const submit = (e) => {
    e.preventDefault();
    setTried(true);
    if (error) { e.currentTarget.querySelector('[name="amount"]')?.focus(); return; }
    attempt.current = null;
    setStep(method === 'crypto' ? 'address' : 'provider');
  };

  const pay = async () => {
    if (busy) return;
    setBusy(true);
    const order = { code, amount: value, method, network: method === 'crypto' ? network : null };
    try {
      await processDeposit({ method });
      // The id is fixed for this attempt: deposit() ignores a second call with the same id.
      attempt.current ??= `DP-${Date.now().toString(36).toUpperCase().slice(-8)}`;
      const id = deposit(code, value, { id: attempt.current, method, network: order.network });
      // activateDepositBonus refuses a second activation, so a repeated call adds nothing.
      const bonus = bonusOn ? activateDepositBonus(code, value) : null;
      setCurrencyCode(code);
      setResult({ ...order, id, bonus: bonus?.ok ? bonus.bonus : null });
      setStep('done');
    } catch (err) {
      const id = recordFailure({ type: 'deposit', ...order, failReason: err.message });
      setResult({ ...order, id, message: err.message, from: step });
      setStep('error');
    } finally {
      setBusy(false);
    }
  };

  const restart = () => { setStep('form'); setResult(null); setTried(false); attempt.current = null; };

  if (step === 'done') {
    const balance = currencies.find((c) => c.code === result.code);
    return (
      <ResultScreen
        title="Deposit successful"
        actions={<><Button variant="secondary" onClick={onHistory}>View transactions</Button><Button onClick={restart}>New deposit</Button></>}
      >
        <p><b>{money(result.code, result.amount)}</b> has been added to your real balance.{result.bonus && <> Your bonus of <b>{money(result.bonus.code, result.bonus.amount)}</b> is active in <Link to="/account/bonuses?tab=active">Bonuses</Link>.</>}</p>
        <dl className="nv-summary">
          <div><dt>New real balance</dt><dd>{money(result.code, balance.amount)}</dd></div>
          <div><dt>Transaction ID</dt><dd>{result.id}</dd></div>
          <div><dt>Status</dt><dd className="is-success">Completed</dd></div>
        </dl>
      </ResultScreen>
    );
  }

  if (step === 'error') {
    return (
      <ResultScreen
        kind="error"
        title="Deposit failed"
        actions={<><Button variant="secondary" onClick={restart}>Change details</Button><Button onClick={() => setStep(result.from)}>Try again</Button></>}
      >
        <p>{result.message}</p>
        <dl className="nv-summary">
          <div><dt>Amount</dt><dd>{money(result.code, result.amount)}</dd></div>
          <div><dt>Transaction ID</dt><dd>{result.id}</dd></div>
          <div><dt>Balance</dt><dd>Not changed</dd></div>
        </dl>
      </ResultScreen>
    );
  }

  if (step === 'address') {
    const address = demoAddress(code, network);
    return (
      <div className="nv-form nv-wallet-step">
        <h3 className="nv-wallet-step-title">Send your deposit</h3>
        <dl className="nv-summary">
          <div><dt>Send exactly</dt><dd>{money(code, value)}</dd></div>
          <div><dt>Network</dt><dd>{network}</dd></div>
        </dl>
        <div className="nv-field">
          <span className="nv-field-label">Deposit address <span className="nv-demo-tag">Demo address — do not send funds</span></span>
          <div className="nv-address"><code>{address}</code><CopyButton text={address} done="Address copied" /></div>
        </div>
        <p className="nv-note">Send only <b>{code}</b> on the <b>{network}</b> network. Funds sent on another network or in another coin can’t be recovered.</p>
        <div className="nv-wallet-actions">
          <Button variant="secondary" onClick={restart} disabled={busy}>Back</Button>
          <Button loading={busy} onClick={pay}>{busy ? 'Checking payment…' : 'I’ve sent the payment'}</Button>
        </div>
      </div>
    );
  }

  if (step === 'provider') {
    return (
      <div className="nv-form nv-wallet-step">
        <h3 className="nv-wallet-step-title">Continue on the provider’s page</h3>
        <div className="nv-provider" aria-label="Payment provider (demo)">
          <div className="nv-provider-head"><span className="nv-provider-logo">SecurePay</span><span className="nv-demo-tag">Demo provider</span></div>
          <dl className="nv-summary">
            <div><dt>Merchant</dt><dd>NOVA Casino</dd></div>
            <div><dt>Amount</dt><dd>{money(code, value)}</dd></div>
          </dl>
          <p className="nv-provider-note">On a live site you’d enter your card details here, on the provider’s secure page. This demo doesn’t ask for or store card details.</p>
        </div>
        <div className="nv-wallet-actions">
          <Button variant="secondary" onClick={restart} disabled={busy}>Cancel</Button>
          <Button loading={busy} onClick={pay}>{busy ? 'Processing…' : `Pay ${money(code, value)}`}</Button>
        </div>
      </div>
    );
  }

  const codes = method === 'crypto' ? cryptoCodes : currencies.map((c) => c.code);
  return (
    <form className="nv-form nv-wallet-form" onSubmit={submit} noValidate>
      <OptionCards
        legend="Payment method"
        name="deposit-method"
        value={method}
        onChange={chooseMethod}
        options={Object.entries(walletDepositMethods).map(([id, m]) => ({ id, ...m }))}
      />
      <ChipChoice label="Currency" options={codes} value={code} onChange={chooseCode} currencies={currencies} />
      {method === 'crypto' && (
        <ChipChoice label="Network" options={cryptoNetworks[code].map((n) => n.id)} value={network} onChange={setNetwork} />
      )}
      <AmountField
        code={code}
        value={amount}
        onChange={setAmount}
        error={tried ? error : ''}
        hint={`From ${money(code, rules.min)} to ${money(code, rules.max)}`}
        presets={rules.presets}
      />
      {offerOpen && (activeMoneyBonus ? (
        <p className="nv-note">{offer.title} can’t be added: you already have an active bonus ({activeMoneyBonus.title}). Finish or cancel it in <Link to="/account/bonuses?tab=active">Bonuses</Link> first.</p>
      ) : (
        <Checkbox checked={withBonus} onChange={(e) => setWithBonus(e.target.checked)} label={<>Activate <b>{offer.title}</b>: {offer.match}% up to {money(code, offer.cap)}, wagering {offer.wager}× the bonus</>} />
      ))}
      <dl className="nv-summary">
        <div><dt>You deposit</dt><dd>{value ? money(code, value) : '—'}</dd></div>
        {bonusValue > 0 && <div><dt>Bonus</dt><dd className="is-accent">+{money(code, bonusValue)}</dd></div>}
        <div><dt>Fee</dt><dd>Free</dd></div>
        <div><dt>Credited to</dt><dd>Real balance{bonusValue > 0 && ' + bonus balance'}</dd></div>
      </dl>
      <Button type="submit" size="lg" block>{method === 'crypto' ? 'Show deposit address' : 'Continue to payment'}</Button>
    </form>
  );
}
