import { Component } from 'react';
import Button from '../ui/Button.jsx';

// Catches a crash inside a page so the header and navigation keep working.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <section className="nv-page-message" role="alert">
        <span className="nv-page-code" aria-hidden="true">Oops</span>
        <h1>Something went wrong</h1>
        <p>This part of the page failed to load. Reload to try again — your balance and progress are safe.</p>
        <Button size="lg" onClick={() => location.reload()}>Reload page</Button>
      </section>
    );
  }
}
