import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { demoEnabled, getDemo, setDemo } from '../../lib/demo.js';

const networkModes = [
  ['normal', 'Normal'],
  ['slow', 'Slow (3s)'],
  ['error', 'Error'],
  ['empty', 'Empty'],
];

// Prototype-only switcher for reviewing states. Shown in preview builds or with ?demo in the URL.
export default function DemoPanel() {
  const { user, startSession, endSession, openAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const [network, setNetwork] = useState(() => getDemo().network);
  if (!demoEnabled()) return null;

  const chooseNetwork = (mode) => {
    setNetwork(mode);
    setDemo({ network: mode });
    location.reload();
  };

  return (
    <div className={`nv-demo${open ? ' is-open' : ''}`}>
      <button type="button" className="nv-demo-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>States</button>
      {open && (
        <div className="nv-demo-panel" role="group" aria-label="Prototype states">
          <p className="nv-demo-title">Account</p>
          <div className="nv-demo-options">
            <button type="button" aria-pressed={!user} onClick={endSession}>Guest</button>
            <button type="button" aria-pressed={Boolean(user)} onClick={() => startSession({ email: 'player@nova.casino', name: 'player' })}>Signed in</button>
          </div>
          <p className="nv-demo-title">Data</p>
          <div className="nv-demo-options">
            {networkModes.map(([mode, label]) => (
              <button key={mode} type="button" aria-pressed={network === mode} onClick={() => chooseNetwork(mode)}>{label}</button>
            ))}
          </div>
          <p className="nv-demo-title">Dialogs</p>
          <div className="nv-demo-options">
            <button type="button" onClick={() => openAuth('login')}>Log in</button>
            <button type="button" onClick={() => openAuth('register')}>Sign up</button>
            <button type="button" onClick={() => openAuth('forgot')}>Reset</button>
          </div>
          <p className="nv-demo-hint">Wrong password: <code>wrongpass</code> · taken email: <code>taken@nova.casino</code></p>
        </div>
      )}
    </div>
  );
}
