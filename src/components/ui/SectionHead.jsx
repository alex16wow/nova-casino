import { Link } from 'react-router-dom';
import { asset } from '../../lib/asset.js';
import { NavIcon } from './icons.jsx';

// Section heading with its category icon (an image, or `glyph` — a sidebar icon name). Extra content (links, arrows) goes in children.
export function SectionTitle({ icon, glyph, title, id, as: Tag = 'h2' }) {
  return (
    <Tag id={id} className="section-title-with-icon">
      {glyph
        ? <span className="section-title-icon nv-title-glyph" aria-hidden="true"><NavIcon name={glyph} /></span>
        : <img className="section-title-icon" src={asset(icon)} alt="" width="48" height="48" />}
      <span>{title}</span>
    </Tag>
  );
}

export default function SectionHead({ icon, glyph, title, sub, to, children }) {
  return (
    <div className="section-head">
      <SectionTitle icon={icon} glyph={glyph} title={title} />
      {sub && <span className="sub">{sub}</span>}
      <span className="spacer" />
      {to && <Link className="view-all" to={to}>View All&nbsp; ›</Link>}
      {children}
    </div>
  );
}
