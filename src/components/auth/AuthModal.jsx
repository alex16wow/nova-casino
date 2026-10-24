import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { requestPasswordReset, signIn, signUp } from '../../lib/api.js';
import Button from '../ui/Button.jsx';
import { Checkbox, PasswordField, SelectField, TextField, passwordStrength } from '../ui/Field.jsx';
import Modal from '../ui/Modal.jsx';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validateEmail = (v) => (!v.trim() ? 'Enter your email.' : !EMAIL.test(v.trim()) ? 'Enter a valid email, like name@example.com.' : '');
const validateLoginPassword = (v) => (!v ? 'Enter your password.' : '');
const validateNewPassword = (v) => (!v ? 'Create a password.' : v.length < 8 ? 'Use at least 8 characters.' : passwordStrength(v) < 2 ? 'Add a number to make it stronger.' : '');

// Form state with "touched" tracking: errors appear after a field is left or the form is submitted.
function useForm(initial, rules) {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const errors = Object.fromEntries(Object.entries(rules).map(([k, rule]) => [k, rule(values[k], values)]));
  const bind = (name) => ({
    name,
    value: values[name],
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
  });
  const shown = (name) => (touched[name] ? errors[name] : '');
  const touch = (names = Object.keys(rules)) => setTouched((t) => ({ ...t, ...Object.fromEntries(names.map((k) => [k, true])) }));
  const valid = Object.values(errors).every((e) => !e);
  return { values, bind, shown, touch, valid, errors };
}

function FormAlert({ children }) {
  if (!children) return null;
  return <div className="nv-form-alert" role="alert">{children}</div>;
}

function LoginForm({ onSwitch, onDone }) {
  const form = useForm({ email: '', password: '' }, { email: validateEmail, password: validateLoginPassword });
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    form.touch();
    if (!form.valid) return;
    setBusy(true);
    setServerError('');
    try {
      onDone(await signIn(form.values), 'login');
    } catch (err) {
      setServerError(err.message);
      setBusy(false);
    }
  };

  return (
    <form className="nv-form" onSubmit={submit} noValidate>
      <FormAlert>{serverError}</FormAlert>
      <TextField label="Email" type="email" autoComplete="email" placeholder="name@example.com" data-autofocus error={form.shown('email')} valid={!form.errors.email} {...form.bind('email')} />
      <PasswordField label="Password" autoComplete="current-password" placeholder="Your password" error={form.shown('password')} {...form.bind('password')} />
      <button type="button" className="nv-link nv-form-aside" onClick={() => onSwitch('forgot')}>Forgot password?</button>
      <Button type="submit" block size="lg" loading={busy}>{busy ? 'Logging in…' : 'Log in'}</Button>
      <p className="nv-form-switch">New to NOVA? <button type="button" className="nv-link" onClick={() => onSwitch('register')}>Create an account</button></p>
    </form>
  );
}

const bonuses = [
  { id: 'welcome', title: '100% up to €500', text: 'Welcome bonus on your first deposit' },
  { id: 'spins', title: '100 free spins', text: 'On Gates of Olympus, over 5 days' },
  { id: 'none', title: 'No bonus', text: 'Play with real money only' },
];

function RegisterForm({ onSwitch, onDone }) {
  const { currencies } = usePlayer();
  const [step, setStep] = useState(1);
  const form = useForm(
    { email: '', password: '', currency: currencies[0].code, bonus: 'welcome', terms: false, news: false },
    {
      email: validateEmail,
      password: validateNewPassword,
      terms: (v) => (step === 2 && !v ? 'Confirm you are 18 or older and accept the terms.' : ''),
    },
  );
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');
  const formRef = useRef(null);
  const firstStep = useRef(true);

  // The button that moved between steps is gone, so move focus into the new step.
  useEffect(() => {
    if (firstStep.current) { firstStep.current = false; return; }
    formRef.current.querySelector('input:not([type=hidden])')?.focus();
  }, [step]);

  const next = (e) => {
    e.preventDefault();
    form.touch(['email', 'password']);
    if (form.errors.email || form.errors.password) return;
    setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    form.touch();
    if (!form.valid) return;
    setBusy(true);
    setServerError('');
    try {
      onDone(await signUp(form.values), 'register');
    } catch (err) {
      setServerError(err.message);
      setBusy(false);
      if (err.code === 'email-taken') setStep(1);
    }
  };

  return (
    <form ref={formRef} className="nv-form" onSubmit={step === 1 ? next : submit} noValidate>
      <ol className="nv-steps" aria-label={`Step ${step} of 2`}>
        <li className={step === 1 ? 'is-current' : 'is-done'}><span>1</span>Account</li>
        <li className={step === 2 ? 'is-current' : ''}><span>2</span>Bonus</li>
      </ol>
      <FormAlert>{serverError}</FormAlert>
      {step === 1 ? (
        <>
          <TextField label="Email" type="email" autoComplete="email" placeholder="name@example.com" data-autofocus error={form.shown('email')} valid={!form.errors.email} {...form.bind('email')} />
          <PasswordField label="Password" autoComplete="new-password" placeholder="At least 8 characters" showStrength error={form.shown('password')} {...form.bind('password')} />
          <SelectField label="Currency" options={currencies.map((c) => ({ value: c.code, label: `${c.code} · ${c.name}` }))} {...form.bind('currency')} />
          <Button type="submit" block size="lg">Continue</Button>
        </>
      ) : (
        <>
          <fieldset className="nv-bonus-choice">
            <legend>Choose your welcome bonus</legend>
            {bonuses.map((b) => (
              <label key={b.id} className={`nv-bonus-option${form.values.bonus === b.id ? ' is-selected' : ''}`}>
                <input type="radio" name="bonus" value={b.id} checked={form.values.bonus === b.id} onChange={form.bind('bonus').onChange} />
                <span className="nv-bonus-radio" aria-hidden="true" />
                <span><strong>{b.title}</strong><small>{b.text}</small></span>
              </label>
            ))}
          </fieldset>
          <Checkbox label={<>I am 18 or older and accept the <a href="#top" className="nv-link">Terms</a> and <a href="#top" className="nv-link">Privacy policy</a></>} error={form.shown('terms')} checked={form.values.terms} {...form.bind('terms')} />
          <Checkbox label="Send me offers and news by email" checked={form.values.news} {...form.bind('news')} />
          <div className="nv-form-row">
            <Button variant="secondary" size="lg" onClick={() => setStep(1)} disabled={busy}>Back</Button>
            <Button type="submit" size="lg" loading={busy} className="nv-grow">{busy ? 'Creating account…' : 'Create account'}</Button>
          </div>
        </>
      )}
      <p className="nv-form-switch">Already have an account? <button type="button" className="nv-link" onClick={() => onSwitch('login')}>Log in</button></p>
    </form>
  );
}

function ForgotForm({ onSwitch }) {
  const form = useForm({ email: '' }, { email: validateEmail });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    form.touch();
    if (!form.valid) return;
    setBusy(true);
    setServerError('');
    try {
      await requestPasswordReset(form.values.email);
      setSent(true);
    } catch (err) {
      setServerError(err.message);
    }
    setBusy(false);
  };

  if (sent) {
    return (
      <div className="nv-form nv-form--done" role="status">
        <span className="nv-done-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>
        </span>
        <p>We sent a reset link to <b>{form.values.email}</b>. It is valid for 30 minutes.</p>
        <Button block size="lg" data-autofocus onClick={() => onSwitch('login')}>Back to log in</Button>
      </div>
    );
  }
  return (
    <form className="nv-form" onSubmit={submit} noValidate>
      <FormAlert>{serverError}</FormAlert>
      <TextField label="Email" type="email" autoComplete="email" placeholder="name@example.com" data-autofocus error={form.shown('email')} valid={!form.errors.email} {...form.bind('email')} />
      <Button type="submit" block size="lg" loading={busy}>{busy ? 'Sending…' : 'Send reset link'}</Button>
      <p className="nv-form-switch"><button type="button" className="nv-link" onClick={() => onSwitch('login')}>Back to log in</button></p>
    </form>
  );
}

function LogoutConfirm({ onCancel, onConfirm }) {
  return (
    <div className="nv-form">
      <div className="nv-form-row">
        <Button variant="secondary" size="lg" className="nv-grow" data-autofocus onClick={onCancel}>Stay</Button>
        <Button size="lg" className="nv-grow" onClick={onConfirm}>Log out</Button>
      </div>
    </div>
  );
}

const titles = {
  login: ['Welcome back', 'Log in to play and claim your rewards.'],
  register: ['Create your account', 'Join NOVA in under a minute.'],
  forgot: ['Reset password', 'Enter your email and we’ll send you a reset link.'],
  logout: ['Log out?', 'Your balance and progress are saved to your account.'],
};

// Login, two-step sign-up, password reset and logout confirmation in one dialog.
export default function AuthModal() {
  const { authView, openAuth, closeAuth, startSession, endSession } = useAuth();
  const { setCurrencyCode } = usePlayer();
  const toast = useToast();
  const [view, setView] = useState(authView);

  useEffect(() => { if (authView) setView(authView); }, [authView]);

  const done = (account, kind) => {
    startSession(account);
    if (account.currency) setCurrencyCode(account.currency);
    closeAuth();
    toast(kind === 'register' ? 'Account created. Welcome to NOVA!' : `Welcome back, ${account.name}`);
  };

  const [title, subtitle] = titles[view] ?? [];
  return (
    <Modal open={Boolean(authView)} onClose={closeAuth} title={title} subtitle={subtitle} size={view === 'logout' ? 'sm' : 'md'} focusKey={view}>
      {view === 'login' && <LoginForm key="login" onSwitch={openAuth} onDone={done} />}
      {view === 'register' && <RegisterForm key="register" onSwitch={openAuth} onDone={done} />}
      {view === 'forgot' && <ForgotForm key="forgot" onSwitch={openAuth} />}
      {view === 'logout' && (
        <LogoutConfirm onCancel={closeAuth} onConfirm={() => { endSession(); closeAuth(); toast('You have logged out'); }} />
      )}
    </Modal>
  );
}
