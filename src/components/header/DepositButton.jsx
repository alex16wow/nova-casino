import { useNavigate } from 'react-router-dom';
import { Plus } from '../ui/icons.jsx';

// Full "Deposit" button on desktop, a compact plus inside the wallet on touch layouts. Both open Wallet on the Deposit tab.
export default function DepositButton({ compact }) {
  const navigate = useNavigate();
  const open = () => navigate('/account/wallet?tab=deposit');
  return compact ? (
    <button className="primary mobile-deposit" aria-label="Deposit" onClick={open}><Plus /></button>
  ) : (
    <button className="primary" onClick={open}>Deposit</button>
  );
}
