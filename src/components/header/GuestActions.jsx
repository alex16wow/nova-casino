import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../ui/Button.jsx';

// Log in / Sign up shown to guests in the header and, on phones, in the bottom dock.
export default function GuestActions({ dock }) {
  const { openAuth } = useAuth();
  return (
    <div className={`guest-actions${dock ? ' guest-actions--dock' : ''}`}>
      <Button variant="secondary" onClick={() => openAuth('login')}>Log in</Button>
      <Button onClick={() => openAuth('register')}>Sign up</Button>
    </div>
  );
}
