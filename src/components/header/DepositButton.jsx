import { usePlayer } from '../../context/PlayerContext.jsx';
import { Plus } from '../ui/icons.jsx';

// Full "Deposit" button on desktop, a compact plus inside the wallet on touch layouts. Both open the deposit dialog.
export default function DepositButton({ compact }) {
  const { openDeposit: open } = usePlayer();
  return compact ? (
    <button className="primary mobile-deposit" aria-label="Deposit" onClick={open}><Plus /></button>
  ) : (
    <button className="primary" onClick={open}>Deposit</button>
  );
}
