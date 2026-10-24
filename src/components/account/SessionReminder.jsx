import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { readJSON, writeJSON } from '../../lib/storage.js';
import Button from '../ui/Button.jsx';
import Modal from '../ui/Modal.jsx';

// Session reminder (Settings → Responsible gaming): every 30 / 60 minutes of a signed-in visit
// a dialog says how long the session has lasted. The visit start is kept for this tab only.
const KEY = 'nova-visit-start';

export default function SessionReminder() {
  const { user } = useAuth();
  const { settings, reminderOpen, openReminder, closeReminder } = useSettings();
  const [started, setStarted] = useState(null);
  const shown = useRef(0);
  const minutes = settings.reminder;

  useEffect(() => {
    if (!user) { writeJSON(KEY, null, { session: true }); setStarted(null); return; }
    const saved = readJSON(KEY, null, { session: true });
    const start = typeof saved === 'number' ? saved : Date.now();
    writeJSON(KEY, start, { session: true });
    setStarted(start);
  }, [user]);

  useEffect(() => {
    if (!started || !minutes) return;
    shown.current = Math.floor((Date.now() - started) / (minutes * 6e4));
    const timer = setInterval(() => {
      const passed = Math.floor((Date.now() - started) / (minutes * 6e4));
      if (passed > shown.current) { shown.current = passed; openReminder(); }
    }, 15e3);
    return () => clearInterval(timer);
  }, [started, minutes, openReminder]);

  const elapsed = started ? Math.max(1, Math.round((Date.now() - started) / 6e4)) : 0;
  return (
    <Modal open={reminderOpen && Boolean(user)} onClose={closeReminder} title="Time check" size="sm">
      <div className="nv-form">
        <p className="nv-modal-text">You’ve been on NOVA Casino for <b>{elapsed} {elapsed === 1 ? 'minute' : 'minutes'}</b>. Take a moment to decide if you want to keep playing.</p>
        <div className="nv-modal-actions">
          <Link className="nv-btn nv-btn--secondary nv-btn--md" to="/account/settings#rg" onClick={closeReminder}>Limits and breaks</Link>
          <Button onClick={closeReminder} data-autofocus>Continue</Button>
        </div>
      </div>
    </Modal>
  );
}
