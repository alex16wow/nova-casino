import { useEffect } from 'react';
import Button from '../../components/ui/Button.jsx';
import { useSupport } from '../../context/SupportContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { infoPages } from '../../data/info.js';

// Shared template for the footer information pages: title, intro, a few sections. Content lives in src/data/info.js.
export default function InfoPage({ page }) {
  const { title, intro, note, sections } = infoPages[page];
  const toast = useToast();
  const { toggle } = useSupport();
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

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
          {s.text?.map((t) => <p key={t}>{t}</p>)}
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
                  <div>
                    <h3>{j.title}</h3>
                    <span className="nv-info-meta">{j.meta}</span>
                    <p>{j.text}</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => toast('Applications will open soon')}>Apply</Button>
                </div>
              ))}
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
