import { useCallback, useEffect, useState } from 'react';
import { fetchCatalog } from '../../lib/api.js';

// Loads a category / provider page. status: 'loading' | 'ready' | 'error'; Show More keeps the cards while the next screen loads.
export function useCatalogData(page) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null, pages: 1, loadingMore: false });
  const [request, setRequest] = useState({ pages: 1, attempt: 0 });

  useEffect(() => setRequest({ pages: 1, attempt: 0 }), [page]);

  useEffect(() => {
    let live = true;
    const more = request.pages > 1;
    setState((s) => (more ? { ...s, loadingMore: true } : { status: 'loading', data: null, error: null, pages: 1, loadingMore: false }));
    fetchCatalog(page, request.pages)
      .then((data) => live && setState({ status: 'ready', data, error: null, pages: request.pages, loadingMore: false }))
      .catch((error) => live && setState((s) => (more ? { ...s, loadingMore: false } : { status: 'error', data: null, error, pages: 1, loadingMore: false })));
    return () => { live = false; };
  }, [page, request]);

  const reload = useCallback(() => setRequest((r) => ({ pages: 1, attempt: r.attempt + 1 })), []);
  const loadMore = useCallback(() => setRequest((r) => ({ ...r, pages: r.pages + 1 })), []);
  return { ...state, reload, loadMore };
}
