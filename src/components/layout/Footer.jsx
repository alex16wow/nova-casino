import { footerColumns, paymentMethods, socialLinks } from '../../data/navigation.js';
import { asset } from '../../lib/asset.js';
import { SocialIcon } from '../ui/icons.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <a className="brand" href="#top"><img className="brand-image" src={asset('nova-casino-logo.png')} alt="NOVA Casino" width="323" height="120" /></a>
      </div>
      {footerColumns.map((col) => (
        <div key={col.title}>
          <h4>{col.title}</h4>
          {col.links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </div>
      ))}
      <div className="footer-payments">
        <h4>Payments</h4>
        <div className="payment-buttons">
          {paymentMethods.map((m) => (
            <button key={m}>{m === 'Mastercard' && <span className="mc-circles"><i /><i /></span>}{m}</button>
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
