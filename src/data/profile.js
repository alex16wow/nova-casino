// Demo player profile shared by the header avatar and the account pages.
// Only non-secret demo fields are kept (localStorage); identity documents are never stored.

export const demoProfile = {
  nickname: 'player',
  firstName: 'Alex',
  lastName: 'Morgan',
  birthDate: '1994-06-18',
  country: 'GB',
  city: 'London',
  address: '221B Baker Street',
  postalCode: 'NW1 6XE',
  email: 'player@nova.casino',
  emailVerified: true,
  phone: '+44 7700 900123',
  phoneVerified: false,
  playerId: 'NV-4827193',
  registered: '2025-03-14',
  avatar: 'photo',
  // 'none' | 'pending' | 'verified' | 'rejected'
  verification: 'none',
};

// Fields the player edits in Personal information.
export const editableFields = ['nickname', 'firstName', 'lastName', 'birthDate', 'country', 'city', 'address', 'postalCode'];

// Ready-made avatars: the existing photo plus initials on brand gradients.
export const avatars = [
  { id: 'photo', label: 'Photo', image: 'user-avatar.webp' },
  { id: 'violet', label: 'Violet', gradient: 'linear-gradient(135deg, #d13df2, #762cff)' },
  { id: 'cosmic', label: 'Cosmic', gradient: 'linear-gradient(135deg, #3ed7ff, #6a3cff)' },
  { id: 'ember', label: 'Ember', gradient: 'linear-gradient(135deg, #ffc451, #ef43e7)' },
  { id: 'mint', label: 'Mint', gradient: 'linear-gradient(135deg, #42e6b2, #2c7bff)' },
  { id: 'rose', label: 'Rose', gradient: 'linear-gradient(135deg, #ff5c7a, #8b35ff)' },
];
export const findAvatar = (id) => avatars.find((a) => a.id === id) ?? avatars[0];

export const countries = [
  ['AU', 'Australia'], ['AT', 'Austria'], ['BR', 'Brazil'], ['CA', 'Canada'], ['CY', 'Cyprus'],
  ['DE', 'Germany'], ['ES', 'Spain'], ['FI', 'Finland'], ['IE', 'Ireland'], ['IT', 'Italy'],
  ['JP', 'Japan'], ['MT', 'Malta'], ['NL', 'Netherlands'], ['NZ', 'New Zealand'], ['NO', 'Norway'],
  ['PL', 'Poland'], ['PT', 'Portugal'], ['SE', 'Sweden'], ['GB', 'United Kingdom'],
];
export const countryName = (code) => countries.find(([c]) => c === code)?.[1] ?? '';

export const verificationStatus = {
  none: { label: 'Not verified', tone: 'muted' },
  pending: { label: 'Pending', tone: 'warning' },
  verified: { label: 'Verified', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
};

export const rejectionReason = 'The document photo was blurry and the expiry date could not be read. Upload a sharp photo of the whole document.';

export const documentTypes = [
  { value: 'passport', label: 'Passport' },
  { value: 'id', label: 'National ID card' },
  { value: 'license', label: 'Driving licence' },
];

export const formatDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
