import { useEffect } from 'react';
import Button from '../../components/ui/Button.jsx';
import FaqList from '../../components/ui/FaqList.jsx';
import { SocialIcon } from '../../components/ui/icons.jsx';
import { useSupport } from '../../context/SupportContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { infoPages } from '../../data/info.js';
import { socialLinks } from '../../data/navigation.js';
import { copyText } from '../../lib/clipboard.js';

const glyph = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
// Line icons for job and contact cards.
const cardIcons = {
  code: <svg {...glyph}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="m9 10-2.5 2L9 14m6-4 2.5 2-2.5 2m-1.5-5-3 6" /></svg>,
  design: <svg {...glyph}><path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.5-1.3-1.6-1.3-2.8 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3Z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7" r="1" /><circle cx="15" cy="7.5" r="1" /></svg>,
  headset: <svg {...glyph}><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M19 19c0 1.7-2.2 2.5-5 2.5h-2" /></svg>,
  chat: <svg {...glyph}><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 9.5h8M8 12.5h5" /></svg>,
  briefcase: <svg {...glyph}><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18M11 12.5v2h2v-2" /></svg>,
};
const CardIcon = ({ name }) => <span className="nv-info-icon" aria-hidden="true">{cardIcons[name]}</span>;

// Shared template for the footer information pages: title, intro, a few sections. Content lives in src/data/info.js.
export default function InfoPage({ page }) {
  const { title, intro, note, sections } = infoPages[page];
  const toast = useToast();
  const { toggle } = useSupport();
  useEffect(() => { window.scrollTo(0, 0); }, [page]);
  const copyEmail = async (email) => toast((await copyText(email)) ? 'Email copied' : 'Couldn’t copy. Select the email and copy it manually');

  return (
    <article className="nv-info">
      <header className="nv-info-head">
        <h1>{title}</h1>
        <p className="nv-info-intro">{intro}</p>
        {note && <p className="nv-info-note">{note}</p>}
      </header>

      {sections.map((s) => (
        <section key={s.title} className="nv-info-section">
          <h2>{s.title}</h2>
          {s.body?.map((b, i) => (typeof b === 'string' ? <p key={i}>{b}</p>
            : b.list ? <ul key={i} className="nv-info-list">{b.list.map((t) => <li key={t}>{t}</li>)}</ul>
              : <p key={i} className="nv-info-callout">{b.callout}</p>))}
          {s.text?.map((t) => <p key={t}>{t}</p>)}
          {s.tip && <p className="nv-info-callout">{s.tip}</p>}
          {s.list && <ul className="nv-info-list">{s.list.map((t) => <li key={t}>{t}</li>)}</ul>}
          {s.cards && (
            <div className="nv-info-cards">
              {s.cards.map((c) => (
                <div key={c.title} className="nv-info-card">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  {c.support && <Button size="sm" onClick={toggle}>Open Support</Button>}
                </div>
              ))}
            </div>
          )}
          {s.jobs && (
            <div className="nv-info-jobs">
              {s.jobs.map((j) => (
                <div key={j.title} className="nv-info-card nv-info-job">
                  <CardIcon name={j.icon} />
                  <div>
                    <h3>{j.title}</h3>
                    <span className="nv-info-meta">{j.meta}</span>
                    <p>{j.text}</p>
                  </div>
                  <Button size="sm" onClick={() => toast('Applications will open soon')}>Apply</Button>
                </div>
              ))}
            </div>
          )}
          {s.faq && <FaqList items={s.faq.map(([question, answer]) => ({ question, answer }))} />}
          {s.contacts && (
            <div className="nv-info-cards">
              {s.contacts.map((c) => (
                <div key={c.title} className="nv-info-card nv-info-contact">
                  <CardIcon name={c.icon} />
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <span className="nv-info-email">{c.email}</span>
                  <Button size="sm" variant="secondary" onClick={() => copyEmail(c.email)}>Copy email</Button>
                </div>
              ))}
            </div>
          )}
          {s.support && <Button onClick={toggle}>Open support</Button>}
          {s.socials && (
            <div className="nv-info-socials">
              {socialLinks.map((name) => <a key={name} href="#top" aria-label={name}><SocialIcon name={name} /><span>{name}</span></a>)}
            </div>
          )}
          {s.qa && (
            <dl className="nv-info-qa">
              {s.qa.map(([q, a]) => (
                <div key={q}>
                  <dt>{q}</dt>
                  <dd>{a}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      ))}
    </article>
  );
}
