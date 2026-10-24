import { useRef } from 'react';
import { useSupport } from '../../context/SupportContext.jsx';
import { articlesIn, categoryById, helpCategories, searchArticles } from '../../data/support.js';
import Button from '../ui/Button.jsx';
import { ChevronRight, Close } from '../ui/icons.jsx';
import { SupportHeader, SupportScroll } from './SupportFrame.jsx';
import { SearchIcon } from './supportIcons.jsx';

const count = (n) => `${n} article${n === 1 ? '' : 's'}`;

// Help tab: search over all articles, or the list of categories.
export function SupportHelp({ screenKey }) {
  const { state, setQuery, openCategory, openArticle, openChat } = useSupport();
  const input = useRef(null);
  const query = state.query;
  const results = searchArticles(query);
  const searching = query.trim() !== '';

  return (
    <>
      <SupportHeader title="Help" titleId="nv-support-title" />
      <div className="nv-support-search">
        <SearchIcon />
        <input
          ref={input}
          type="search"
          value={query}
          placeholder="Search for help"
          aria-label="Search for help"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape' && query) { e.stopPropagation(); setQuery(''); } }}
        />
        {query && (
          <button type="button" className="nv-support-icon-btn" aria-label="Clear search" onClick={() => { setQuery(''); input.current.focus(); }}>
            <Close />
          </button>
        )}
      </div>
      <SupportScroll screenKey={searching ? `${screenKey}?search` : screenKey}>
        {!searching ? (
          <ul className="nv-support-list" aria-label="Help categories">
            {helpCategories.map((c) => (
              <li key={c.id}>
                <button type="button" className="nv-support-row" onClick={() => openCategory(c.id)}>
                  <span className="nv-support-row-text">
                    <b>{c.title}</b>
                    <span>{c.description}</span>
                    <small>{count(articlesIn(c.id).length)}</small>
                  </span>
                  <ChevronRight />
                </button>
              </li>
            ))}
          </ul>
        ) : results.length ? (
          <>
            <p className="nv-support-list-label" aria-live="polite">{count(results.length)} found</p>
            <ul className="nv-support-list">
              {results.map(({ article, snippet }) => (
                <li key={article.id}>
                  <button type="button" className="nv-support-row" onClick={() => openArticle(article.id)}>
                    <span className="nv-support-row-text">
                      <b>{article.title}</b>
                      <span>{snippet}</span>
                    </span>
                    <ChevronRight />
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="nv-support-empty" aria-live="polite">
            <span className="nv-support-empty-icon"><SearchIcon /></span>
            <b>No articles found</b>
            <p>Try different words, or ask our team directly.</p>
            <Button variant="secondary" size="sm" onClick={openChat}>Send us a message</Button>
          </div>
        )}
      </SupportScroll>
    </>
  );
}

// Articles of one category.
export function SupportCategory({ id, screenKey }) {
  const { openArticle } = useSupport();
  const category = categoryById(id);
  const articles = articlesIn(id);
  return (
    <>
      <SupportHeader back title={category.title} titleId="nv-support-title" />
      <SupportScroll screenKey={screenKey}>
        <div className="nv-support-category-intro">
          <p>{category.description}</p>
          <small>{count(articles.length)}</small>
        </div>
        <ul className="nv-support-list">
          {articles.map((a) => (
            <li key={a.id}>
              <button type="button" className="nv-support-row is-compact" onClick={() => openArticle(a.id)}>
                <span className="nv-support-row-text"><b>{a.title}</b></span>
                <ChevronRight />
              </button>
            </li>
          ))}
        </ul>
      </SupportScroll>
    </>
  );
}
