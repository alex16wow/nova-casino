import { useSettings } from '../../context/SettingsContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { notificationTopics } from '../../data/settings.js';
import { SettingRow, SettingsCard, Switch } from './parts.jsx';

// Email notifications by topic. Saved at once in this browser; no emails are actually sent.
export default function NotificationSettings() {
  const { settings, setNotification } = useSettings();
  const toast = useToast();
  return (
    <SettingsCard id="notify" title="Notifications" text="Email notifications. Changes save automatically.">
      {notificationTopics.map((t) => (
        <SettingRow key={t.id} label={t.label} labelId={`notify-${t.id}`} text={t.required ? `${t.text} Required for your account’s safety, so it can’t be turned off.` : t.text}>
          <Switch
            label={`${t.label} emails`}
            checked={t.required || settings.notifications[t.id]}
            disabled={t.required}
            onChange={(on) => { setNotification(t.id, on); toast(`${t.label}: emails ${on ? 'on' : 'off'}`); }}
          />
        </SettingRow>
      ))}
    </SettingsCard>
  );
}
