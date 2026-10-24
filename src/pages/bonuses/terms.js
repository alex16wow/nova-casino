import { formatAmount } from '../../context/PlayerContext.jsx';
import { depositBonusAmount, eligibleGames, restrictedText, wagerTarget } from '../../data/bonuses.js';

// One set of terms for cards, details and the active bonus, built from the offer or bonus record.
const money = (code, n) => `${formatAmount(code, n)} ${code}`;
export const shortDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
export const daysLeft = (iso) => Math.max(0, Math.ceil((Date.parse(iso) - Date.now()) / 86400000));
export const slotsLine = `Slots: ${eligibleGames.join(', ')}`;

export const statusInfo = {
  active: ['Active', 'success'],
  completed: ['Completed', 'muted'],
  cancelled: ['Cancelled', 'danger'],
  expired: ['Expired', 'warning'],
};

// Headline value: "10.00 EUR", "20 free spins", "Up to 50.00".
export function valueOf(x) {
  if (x.kind === 'spins') return `${x.spinsLeft ?? x.spins} free spins`;
  if (x.percent) return `${x.percent}% cashback`;
  if (x.match) return `${x.match}% up to ${formatAmount('USDT', x.cap)}`;
  return money(x.code, x.amount);
}

// Wagering sentence with its base, so the multiplier and the total always agree.
export function wageringLine(x) {
  if (x.kind === 'spins') return `Winnings: ${x.winWager}× the winnings`;
  if (x.match) {
    const example = depositBonusAmount(x, 50);
    return `${x.wager}× the bonus amount (e.g. ${formatAmount('USDT', example)} bonus → ${formatAmount('USDT', example * x.wager)} to wager)`;
  }
  if (x.amount != null) return `${x.wager}× the bonus amount (${money(x.code, x.amount)}) = ${money(x.code, wagerTarget(x))}`;
  return `${x.wager}× the cashback amount`;
}

// Short condition chips for cards.
export function keyTerms(x) {
  if (x.kind === 'spins') return [`${x.game}`, `${formatAmount(x.code, x.spinValue)} ${x.code} per spin`, `Valid ${x.days} days`];
  return [`Wagering ${x.wager}×`, x.minDeposit ? `Min deposit ${x.minDeposit}` : `Max bet ${money(x.code ?? 'USDT', x.maxBet)}`, `Valid ${x.days} days`];
}

// Rows for the details window: only the ones that apply to this bonus type.
export function termRows(x) {
  if (x.kind === 'spins') {
    return [
      ['Game', x.game],
      ['Free spins', x.spinsLeft != null && x.spinsLeft !== x.spins ? `${x.spinsLeft} of ${x.spins} left` : `${x.spins}`],
      ['Spin value', money(x.code, x.spinValue)],
      ['Total value', money(x.code, x.spins * x.spinValue)],
      ['Winnings', `Paid as bonus funds, up to ${money(x.code, x.winCap)}`],
      ['Wagering', wageringLine(x)],
      ['Valid for', `${x.days ?? 3} days after claiming`],
      ['Restrictions', `Spins work only in ${x.game}. Unused spins expire.`],
    ];
  }
  const code = x.code ?? 'USDT';
  const rows = [];
  if (x.match) {
    rows.push(['Bonus', `${x.match}% of your deposit, up to ${formatAmount(code, x.cap)} (${x.currencies.join(', ')})`]);
    rows.push(['Minimum deposit', `${x.minDeposit} in the deposit currency`]);
  } else if (x.percent) {
    rows.push(['Cashback', `${x.percent}% of weekend net losses, up to ${money(code, x.cap)}`]);
  } else {
    rows.push(['Bonus amount', money(code, x.amount)]);
    if (x.deposit) rows.push(['From deposit', money(code, x.deposit)]);
  }
  rows.push(['Wagering', wageringLine(x)]);
  rows.push(['Max bet while wagering', x.match ? `${x.maxBet} in the bonus currency` : money(code, x.maxBet)]);
  rows.push(['Valid for', `${x.days ?? 7} days after activation`]);
  rows.push(['Eligible games', slotsLine]);
  rows.push(['Restrictions', `${restrictedText} One money bonus can be active at a time. Bonus funds can’t be withdrawn until wagering is complete.`]);
  return rows;
}
