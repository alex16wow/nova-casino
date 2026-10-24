import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { demoProfile } from '../data/profile.js';
import { readJSON, writeJSON } from '../lib/storage.js';
import { useAuth } from './AuthContext.jsx';

// The demo player's profile: personal details, avatar and verification status.
// Kept in localStorage so edits survive navigation and reloads. Email comes from the session.
const ProfileContext = createContext(null);
const KEY = 'nova-profile';

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(() => ({ ...demoProfile, ...readJSON(KEY, {}) }));

  useEffect(() => { writeJSON(KEY, saved); }, [saved]);

  const updateProfile = useCallback((patch) => setSaved((p) => ({ ...p, ...patch })), []);

  const value = useMemo(() => ({
    profile: { ...saved, email: user?.email ?? saved.email },
    updateProfile,
    setAvatar: (avatar) => updateProfile({ avatar }),
    setVerification: (verification) => updateProfile({ verification }),
    resetProfile: () => setSaved(demoProfile),
  }), [saved, user, updateProfile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export const useProfile = () => useContext(ProfileContext);
