import { usePlayer } from '../../context/PlayerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { asset } from '../../lib/asset.js';
import { Heart } from './icons.jsx';

const badges = { live: ['badge-live', 'LIVE'], fresh: ['tag-new', 'NEW'] };

// Game tile with favorite and play actions. `copy` marks a decorative duplicate used by carousels.
export default function GameCard({ game, copy, style }) {
  const { favorites, toggleFavorite } = usePlayer();
  const toast = useToast();
  const saved = favorites.has(game.name);
  const [badgeClass, badgeText] = badges[game.kind] ?? ['tag-new', ''];

  return (
    <article
      className="game-card"
      data-name={`${game.name.toLowerCase()} ${game.provider.toLowerCase()}`}
      tabIndex={0}
      aria-label={`${game.name}, ${game.provider}`}
      style={style}
      {...(copy && { 'data-carousel-copy': '', 'aria-hidden': 'true', inert: true })}
    >
      <img loading={copy ? 'eager' : 'lazy'} src={asset(game.image)} alt={game.name} />
      <span className={badgeClass}>{badgeText}</span>
      <div className="game-info"><span className="game-name">{game.name}</span><span className="game-provider">{game.provider}</span></div>
      <div className="card-hover">
        {game.kind !== 'shows' && (
          <button
            className={`heart${saved ? ' saved' : ''}`}
            aria-label={`Add ${game.name} to favorites`}
            aria-pressed={saved}
            onClick={() => toast(toggleFavorite(game.name) ? 'Added to favorites' : 'Removed from favorites')}
          >
            <Heart />
          </button>
        )}
        <div className="card-actions"><button className="play-game" data-game={game.name} onClick={() => toast(`Play: ${game.name}`)}>Play</button></div>
      </div>
    </article>
  );
}
