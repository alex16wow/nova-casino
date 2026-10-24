import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { LevelEmblem, RewardChest } from '../ui/icons.jsx';

const format = (n) => n.toLocaleString('en-US');

// Level and XP progress with the rewards chest. Rendered in the header or the mobile dock.
// The chest opens Bonuses on the Available tab; its badge counts the unclaimed level rewards.
export default function PlayerLevel() {
  const { level, availableRewards: available } = usePlayer();
  const navigate = useNavigate();

  return (
    <div className="player-level" aria-label={`Player level ${level.level}, ${level.xp} out of ${level.xpMax} XP`}>
      <LevelEmblem />
      <div className="level-details">
        <div className="level-label">Level {level.level}</div>
        <div className="level-xp">{format(level.xp)} / {format(level.xpMax)} XP</div>
        <div className="level-progress" role="progressbar" aria-label="Experience" aria-valuemin="0" aria-valuemax={level.xpMax} aria-valuenow={level.xp}><span /></div>
      </div>
      <button
        className="level-rewards"
        id="rewardsToggle"
        aria-label={available ? `Bonuses: ${available} rewards to claim` : 'Bonuses: no rewards to claim'}
        onClick={() => navigate('/account/bonuses?tab=available')}
      >
        <RewardChest />
        <span className="count-badge" aria-hidden="true" hidden={!available} style={available ? undefined : { display: 'none' }}>{available}</span>
      </button>
    </div>
  );
}
