import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import { SelectField } from '../../components/ui/Field.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { languages } from '../../data/settings.js';
import { saveSetting } from '../../lib/api.js';
import { SettingRow, SettingsCard, Switch } from './parts.jsx';

// Preferences: language (only real ones), default currency (form) and reduced motion (saves at once).
export default function Preferences() {
  const { settings, update, systemReduce, reduceMotion, setReduceMotion } = useSettings();
  const { currencies, setCurrencyCode } = usePlayer();
  const toast = useToast();
  const [code, setCode] = useState(settings.defaultCurrency);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState('');
  const dirty = code !== settings.defaultCurrency;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert('');
    try {
      await saveSetting();
      update({ defaultCurrency: code });
      setCurrencyCode(code);
      toast(`Default currency saved. Your ${code} wallet is selected`);
    } catch (err) {
      setAlert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsCard id="prefs" title="Preferences">
      <SettingRow label="Language" text={languages.length > 1 ? 'Interface language.' : 'English is the only interface language for now.'}>
        <span className="nv-setting-value">{languages[0].label}</span>
      </SettingRow>
      <form className="nv-setting nv-setting--form" onSubmit={save} noValidate>
        <div className="nv-setting-copy">
          <strong>Default currency</strong>
          <p>Selects this wallet when you open the site. Balances are never converted.</p>
        </div>
        <div className="nv-setting-control">
          <SelectField label="Default currency" className="nv-sr-label" value={code} disabled={saving} onChange={(e) => { setCode(e.target.value); setAlert(''); }} options={currencies.map((c) => ({ value: c.code, label: `${c.code} · ${c.name}` }))} />
        </div>
        {alert && <p className="nv-form-alert" role="alert">{alert}</p>}
        {dirty && (
          <div className="nv-setting-actions">
            <Button variant="secondary" size="sm" disabled={saving} onClick={() => { setCode(settings.defaultCurrency); setAlert(''); }}>Cancel</Button>
            <Button type="submit" size="sm" loading={saving}>Save changes</Button>
          </div>
        )}
      </form>
      <SettingRow label="Reduced motion" labelId="motionLabel" text={systemReduce ? 'On because your device asks for reduced motion.' : 'Calms decorative animations and stops the moving background and banners.'}>
        <Switch
          label="Reduced motion"
          checked={reduceMotion}
          disabled={systemReduce}
          onChange={(on) => { setReduceMotion(on); toast(on ? 'Reduced motion on' : 'Reduced motion off'); }}
        />
      </SettingRow>
    </SettingsCard>
  );
}
