import { findAvatar } from '../../data/profile.js';
import { asset } from '../../lib/asset.js';

export const initials = ({ firstName, lastName, nickname }) =>
  ((firstName?.[0] ?? '') + (lastName?.[0] ?? '') || nickname?.slice(0, 2) || '?').toUpperCase();

// Player avatar: the photo or initials on a gradient. Size comes from the parent (fills it).
export default function Avatar({ profile, id = profile.avatar, className = '' }) {
  const avatar = findAvatar(id);
  return avatar.image ? (
    <img className={`nv-avatar ${className}`.trim()} src={asset(avatar.image)} alt="" width="74" height="74" />
  ) : (
    <span className={`nv-avatar nv-avatar--initials ${className}`.trim()} style={{ background: avatar.gradient }} aria-hidden="true">{initials(profile)}</span>
  );
}
