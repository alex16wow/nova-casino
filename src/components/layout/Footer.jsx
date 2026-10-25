import { Link } from 'react-router-dom';
import { useSupport } from '../../context/SupportContext.jsx';
import { footerColumns, paymentMethods, socialLinks } from '../../data/navigation.js';

// Small brand-coloured marks next to the payment names (Mastercard keeps its two circles).
const paymentMarks = { VISA: ['visa', ''], Skrill: ['skrill', 'S'], NETELLER: ['neteller', 'N'], Crypto: ['crypto', '₿'] };
function PaymentIcon({ name }) {
  const [kind, letter] = paymentMarks[name] ?? [];
  if (!kind) return null;
  return <span className={`pay-icon pay-icon--${kind}`} aria-hidden="true">{letter}</span>;
}
import { SocialIcon } from '../ui/icons.jsx';
import { Brand } from './Header.jsx';

export default function Footer() {
  const { toggle } = useSupport();
  // Footer "Support" opens the support panel, like Support in the sidebar.
  const onLink = (label) => (label === 'Support' ? (e) => { e.preventDefault(); toggle(); } : undefined);
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Brand />
      </div>
      {footerColumns.map((col) => (
        <div key={col.title}>
          <h4>{col.title}</h4>
          {col.links.map(([label, href]) => (href.startsWith('/')
            ? <Link key={label} to={href}>{label}</Link>
            : <a key={label} href={href} onClick={onLink(label)}>{label}</a>))}
        </div>
      ))}
      <div className="footer-payments">
        <h4>Payments</h4>
        <div className="payment-buttons">
          {paymentMethods.map((m) => (
            <button key={m}>{m === 'Mastercard' ? <span className="mc-circles"><i /><i /></span> : <PaymentIcon name={m} />}{m}</button>
          ))}
        </div>
      </div>
      <div className="footer-note">
        <span className="footer-copyright">© 2026 NOVA Casino. A design concept for demonstration.</span>
        <div className="footer-note-right">
          <span className="responsible-note">18+ &nbsp; · &nbsp; Play responsibly</span>
          <div className="social-links" aria-label="Social media">
            {socialLinks.map((name) => <a key={name} href="#top" aria-label={name}><SocialIcon name={name} /></a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
