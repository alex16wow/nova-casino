import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import StatusBadge from '../profile/StatusBadge.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { demoSessions } from '../../data/settings.js';
import { PasswordModal, TwoFactorModal } from './SecurityModals.jsx';
import { DemoTag, SettingRow, SettingsCard } from './parts.jsx';

// This browser, described from its user agent (no location is looked up).
function thisDevice() {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'macOS' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'This device';
  return `${browser} on ${os}`;
}
const ago = (ms) => (ms < 864e5 ? `${Math.round(ms / 36e5)} hours ago` : ms < 2 * 864e5 ? 'Yesterday' : `${Math.round(ms / 864e5)} days ago`);

const DeviceIcon = ({ phone }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {phone ? <><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></> : <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>}
  </svg>
);

// Security: change password (demo), two-factor (demo) and active sessions.
export default function Security() {
  const { settings, setTwoFactor, endOtherSession, endOtherSessions } = useSettings();
  const toast = useToast();
  const [password, setPassword] = useState(false);
  const [twoFactor, setTwoFactorMode] = useState(null);
  const others = demoSessions.filter((s) => !settings.endedSessions.includes(s.id));

  return (
    <SettingsCard id="security" title="Security" className="nv-settings-card--wide">
      <div className="nv-settings-split">
        <div>
          <SettingRow label={<>Password <DemoTag /></>} text="Change the password you use to log in.">
            <Button variant="secondary" size="sm" onClick={() => setPassword(true)}>Change password</Button>
          </SettingRow>
          <SettingRow
            label={<>Two-factor authentication <DemoTag /></>}
            text={settings.twoFactor ? 'A code from an authenticator app is asked at login (demo only).' : 'Add a one-time code at login. Shown as a demo, without real protection.'}
          >
            <StatusBadge tone={settings.twoFactor ? 'success' : 'muted'}>{settings.twoFactor ? 'Enabled' : 'Disabled'}</StatusBadge>
            <Button variant={settings.twoFactor ? 'ghost' : 'secondary'} size="sm" onClick={() => setTwoFactorMode(settings.twoFactor ? 'disable' : 'setup')}>{settings.twoFactor ? 'Turn off' : 'Set up'}</Button>
          </SettingRow>
        </div>
        <div className="nv-sessions">
          <div className="nv-sessions-head">
            <strong>Active sessions</strong>
            {others.length > 1 && <Button variant="ghost" size="sm" className="nv-btn--danger-text" onClick={() => { endOtherSessions(others.map((s) => s.id)); toast('Other sessions ended'); }}>End all others</Button>}
          </div>
          <ul>
            <li className="nv-session is-current">
              <span className="nv-session-icon"><DeviceIcon phone={/iPhone|Android/.test(navigator.userAgent)} /></span>
              <span className="nv-session-main"><strong>{thisDevice()}</strong><small>Active now</small></span>
              <StatusBadge tone="success">This device</StatusBadge>
            </li>
            {others.map((s) => (
              <li key={s.id} className="nv-session">
                <span className="nv-session-icon"><DeviceIcon phone={s.device.startsWith('iPhone')} /></span>
                <span className="nv-session-main"><strong>{s.device} · {s.browser}</strong><small>{s.place} · {ago(s.ago)}</small></span>
                <Button variant="ghost" size="sm" className="nv-btn--danger-text" aria-label={`End session on ${s.device}`} onClick={() => { endOtherSession(s.id); toast(`Session on ${s.device} ended`); }}>End</Button>
              </li>
            ))}
          </ul>
          {!others.length && <p className="nv-sessions-note">No other devices are signed in.</p>}
        </div>
      </div>

      <PasswordModal open={password} onClose={() => setPassword(false)} />
      <TwoFactorModal
        mode={twoFactor}
        onClose={() => setTwoFactorMode(null)}
        onEnable={() => setTwoFactor(true)}
        onDisable={() => { setTwoFactor(false); setTwoFactorMode(null); toast('Two-factor authentication turned off'); }}
      />
    </SettingsCard>
  );
}
