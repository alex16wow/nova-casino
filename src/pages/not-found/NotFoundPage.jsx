import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Unknown address inside the app. Hides the desktop sidebar and centres the message in the visible screen.
export default function NotFoundPage() {
  const section = useRef(null);

  useLayoutEffect(() => {
    const root = document.documentElement, el = section.current;
    root.classList.add('page-bare');
    const fit = () => {
      el.style.minHeight = '';
      const top = el.getBoundingClientRect().top + window.scrollY;
      el.style.minHeight = `${Math.max(320, window.innerHeight - top)}px`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => { root.classList.remove('page-bare'); window.removeEventListener('resize', fit); };
  }, []);

  return (
    <section ref={section} className="nv-page-message" aria-labelledby="notFoundTitle">
      <span className="nv-page-code" aria-hidden="true">404</span>
      <h1 id="notFoundTitle">This page took a wrong turn</h1>
      <p>The page you’re looking for doesn’t exist or has moved. Head back to the main page to keep playing.</p>
      <Link className="nv-btn nv-btn--primary nv-btn--lg" to="/"><span className="nv-btn-label">Back to Main Page</span></Link>
    </section>
  );
}
