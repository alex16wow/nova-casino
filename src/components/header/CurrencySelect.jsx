import { useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useDismiss } from '../../hooks/useDismiss.js';
import { Check, CurrencyChevron } from '../ui/icons.jsx';

// Wallet balance with a currency dropdown. `children` is the compact deposit button on touch layouts.
export default function CurrencySelect({ open, setOpen, children }) {
  const { currencies, currency, setCurrencyCode } = usePlayer();
  const wrap = useRef(null);
  useDismiss(open, () => setOpen(false), [wrap]);

  return (
    <div className="currency-wrap" ref={wrap}>
      <button className="balance" id="currencyToggle" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className={`coin coin--${currency.dot}`} id="currencyCoin">{currency.symbol}</span>
        <span className="currency-code" id="currencyCode">{currency.code}</span>
        <CurrencyChevron />
        <b id="currencyBalance">{currency.balance}</b>
      </button>
      <div className={`currency-menu${open ? ' open' : ''}`} id="currencyMenu" role="listbox" aria-label="Choose currency">
        {currencies.map((c) => (
          <button key={c.code} role="option" aria-selected={c.code === currency.code} data-code={c.code} onClick={() => { setCurrencyCode(c.code); setOpen(false); }}>
            <span className={`currency-dot ${c.dot}`}>{c.symbol}</span>
            <span><strong>{c.code}</strong><small>{c.name}</small></span>
            <span className="currency-check"><Check /></span>
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
