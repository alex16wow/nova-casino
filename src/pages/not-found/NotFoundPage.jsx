import { Link } from 'react-router-dom';

// Unknown address inside the app.
export default function NotFoundPage() {
  return (
    <section className="nv-page-message" aria-labelledby="notFoundTitle">
      <span className="nv-page-code" aria-hidden="true">404</span>
      <h1 id="notFoundTitle">This page took a wrong turn</h1>
      <p>The page you’re looking for doesn’t exist or has moved. Head back to the lobby to keep playing.</p>
      <Link className="nv-btn nv-btn--primary nv-btn--lg" to="/"><span className="nv-btn-label">Back to lobby</span></Link>
    </section>
  );
}
