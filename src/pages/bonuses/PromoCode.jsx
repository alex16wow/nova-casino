import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import { TextField } from '../../components/ui/Field.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const messages = {
  invalid: 'This code isn’t valid. Check the spelling and try again.',
  used: 'You’ve already used this code.',
};

// Promo code field. A valid code adds its bonus to Active once.
export default function PromoCode({ onApplied }) {
  const { applyPromo } = usePlayer();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setDone('');
    if (!code.trim()) { setError('Enter a promo code'); return; }
    const result = applyPromo(code);
    if (!result.ok) { setError(messages[result.reason]); return; }
    setError('');
    setCode('');
    setDone(`Code applied: ${result.bonus.spins} free spins in ${result.bonus.game} are in Active.`);
    toast('Promo code applied');
    onApplied?.();
  };

  return (
    <section className="nv-panel nv-promo" aria-labelledby="promoTitle">
      <h2 id="promoTitle">Promo code</h2>
      <form className="nv-promo-form" onSubmit={submit} noValidate>
        <TextField label="Promo code" className="nv-promo-field" value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }} error={error} autoComplete="off" spellCheck={false} placeholder="Enter code" maxLength={20} />
        <Button type="submit" variant="secondary">Apply</Button>
      </form>
      {done && <p className="nv-promo-done" role="status">{done}</p>}
    </section>
  );
}
