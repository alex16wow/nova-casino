import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import GameCard from '../../components/ui/GameCard.jsx';
import Modal from '../../components/ui/Modal.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { Heart } from '../../components/ui/icons.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { findGame } from '../../data/games.js';

// Favorites (/favorites): the player's saved games, newest first, in the catalog grid. No category strip.
export default function FavoritesPage() {
  const { favorites, clearFavorites } = usePlayer();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const games = favorites.map((slug) => [slug, findGame(slug)]).filter(([, game]) => game);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const clear = () => { clearFavorites(); setConfirm(false); };

  return (
    <div className="nv-catalog nv-favorites">
      <section className="section nv-catalog-section">
        <div className="section-head nv-catalog-head">
          <h1 className="section-title-with-icon">
            <span className="section-title-icon nv-favorites-icon" aria-hidden="true"><Heart /></span>
            <span>Favorites</span>
          </h1>
          <span className="spacer" />
          {games.length > 0 && <Button variant="secondary" size="sm" onClick={() => setConfirm(true)}>Clear All</Button>}
        </div>
        {games.length ? (
          <div className="nv-catalog-grid">
            {games.map(([slug, game]) => <GameCard key={slug} game={game} />)}
          </div>
        ) : (
          <StateMessage
            kind="favorites"
            title="No Favorites Yet"
            text="You haven’t added any games to your favorites. Click the heart icon on any game to save it here."
            action="Explore Games"
            onAction={() => navigate('/lobby')}
          />
        )}
      </section>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Clear All Favorites?" subtitle="Are you sure you want to remove all games from your favorites?" size="confirm">
        <div className="nv-form-row">
          <Button variant="secondary" className="nv-grow" data-autofocus onClick={() => setConfirm(false)}>Cancel</Button>
          <Button className="nv-grow" onClick={clear}>Clear All</Button>
        </div>
      </Modal>
    </div>
  );
}
