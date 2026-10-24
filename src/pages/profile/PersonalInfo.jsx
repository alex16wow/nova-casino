import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import { SelectField, TextField } from '../../components/ui/Field.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { countries, countryName, editableFields, formatDate } from '../../data/profile.js';
import { saveProfile } from '../../lib/api.js';
import StatusBadge from './StatusBadge.jsx';

const pick = (profile) => Object.fromEntries(editableFields.map((k) => [k, profile[k]]));
const NAME = /^[\p{L}][\p{L} '-]*$/u;

const adultCutoff = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().slice(0, 10);
};

function validate(v) {
  const e = {};
  const nick = v.nickname.trim();
  if (!nick) e.nickname = 'Enter a nickname';
  else if (!/^[A-Za-z0-9_]{3,16}$/.test(nick)) e.nickname = '3–16 characters: letters, numbers or _';
  for (const [key, label] of [['firstName', 'first name'], ['lastName', 'last name']]) {
    const val = v[key].trim();
    if (!val) e[key] = `Enter your ${label}`;
    else if (!NAME.test(val) || val.length > 40) e[key] = 'Use letters, spaces, hyphens or apostrophes';
  }
  if (!v.birthDate) e.birthDate = 'Enter your date of birth';
  else if (Number.isNaN(Date.parse(v.birthDate)) || v.birthDate < '1900-01-01') e.birthDate = 'Enter a valid date';
  else if (v.birthDate > adultCutoff()) e.birthDate = 'You must be at least 18 years old';
  if (!v.country) e.country = 'Select your country';
  if (!v.city.trim()) e.city = 'Enter your city';
  else if (!NAME.test(v.city.trim())) e.city = 'Use letters, spaces or hyphens';
  if (!v.address.trim()) e.address = 'Enter your address';
  else if (v.address.trim().length < 5) e.address = 'Address looks too short';
  if (!v.postalCode.trim()) e.postalCode = 'Enter your postal code';
  else if (!/^[A-Za-z0-9][A-Za-z0-9 -]{1,8}[A-Za-z0-9]$/.test(v.postalCode.trim())) e.postalCode = '3–10 letters or numbers';
  return e;
}

const countryOptions = [{ value: '', label: 'Select country' }, ...countries.map(([value, label]) => ({ value, label }))];

// Personal information: read view, edit form with inline validation, Save changes / Cancel.
export default function PersonalInfo() {
  const { profile, updateProfile } = useProfile();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState(() => pick(profile));
  const [errors, setErrors] = useState({});
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState('');

  const start = () => { setValues(pick(profile)); setErrors({}); setTried(false); setAlert(''); setEditing(true); };
  const cancel = () => { setValues(pick(profile)); setErrors({}); setAlert(''); setEditing(false); };

  const set = (key) => (e) => {
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    if (tried) setErrors(validate(next));
  };

  const submit = async (e) => {
    e.preventDefault();
    setTried(true);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setSaving(true);
    setAlert('');
    try {
      const clean = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]));
      updateProfile(await saveProfile(clean));
      setEditing(false);
      toast('Profile saved');
    } catch (err) {
      setAlert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const field = (key, label, props = {}) => (
    <TextField name={key} label={label} value={values[key]} onChange={set(key)} error={errors[key]} disabled={saving} {...props} />
  );

  return (
    <section className="nv-panel nv-profile-info" aria-labelledby="personalInfoTitle">
      <div className="nv-panel-head">
        <h2 id="personalInfoTitle">Personal information</h2>
        {!editing && <Button variant="secondary" size="sm" onClick={start}>Edit</Button>}
      </div>

      {editing ? (
        <form className="nv-profile-form" onSubmit={submit} noValidate>
          {alert && <p className="nv-form-alert" role="alert">{alert}</p>}
          <div className="nv-profile-grid">
            {field('nickname', 'Nickname', { autoComplete: 'nickname', maxLength: 16, 'data-autofocus': true })}
            {field('firstName', 'First name', { autoComplete: 'given-name', maxLength: 40 })}
            {field('lastName', 'Last name', { autoComplete: 'family-name', maxLength: 40 })}
            {field('birthDate', 'Date of birth', { type: 'date', autoComplete: 'bday', max: adultCutoff(), min: '1900-01-01' })}
            <SelectField name="country" label="Country" options={countryOptions} value={values.country} onChange={set('country')} error={errors.country} disabled={saving} autoComplete="country" />
            {field('city', 'City', { autoComplete: 'address-level2', maxLength: 60 })}
            {field('postalCode', 'Postal code', { autoComplete: 'postal-code', maxLength: 10 })}
            {field('address', 'Address', { autoComplete: 'street-address', maxLength: 100 })}
          </div>
          <Contacts profile={profile} />
          <div className="nv-profile-actions">
            <Button variant="secondary" onClick={cancel} disabled={saving}>Cancel</Button>
            <Button type="submit" loading={saving}>Save changes</Button>
          </div>
        </form>
      ) : (
        <>
          <dl className="nv-profile-grid nv-profile-view">
            <Row label="Nickname" value={profile.nickname} />
            <Row label="First name" value={profile.firstName} />
            <Row label="Last name" value={profile.lastName} />
            <Row label="Date of birth" value={profile.birthDate && formatDate(profile.birthDate)} />
            <Row label="Country" value={countryName(profile.country)} />
            <Row label="City" value={profile.city} />
            <Row label="Postal code" value={profile.postalCode} />
            <Row label="Address" value={profile.address} />
          </dl>
          <Contacts profile={profile} />
        </>
      )}
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value || <span className="nv-profile-empty">Not set</span>}</dd>
    </div>
  );
}

// Email and phone: shown with their confirmation status; changed through Support.
function Contacts({ profile }) {
  const item = (label, value, verified) => (
    <div className="nv-profile-contact">
      <dt>{label}</dt>
      <dd><span>{value}</span><StatusBadge tone={verified ? 'success' : 'warning'}>{verified ? 'Confirmed' : 'Not confirmed'}</StatusBadge></dd>
    </div>
  );
  return (
    <div className="nv-profile-contacts">
      <dl>
        {item('Email', profile.email, profile.emailVerified)}
        {item('Phone', profile.phone, profile.phoneVerified)}
      </dl>
      <p className="nv-field-hint">To change your email or phone number, contact Support.</p>
    </div>
  );
}
