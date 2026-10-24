import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useDismiss } from '../../hooks/useDismiss.js';
import { CheckSmall, LevelEmblem, MenuIcon, RewardChest } from '../ui/icons.jsx';

const format = (n) => n.toLocaleString('en-US');

// Level, XP progress and the level rewards popup. Rendered in the header or the mobile dock.
export default function PlayerLevel({ open, setOpen }) {
  const { level, rewards, claimReward } = usePlayer();
  const toggle = useRef(null), panel = useRef(null);
  const available = rewards.filter((r) => !r.claimed).length;
  const percent = Math.round((level.xp / level.xpMax) * 100);

  useDismiss(open, () => setOpen(false), [toggle, panel], { onEscape: () => toggle.current?.focus() });

  const onToggleKey = (e) => {
    if (e.key !== 'ArrowDown') return;
    e.preventDefault();
    flushSync(() => setOpen(true));
    panel.current.querySelector('.reward-claim')?.focus();
  };

  return (
    <div className="player-level" aria-label={`Player level ${level.level}, ${level.xp} out of ${level.xpMax} XP`}>
      <LevelEmblem />
      <div className="level-details">
        <div className="level-label">Level {level.level}</div>
        <div className="level-xp">{format(level.xp)} / {format(level.xpMax)} XP</div>
        <div className="level-progress" role="progressbar" aria-label="Experience" aria-valuemin="0" aria-valuemax={level.xpMax} aria-valuenow={level.xp}><span /></div>
      </div>
      <button
        ref={toggle}
        className="level-rewards"
        id="rewardsToggle"
        aria-label={available ? `Level rewards: ${available} available bonuses` : 'Level rewards: all bonuses claimed'}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="rewardsPanel"
        onClick={() => setOpen(!open)}
        onKeyDown={onToggleKey}
      >
        <RewardChest />
        <span className="count-badge" aria-hidden="true" hidden={!available} style={available ? undefined : { display: 'none' }}>{available}</span>
      </button>
      <section ref={panel} className="rewards-panel" id="rewardsPanel" hidden={!open} role="dialog" aria-labelledby="rewardsHeading">
        <div className="rewards-heading">
          <div>
            <h2 id="rewardsHeading">Level Rewards</h2>
            <p className="rewards-status" role="status" aria-live="polite">{available ? `${available} bonuses ready to claim` : 'All rewards claimed'}</p>
          </div>
          <span className="rewards-level-label">Level {level.level}</span>
        </div>
        <div className="next-level-reward">
          <div className="next-level-topline"><span>YOUR NEXT REWARD</span><span className="next-level-tag">Level {level.next.level}</span></div>
          <h3>{level.next.reward}</h3>
          <p>Unlock your next level reward with <strong>{level.next.xpLeft} more XP</strong>.</p>
          <div className="next-level-progress" role="progressbar" aria-label={`Progress to Level ${level.next.level}`} aria-valuemin="0" aria-valuemax={level.xpMax} aria-valuenow={level.xp}><span /></div>
          <div className="next-level-progress-labels"><span>{format(level.xp)} / {format(level.xpMax)} XP</span><span>{percent}%</span></div>
        </div>
        <div className="rewards-list">
          {rewards.map((reward) => (
            <article key={reward.id} className={`reward-item${reward.claimed ? ' is-claimed' : ''}`}>
              <span className="reward-icon"><MenuIcon name="gift" /></span>
              <div className="reward-info">
                <h3>{reward.title}</h3>
                <p className="reward-description">{reward.description}</p>
                <div className="reward-meta">
                  <span>{reward.level}</span>
                  <span className="reward-action">
                    {reward.claimed ? (
                      <span className="reward-claimed"><CheckSmall />Claimed</span>
                    ) : (
                      <button type="button" className="primary reward-claim" aria-label={`Get Bonus: ${reward.title}`} onClick={() => { claimReward(reward.id); toggle.current?.focus(); }}>Get Bonus</button>
                    )}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
