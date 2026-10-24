import { asset } from '../../lib/asset.js';

// Section heading with its category icon. Extra content (links, arrows) goes in children.
export function SectionTitle({ icon, title, id }) {
  return (
    <h2 id={id} className="section-title-with-icon">
      <img className="section-title-icon" src={asset(icon)} alt="" width="48" height="48" />
      <span>{title}</span>
    </h2>
  );
}

export default function SectionHead({ icon, title, sub, href, children }) {
  return (
    <div className="section-head">
      <SectionTitle icon={icon} title={title} />
      {sub && <span className="sub">{sub}</span>}
      <span className="spacer" />
      {href && <a className="view-all" href={href}>View All&nbsp; ›</a>}
      {children}
    </div>
  );
}
