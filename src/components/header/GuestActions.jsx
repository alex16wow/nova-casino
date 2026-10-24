import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../ui/Button.jsx';

// Log in / Sign up shown to guests in the header (compact on phones).
export default function GuestActions() {
  const { openAuth } = useAuth();
  return (
    <div className="guest-actions">
      <Button variant="secondary" onClick={() => openAuth('login')}>Log in</Button>
      <Button onClick={() => openAuth('register')}>Sign up</Button>
    </div>
  );
}
