import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { LevelEmblem } from '../../components/ui/icons.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { accountSection } from '../../data/account.js';

const format = (n) => n.toLocaleString('en-US');

// Current level and XP from the shared player state (same numbers as the header).
export default function LevelCard() {
  const { level } = usePlayer();
  const navigate = useNavigate();
  const toast = useToast();
  const bonuses = accountSection('bonuses');
  const percent = Math.round((level.xp / level.xpMax) * 100);

  const openBonuses = () => (bonuses.live ? navigate(bonuses.to) : toast(`${bonuses.label}: coming soon`));

  return (
    <section className="nv-panel nv-profile-level" aria-labelledby="profileLevelTitle">
      <div className="nv-profile-level-top">
        <span className="nv-profile-level-emblem"><LevelEmblem /></span>
        <div>
          <h2 id="profileLevelTitle">Level {level.level}</h2>
          <p>{format(level.xp)} / {format(level.xpMax)} XP</p>
        </div>
        <span className="nv-profile-level-percent">{percent}%</span>
      </div>
      <div className="nv-progress" role="progressbar" aria-label={`Progress to Level ${level.next.level}`} aria-valuemin="0" aria-valuemax={level.xpMax} aria-valuenow={level.xp}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className="nv-profile-level-next"><strong>{level.next.xpLeft} XP</strong> to Level {level.next.level}: {level.next.reward}</p>
      <Button variant="secondary" size="sm" block onClick={openBonuses}>View bonuses</Button>
    </section>
  );
}
