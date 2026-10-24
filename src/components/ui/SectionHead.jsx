import { Link } from 'react-router-dom';
import { asset } from '../../lib/asset.js';

// Section heading with its category icon. Extra content (links, arrows) goes in children.
export function SectionTitle({ icon, title, id, as: Tag = 'h2' }) {
  return (
    <Tag id={id} className="section-title-with-icon">
      <img className="section-title-icon" src={asset(icon)} alt="" width="48" height="48" />
      <span>{title}</span>
    </Tag>
  );
}

export default function SectionHead({ icon, title, sub, to, children }) {
  return (
    <div className="section-head">
      <SectionTitle icon={icon} title={title} />
      {sub && <span className="sub">{sub}</span>}
      <span className="spacer" />
      {to && <Link className="view-all" to={to}>View All&nbsp; ›</Link>}
      {children}
    </div>
  );
}
