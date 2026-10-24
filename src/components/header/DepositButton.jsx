import { usePreviewAction } from '../../context/ToastContext.jsx';
import { Plus } from '../ui/icons.jsx';

// Full "Deposit" button on desktop, a compact plus inside the wallet on touch layouts.
export default function DepositButton({ compact }) {
  const preview = usePreviewAction();
  return compact ? (
    <button className="primary action-toast mobile-deposit" aria-label="Deposit" onClick={preview}><Plus /></button>
  ) : (
    <button className="primary action-toast" onClick={preview}>Deposit</button>
  );
}
