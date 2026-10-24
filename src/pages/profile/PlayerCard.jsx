import { useEffect, useRef, useState } from 'react';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { Check } from '../../components/ui/icons.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { avatars, formatDate, verificationStatus } from '../../data/profile.js';
import { copyText } from '../../lib/clipboard.js';
import StatusBadge from './StatusBadge.jsx';

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></svg>
);
const PencilIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 20 1-4L16 5l3 3L8 19l-4 1ZM14 7l3 3" /></svg>
);

// Avatar, nickname, Player ID with copy, registration date and verification status.
export default function PlayerCard() {
  const { profile } = useProfile();
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [picking, setPicking] = useState(false);
  const timer = useRef();
  const status = verificationStatus[profile.verification];

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const ok = await copyText(profile.playerId);
    toast(ok ? 'Player ID copied' : 'Couldn’t copy. Select the ID and copy it manually');
    if (!ok) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="nv-panel nv-profile-card" aria-label="Player card">
      <div className="nv-profile-avatar">
        <Avatar profile={profile} />
        <button type="button" className="nv-profile-avatar-edit" aria-label="Change avatar" onClick={() => setPicking(true)}><PencilIcon /></button>
      </div>
      <h2 className="nv-profile-nick">{profile.nickname}</h2>
      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      <dl className="nv-profile-meta">
        <div>
          <dt>Player ID</dt>
          <dd>
            <span className="nv-profile-id">{profile.playerId}</span>
            <button type="button" className={`nv-icon-btn${copied ? ' is-done' : ''}`} aria-label={copied ? 'Player ID copied' : 'Copy Player ID'} onClick={copy}>
              {copied ? <Check /> : <CopyIcon />}
            </button>
          </dd>
        </div>
        <div>
          <dt>Member since</dt>
          <dd>{formatDate(profile.registered)}</dd>
        </div>
      </dl>
      <Button variant="secondary" size="sm" block onClick={() => setPicking(true)}>Change avatar</Button>
      <AvatarPicker open={picking} onClose={() => setPicking(false)} />
    </section>
  );
}

function AvatarPicker({ open, onClose }) {
  const { profile, setAvatar } = useProfile();
  const toast = useToast();
  const [choice, setChoice] = useState(profile.avatar);

  useEffect(() => { if (open) setChoice(profile.avatar); }, [open, profile.avatar]);

  const save = () => {
    if (choice !== profile.avatar) {
      setAvatar(choice);
      toast('Avatar updated');
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Choose an avatar" subtitle="Pick your photo or initials on a colour you like." size="sm">
      <div className="nv-avatar-grid" role="radiogroup" aria-label="Avatars">
        {avatars.map((a) => (
          <button
            key={a.id}
            type="button"
            role="radio"
            aria-checked={choice === a.id}
            aria-label={a.label}
            className={`nv-avatar-option${choice === a.id ? ' is-selected' : ''}`}
            data-autofocus={choice === a.id || undefined}
            onClick={() => setChoice(a.id)}
          >
            <Avatar profile={profile} id={a.id} />
          </button>
        ))}
      </div>
      <div className="nv-form-row">
        <Button variant="secondary" className="nv-grow" onClick={onClose}>Cancel</Button>
        <Button className="nv-grow" onClick={save}>Save</Button>
      </div>
    </Modal>
  );
}
