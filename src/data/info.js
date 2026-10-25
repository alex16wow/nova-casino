// Footer information pages (/about, /faq, /terms, …). Demo copy only: no real licences, addresses or legal entities.
// Section shapes: text (paragraphs), list (bullets), cards (small dark cards), jobs (cards with Apply), qa (questions and answers).

const LEGAL_NOTE = 'This is demonstration text for a design prototype. It is not a legal document and does not describe a real operator.';

export const infoPages = {
  about: {
    title: 'About us',
    intro: 'NOVA Casino is an online casino concept built around a simple idea: a fast, clear and good-looking place to play, where every step from sign-up to withdrawal is easy to follow.',
    sections: [
      { title: 'Who we are', text: ['NOVA brings together slots, live tables, game shows and tournaments from established providers in one lobby. We focus on a clean interface, quick payments and support that answers like a person, not a script.'] },
      { title: 'What you get', list: ['Thousands of games from leading studios, sorted into clear categories', 'Promotions, tournaments and a loyalty club with rewards at every level', 'Deposits and withdrawals in cards, e-wallets and crypto', 'Account tools for limits, breaks and self-exclusion'] },
      { title: 'Our principles', cards: [
        { title: 'Clarity', text: 'Bonus terms, limits and balances are shown in plain words, where you need them.' },
        { title: 'Fairness', text: 'Games run on certified random number generators from their providers.' },
        { title: 'Care', text: 'Responsible gaming tools are part of every account, not hidden in settings.' },
      ] },
    ],
  },

  'responsible-gaming': {
    title: 'Responsible gaming',
    intro: 'Gaming should stay entertainment. These tips and account tools help you keep control of your time and money.',
    sections: [
      { title: 'Play with a plan', list: ['Decide on a budget before you start and treat it as the cost of entertainment', 'Never chase losses or play with money meant for bills and savings', 'Set a time limit and take regular breaks', 'Avoid playing when you are upset, tired or under the influence'] },
      { title: 'Tools in your account', cards: [
        { title: 'Deposit limits', text: 'Cap how much you can deposit per day, week or month.' },
        { title: 'Take a break', text: 'Pause your account for 24 hours up to several weeks.' },
        { title: 'Self-exclusion', text: 'Close access to your account for a longer period.' },
      ], text: ['You can find these tools in Account → Settings → Responsible gaming.'] },
      { title: 'Warning signs', text: ['If gaming takes more time or money than you planned, causes arguments, or feels like a way to escape problems, it may be time to stop. Our Support team can help you set limits or close your account at any moment.'] },
      { title: 'Players under 18', text: ['NOVA is for adults only. Accounts of players under 18 are closed, and any deposits are returned.'] },
    ],
  },

  careers: {
    title: 'Careers',
    intro: 'We are a small product team building a casino that feels as good as the best consumer apps. If you care about details, we would like to meet you.',
    sections: [
      { title: 'How we work', text: ['Remote-first, small teams, short feedback loops. Designers, engineers and support work side by side and ship together.'] },
      { title: 'Open positions', jobs: [
        { title: 'Senior Frontend Engineer', meta: 'Engineering · Remote · Full-time', text: 'Build the lobby, game pages and account area in React with a focus on speed and polish.' },
        { title: 'Product Designer', meta: 'Design · Remote · Full-time', text: 'Own flows from sign-up to withdrawal and keep the NOVA design system consistent.' },
        { title: 'Player Support Specialist', meta: 'Support · Remote · Shifts', text: 'Help players with accounts, payments and bonuses through live chat and email.' },
      ] },
      { title: 'What we offer', list: ['Flexible hours and remote work', 'Learning budget and conference days', 'Modern equipment of your choice'] },
    ],
  },

  faq: {
    title: 'FAQ',
    intro: 'Quick answers to the most common questions about accounts, games, bonuses and payments.',
    sections: [
      { title: 'Account', qa: [
        ['How do I create an account?', 'Click Sign up, enter your email and a password, choose a welcome bonus and confirm that you are over 18.'],
        ['I forgot my password. What should I do?', 'Open Log in and choose “Forgot password”. We will send a reset link to your email.'],
        ['Why do I need to verify my account?', 'Verification protects your account and is required before your first withdrawal. You can upload documents in My profile.'],
      ] },
      { title: 'Games', qa: [
        ['Can I play without an account?', 'You can browse all games, but you need to log in to play.'],
        ['What happens if my connection drops during a game?', 'The round is completed on the provider’s server, and the result appears in your balance.'],
      ] },
      { title: 'Bonuses', qa: [
        ['What are wagering requirements?', 'The amount you need to bet before bonus funds can be withdrawn. Each bonus shows its requirement and progress in Bonuses.'],
      ] },
      { title: 'Payments', qa: [
        ['Which payment methods are available?', 'Cards, Skrill, NETELLER and popular cryptocurrencies. Available methods are shown in Wallet.'],
        ['How long do withdrawals take?', 'Crypto withdrawals are usually processed within an hour; cards and e-wallets may take 1–3 business days.'],
      ] },
    ],
  },

  contact: {
    title: 'Contact us',
    intro: 'The fastest way to reach us is live chat in Support. Our team is available around the clock.',
    sections: [
      { title: 'Ways to reach us', cards: [
        { title: 'Live chat', text: 'Answers in a few minutes, 24/7. Open Support from the menu or below.', support: true },
        { title: 'Help center', text: 'Step-by-step articles about accounts, payments and bonuses inside Support.' },
        { title: 'Social media', text: 'News and announcements on Discord, Telegram, X and YouTube.' },
      ] },
      { title: 'Before you write', list: ['Log in, so we can find your account faster', 'Describe the issue and the time it happened', 'For payments, add the amount and payment method'] },
    ],
  },

  terms: {
    title: 'Terms & Conditions',
    intro: 'These terms describe how you can use NOVA Casino. By creating an account you agree to them.',
    note: LEGAL_NOTE,
    sections: [
      { title: '1. Eligibility', text: ['You must be at least 18 years old and allowed to play online casino games where you live. One account per person is allowed.'] },
      { title: '2. Your account', text: ['Keep your login details private and your personal data up to date. We may ask you to verify your identity before withdrawals.'] },
      { title: '3. Deposits and withdrawals', text: ['Deposits are credited after the payment is confirmed. Withdrawals are made to a method in your name and may require verification.'] },
      { title: '4. Bonuses', text: ['Each bonus has its own terms, such as wagering requirements, maximum bet and expiry date. These terms are shown with the bonus.'] },
      { title: '5. Changes and closure', text: ['We may update these terms and will notify you of important changes. You can close your account at any time through Support.'] },
    ],
  },

  privacy: {
    title: 'Privacy policy',
    intro: 'This policy explains what data NOVA Casino collects, why we need it and how you can control it.',
    note: LEGAL_NOTE,
    sections: [
      { title: 'Data we collect', list: ['Account details: email, name, date of birth and contact information', 'Verification documents you upload', 'Payment and transaction history', 'Technical data such as device, browser and IP address'] },
      { title: 'How we use it', text: ['To run your account, process payments, prevent fraud, meet legal requirements and improve the site. We do not sell your personal data.'] },
      { title: 'Cookies', text: ['We use cookies to keep you logged in, remember your preferences and understand how the site is used.'] },
      { title: 'Your rights', text: ['You can request a copy of your data, ask us to correct it or delete it, and manage notifications in Settings. Contact Support for any privacy request.'] },
    ],
  },

  'fair-play': {
    title: 'Fair play',
    intro: 'Every result at NOVA Casino is random and cannot be influenced by us or by players. Here is how that works.',
    sections: [
      { title: 'Random number generator', text: ['Slots and digital table games use a random number generator (RNG): an algorithm that produces thousands of unpredictable numbers per second. The moment you press Spin, the current number decides the outcome.', 'Each round is independent. Previous wins or losses do not change the chances of the next spin.'] },
      { title: 'How fairness is ensured', cards: [
        { title: 'Provider servers', text: 'Games run on the providers’ servers, not on ours, so results cannot be changed by the casino.' },
        { title: 'Independent testing', text: 'Game providers have their RNG and payout rates tested by independent labs.' },
        { title: 'Live games', text: 'Live tables use real cards, wheels and dealers streamed in real time.' },
      ] },
      { title: 'Return to player', text: ['RTP shows the share of all bets a game returns to players over a very long period, for example 96%. It is a long-term average and does not predict a single session.'] },
    ],
  },
};
