import { useEffect, useRef, useState } from 'react';
import { TextField } from '../../components/ui/Field.jsx';
import { Check } from '../../components/ui/icons.jsx';
import { formatAmount } from '../../context/PlayerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { copyText } from '../../lib/clipboard.js';

export const parseAmount = (v) => Number(String(v).replace(',', '.'));
export const money = (code, n) => `${formatAmount(code, n)} ${code}`;
export const cleanAmount = (v) => v.replace(/[^\d.,]/g, '');

// Radio cards (payment method). Same look as the deposit dialog options.
export function OptionCards({ legend, name, options, value, onChange }) {
  return (
    <fieldset className="nv-bonus-choice nv-wallet-options">
      <legend>{legend}</legend>
      {options.map((o) => (
        <label key={o.id} className={`nv-bonus-option${value === o.id ? ' is-selected' : ''}${o.disabled ? ' is-disabled' : ''}`}>
          <input type="radio" name={name} value={o.id} checked={value === o.id} disabled={o.disabled} onChange={() => onChange(o.id)} />
          <span className="nv-bonus-radio" aria-hidden="true" />
          <span><strong>{o.title}</strong><small>{o.text}</small></span>
        </label>
      ))}
    </fieldset>
  );
}

// Chip row acting as a radio group (currency, network).
export function ChipChoice({ label, options, value, onChange, currencies }) {
  return (
    <div className="nv-field">
      <span className="nv-field-label" id={`chips-${label}`}>{label}</span>
      <div className="nv-wallet-chips" role="radiogroup" aria-labelledby={`chips-${label}`}>
        {options.map((o) => {
          const c = currencies?.find((x) => x.code === o);
          return (
            <button key={o} type="button" role="radio" aria-checked={o === value} className={`nv-chip${o === value ? ' is-selected' : ''}`} onClick={() => onChange(o)}>
              {c && <span className={`currency-dot ${c.dot}`} aria-hidden="true">{c.symbol}</span>}{o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Amount input with a currency suffix and quick values.
export function AmountField({ code, value, onChange, error, hint, presets, extra }) {
  return (
    <div className="nv-deposit-amount">
      <TextField
        label="Amount"
        name="amount"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(cleanAmount(e.target.value))}
        error={error}
        hint={hint}
        trailing={<span className="nv-field-suffix">{code}</span>}
      />
      {(presets || extra) && (
        <div className="nv-chips nv-chips--fill">
          {presets?.map((p) => (
            <button key={p} type="button" className={`nv-chip${parseAmount(value) === p ? ' is-selected' : ''}`} onClick={() => onChange(String(p))}>{formatAmount(code, p)}</button>
          ))}
          {extra}
        </div>
      )}
    </div>
  );
}

export function CopyButton({ text, label = 'Copy', done = 'Copied' }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    const ok = await copyText(text);
    toast(ok ? done : 'Couldn’t copy. Select the text and copy it manually');
    if (!ok) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" className={`nv-btn nv-btn--secondary nv-btn--sm nv-copy${copied ? ' is-done' : ''}`} onClick={copy}>
      {copied && <Check />}<span className="nv-btn-label">{copied ? done : label}</span>
    </button>
  );
}

// Result screen: success tick or error mark, a line of text, details and actions.
export function ResultScreen({ kind = 'success', title, children, actions }) {
  return (
    <div className={`nv-wallet-result is-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <span className="nv-done-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {kind === 'error' ? <path d="M12 7v6m0 4v.01" /> : <path d="m5 12.5 4.5 4.5L19 7.5" />}
        </svg>
      </span>
      <h3>{title}</h3>
      {children}
      <div className="nv-wallet-actions">{actions}</div>
    </div>
  );
}
