import { useSupport } from '../../context/SupportContext.jsx';
import { articleById, categoryById } from '../../data/support.js';
import { ChevronRight } from '../ui/icons.jsx';
import { SupportHeader, SupportScroll } from './SupportFrame.jsx';
import { FaceIcon } from './supportIcons.jsx';

const moods = [
  ['bad', 'Not helpful'],
  ['ok', 'Somewhat helpful'],
  ['good', 'Helpful'],
];

function Block({ block }) {
  if (block.h) return <h3>{block.h}</h3>;
  if (block.ul) return <ul>{block.ul.map((item) => <li key={item}>{item}</li>)}</ul>;
  if (block.ol) return <ol>{block.ol.map((item) => <li key={item}>{item}</li>)}</ol>;
  return <p>{block.p}</p>;
}

// One help article inside the panel, with related links and a rating.
export default function SupportArticle({ id, screenKey }) {
  const { state, openArticle, rate } = useSupport();
  const article = articleById(id);
  const rating = state.ratings[id];
  return (
    <>
      <SupportHeader back title={categoryById(article.category).title} />
      <SupportScroll screenKey={screenKey}>
        <article className="nv-support-article" aria-labelledby="nv-support-title">
          <h2 id="nv-support-title">{article.title}</h2>
          {article.summary && <p className="nv-support-article-lead">{article.summary}</p>}
          {article.body.map((block, i) => <Block key={i} block={block} />)}
        </article>

        <section className="nv-support-related" aria-label="Related articles">
          <h3>Related articles</h3>
          {article.related.map(articleById).map((a) => (
            <button key={a.id} type="button" className="nv-support-row is-compact" onClick={() => openArticle(a.id)}>
              <span className="nv-support-row-text"><b>{a.title}</b></span>
              <ChevronRight />
            </button>
          ))}
        </section>

        <section className="nv-support-rating" aria-label="Rate this article">
          <h3>Was this helpful?</h3>
          <div className="nv-support-rating-options">
            {moods.map(([mood, label]) => (
              <button key={mood} type="button" className={`is-${mood}`} aria-label={label} aria-pressed={rating === mood} onClick={() => rate(id, mood)}>
                <FaceIcon mood={mood} />
              </button>
            ))}
          </div>
          <p className="nv-support-rating-thanks" aria-live="polite">{rating ? 'Thanks for your feedback' : ' '}</p>
        </section>
      </SupportScroll>
    </>
  );
}
