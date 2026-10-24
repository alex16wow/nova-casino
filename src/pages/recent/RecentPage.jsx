import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import GameCard from '../../components/ui/GameCard.jsx';
import Modal from '../../components/ui/Modal.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { NavIcon } from '../../components/ui/icons.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { findGame } from '../../data/games.js';

// Recently Played (/recently-played): games the player opened, newest first, in the catalog grid.
// Guests can't open games, so they get a log-in prompt instead of a history.
export default function RecentPage() {
  const { recent, clearRecent } = usePlayer();
  const { isGuest, openAuth } = useAuth();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const games = isGuest ? [] : recent.map((slug) => [slug, findGame(slug)]).filter(([, game]) => game);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const clear = () => { clearRecent(); setConfirm(false); };

  return (
    <div className="nv-catalog nv-favorites nv-recent">
      <section className="section nv-catalog-section">
        <div className="section-head nv-catalog-head">
          <h1 className="section-title-with-icon">
            <span className="section-title-icon nv-title-glyph" aria-hidden="true"><NavIcon name="recent" /></span>
            <span>Recently Played</span>
          </h1>
          <span className="spacer" />
          {games.length > 0 && <Button variant="secondary" size="sm" onClick={() => setConfirm(true)}>Clear History</Button>}
        </div>
        {isGuest ? (
          <StateMessage
            kind="lock"
            title="Log In to See Your Games"
            text="Your recently played games will appear here once you log in and start playing."
            action="Log In"
            onAction={() => openAuth('login')}
          />
        ) : games.length ? (
          <div className="nv-catalog-grid">
            {games.map(([slug, game]) => <GameCard key={slug} game={game} />)}
          </div>
        ) : (
          <StateMessage
            kind="empty"
            title="Nothing Played Yet"
            text="Games you open will show up here, so you can jump straight back in."
            action="All Games"
            onAction={() => navigate('/lobby')}
          />
        )}
      </section>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Clear History?" subtitle="This removes all games from your Recently Played list." size="confirm">
        <div className="nv-form-row">
          <Button variant="secondary" className="nv-grow" data-autofocus onClick={() => setConfirm(false)}>Cancel</Button>
          <Button className="nv-grow" onClick={clear}>Clear History</Button>
        </div>
      </Modal>
    </div>
  );
}
