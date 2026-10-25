// Footer information pages (/about, /faq, /terms, …). Demo copy only: no real licences, addresses or legal entities.
// Section shapes: text (paragraphs), list (bullets), cards (small dark cards), jobs (cards with Apply), faq (expandable Q&A),
// contacts (email cards with Copy), support (Open support button), tip (highlighted note), socials (footer social links),
// body (ordered blocks: paragraph strings, { list }, { callout }).

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
    intro: 'Quick answers to the questions players ask most often. Can’t find yours? Our Support team is available 24/7.',
    sections: [
      { title: 'Account', faq: [
        ['How do I create an account?', 'Click Sign up, enter your email and a password, pick a welcome bonus and confirm you are over 18. That’s it.'],
        ['I forgot my password. What should I do?', 'Choose “Forgot password” in the Log in window and follow the link we send to your email.'],
        ['Can I change my email or phone number?', 'Not on your own: for security reasons, contact details are changed only through Support. Our team will first confirm that you are the account owner, usually by asking a few questions about your account or a recent transaction. Once confirmed, the new details are saved and you receive a notification at both the old and new address.'],
        ['Can I have more than one account?', 'No. One account per person.'],
      ] },
      { title: 'Deposits & Withdrawals', faq: [
        ['Which payment methods can I use?', 'Visa, Mastercard, Skrill, NETELLER and popular cryptocurrencies.'],
        ['How long do withdrawals take?', 'It depends on the method. Crypto is the fastest and usually arrives within an hour after approval. Skrill and NETELLER take up to 24 hours, while cards can take 1–3 business days because banks process the payment on their side.'],
        ['Why is my withdrawal pending?', 'Every withdrawal is reviewed before it is paid out, so a short pending status is normal. It can take longer if your account is not verified yet: your first withdrawal always requires verification. An active bonus with unfinished wagering can also hold the payout, since bonus funds become withdrawable only after the requirement is met. You can follow the status in Wallet → Transactions and cancel the request while it is still pending. If it stays pending for more than 48 hours, contact Support with your Player ID.'],
        ['Are there deposit or withdrawal limits?', 'Yes, each method has its own minimum and maximum, shown in the Wallet. You can also set personal deposit limits in Settings.'],
      ] },
      { title: 'Bonuses', faq: [
        ['How do I claim a bonus?', 'Press Get bonus on the offer in Promotions or Bonuses.'],
        ['What are wagering requirements?', 'Wagering is the total amount you need to bet before bonus funds can be withdrawn. It is shown as a multiplier: a 100 USD bonus with 30× wagering means you need to place 3,000 USD in bets. Not every game counts fully. Slots usually contribute 100%, while table and live games contribute less or nothing at all. While wagering is in progress, a maximum bet applies, and the bonus has an expiry date. Your current progress is always visible in Bonuses → Active.'],
        ['Can I cancel an active bonus?', 'Yes, in Bonuses → Active. The bonus balance and its winnings are removed; your real balance stays.'],
      ] },
      { title: 'Games', faq: [
        ['Can I play without an account?', 'You can browse games as a guest, but you need to log in to play.'],
        ['What happens if my connection drops mid-game?', 'Nothing is lost. The round is completed on the provider’s server, and the result appears in your balance once you reconnect. For bonus rounds and free spins, the game usually resumes where you left off when you open it again.'],
        ['Why do some games not count towards wagering?', 'Some games have a very high return or low risk, which would make bonuses too easy to clear. Their contribution is reduced or excluded, as listed in each bonus’s terms.'],
      ] },
      { title: 'Security', faq: [
        ['How do I keep my account secure?', 'Use a unique password that you don’t use anywhere else, and turn on two-factor authentication in Settings → Security, so a code from your phone is needed to log in. Never share your password or codes: NOVA staff will never ask for them. Log out on shared devices, and keep your email account secure, since it is used to reset your password.'],
        ['Why do I need to verify my identity?', 'To confirm the account is yours and that you are over 18. It is required before your first withdrawal.'],
        ['What should I do if I notice suspicious activity?', 'Change your password and contact Support right away.'],
      ] },
    ],
  },

  contact: {
    title: 'Contact us',
    intro: 'Have a question or need help? Choose the right team below, or open Support for the fastest answer. Our support team works around the clock.',
    note: 'Email addresses on this page are for demonstration only.',
    sections: [
      { title: 'Get in touch', contacts: [
        { title: 'General enquiries', text: 'Questions about NOVA, feedback and anything that doesn’t fit elsewhere.', email: 'hello@nova.example' },
        { title: 'Customer support', text: 'Help with your account, payments, bonuses and games.', email: 'support@nova.example' },
        { title: 'Business & partnerships', text: 'Affiliates, game providers, media and other partnership ideas.', email: 'partners@nova.example' },
      ] },
      { title: 'Need an answer now?', text: ['Live chat in Support is the fastest way to reach us. Most questions are answered within a few minutes.'], support: true },
      { title: 'Before you write', tip: 'Include your Player ID and a short description of the issue: what happened, when, and which game or payment it concerns. For payments, add the amount and method. You can find your Player ID in My profile.' },
      { title: 'Follow us', text: ['News, tournaments and special offers on our social channels.'], socials: true },
    ],
  },

  terms: {
    title: 'Terms & Conditions',
    intro: 'These Terms & Conditions set out the rules for using NOVA Casino, including your account, payments, bonuses and games. Please read them carefully: by creating an account, you confirm that you accept them.',
    note: LEGAL_NOTE,
    sections: [
      { title: '1. Definitions', body: [
        'In these terms, “NOVA”, “we” and “us” refer to the operator of the NOVA Casino website. “You” and “player” refer to any person who registers an account or uses the site. “Games” means all casino products available on the site, including slots, table games and live games.',
        'Additional rules, such as bonus terms or tournament rules, form part of these terms. If they conflict with these terms, the more specific rules apply to that offer.',
      ] },
      { title: '2. Eligibility and age', body: [
        'To use NOVA Casino you must:',
        { list: ['be at least 18 years old, or the legal gambling age in your country if it is higher', 'be legally allowed to take part in online gambling where you live', 'act on your own behalf and not for any other person', 'not be self-excluded from gambling with us or another operator'] },
        'We may ask for proof of age at any time. Accounts of underage players are closed immediately, and deposits are returned. Winnings are not paid out.',
      ] },
      { title: '3. Account registration', body: [
        'Each person may register only one account. When you sign up, you must provide accurate, complete and current information, including your name, date of birth and contact details. You agree to keep these details up to date.',
        'Accounts registered with false information, or opened to receive the same bonus more than once, may be closed. We may refuse registration at our discretion without giving a reason.',
      ] },
      { title: '4. Account security', body: [
        'You are responsible for keeping your login details confidential and for all activity on your account. We recommend a unique password and two-factor authentication.',
        { list: ['Do not share your password or verification codes with anyone', 'Log out when using a shared device', 'Tell us immediately if you suspect someone else has access to your account'] },
        'NOVA staff will never ask for your password. We are not responsible for losses caused by sharing your login details.',
      ] },
      { title: '5. Verification', body: [
        'To protect players and prevent fraud, we verify the identity of account holders. Verification is required before your first withdrawal and may be requested at other times, for example after a large deposit or a change in account details.',
        'We may ask for a photo ID, proof of address and proof of ownership of a payment method. Until verification is complete, withdrawals and some account features may be unavailable.',
      ] },
      { title: '6. Deposits', body: [
        'You can deposit using the methods shown in your Wallet. Every payment method must be registered in your own name. Deposits are credited once the payment provider confirms the transaction; crypto deposits may require several network confirmations.',
        'Some payment providers charge their own fees or apply currency conversion. NOVA does not add fees to deposits, but we cannot control charges made by your bank or wallet.',
        'Deposits are meant for playing. We may review accounts where funds are deposited and withdrawn without meaningful play, and the account may be suspended while we do so.',
      ] },
      { title: '7. Withdrawals', body: [
        'You may withdraw your real balance at any time, subject to verification and any active bonus terms. Withdrawals are normally sent to the method used for the deposit. Where this is not possible, we will offer an alternative method in your name.',
        { list: ['Withdrawals are reviewed before payment and may stay pending during the review', 'Minimum and maximum amounts depend on the payment method', 'Processing times depend on the method and on your payment provider'] },
        'You can cancel a pending withdrawal until it has been approved.',
      ] },
      { title: '8. Bonuses and wagering', body: [
        'Bonuses are optional. Each offer has its own terms, including the wagering requirement, maximum bet, eligible games and expiry date. These terms are shown with the bonus before you claim it.',
        'Bonus funds and winnings from them become withdrawable only after the wagering requirement is met. Games contribute to wagering at different rates, and some games do not contribute at all.',
        'You can cancel an active bonus at any time. Bonus funds and winnings from them are then removed. Bonuses may be withdrawn if they are abused, for example through multiple accounts or bet patterns designed only to clear wagering.',
      ] },
      { title: '9. Game rules', body: [
        'Each game has its own rules and payout table, available inside the game. The result of a round is decided by the game provider’s systems and is final once the round is complete.',
        'Your stake is taken from your balance when a round starts. Where a game shows a maximum win or a maximum bet, that limit applies even if the result would otherwise be higher.',
        'If a game malfunctions, the affected rounds are void and the stakes are returned. If a round is interrupted by a lost connection, it is completed on the provider’s side, and the result appears in your balance.',
      ] },
      { title: '10. Prohibited activities', body: [
        'While using NOVA Casino, you must not:',
        { list: ['use bots, scripts or any software that plays automatically', 'collude with other players or share information to gain an unfair advantage', 'exploit errors, bugs or incorrect payouts instead of reporting them', 'use stolen payment methods or the funds of another person', 'use the site for money laundering or any other illegal purpose'] },
        'If we detect such activity, we may void the affected bets, withhold winnings and close the account.',
      ] },
      { title: '11. Account suspension and closure', body: [
        'We take responsible gaming seriously. You can set deposit limits, take a break or self-exclude in Settings at any time, and we may contact you if your play shows signs of harm.',
        'You can close your account at any time by contacting Support. If you want to stop for gambling-related reasons, please use the self-exclusion tools in Settings, so your account cannot be reopened by mistake.',
        'We may suspend or close an account if these terms are breached, if verification is not completed, or if we are required to do so by law. When an account is closed, the remaining real balance is paid out unless the funds are connected to a breach of these terms.',
      ] },
      { title: '12. Liability', body: [
        'NOVA Casino is provided “as is”. We do our best to keep the site available and accurate but cannot guarantee that it will always be free of errors or interruptions.',
        'We are not liable for losses caused by technical failures outside our control, your internet connection or device, or the misuse of your account by third parties. Nothing in these terms limits liability that cannot be limited by law.',
      ] },
      { title: '13. Complaints', body: [
        'If you are unhappy with our service, contact Support and describe the issue with your Player ID, the date and, where relevant, the game round or transaction. We aim to reply within 48 hours and to resolve complaints as quickly as possible.',
        'If the issue needs further review, a senior member of the team will look into it and send you a final written answer.',
      ] },
      { title: '14. Changes to these terms', body: [
        'We may update these terms from time to time, for example to reflect new features, payment methods or legal requirements. Important changes are announced on the site or by email before they take effect.',
        'If you continue to use your account after the changes take effect, you accept the updated terms. If you do not agree, you can close your account and withdraw your balance.',
      ] },
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
    intro: 'Every result at NOVA Casino is random, and neither we nor other players can influence it. This page explains how games decide outcomes, what RTP and volatility really mean, and how we keep play fair for everyone.',
    note: 'This page is demonstration content for a design prototype. It does not describe real licences, certificates or audits.',
    sections: [
      { title: 'Random results', body: [
        'Casino games are designed so that every outcome is a matter of chance. No pattern, time of day or betting system can predict the next result.',
        'Each round is independent. A long run of losses does not make a win more likely, and a big win does not make the next spin less lucky.',
        { callout: 'Past results never affect future ones. Every spin, hand or roll starts from scratch.' },
      ] },
      { title: 'How the random number generator works', body: [
        'Slots and digital table games use a random number generator (RNG): software that continuously produces long sequences of unpredictable numbers, thousands of times per second.',
        'The moment you press Spin or Deal, the game takes the current number and turns it into a result, such as the symbols on the reels or the cards in a hand. Because the number changes constantly, the timing of a click cannot be used to influence the result.',
        'The RNG runs on the game provider’s servers. NOVA receives the result and updates your balance, but cannot change or choose outcomes.',
      ] },
      { title: 'RTP and volatility', body: [
        'Return to player (RTP) is the share of all bets a game is designed to pay back to players over a very long period. A slot with 96% RTP returns, on average, 96 out of every 100 units wagered across millions of rounds.',
        { callout: 'RTP is a long-term average, not a promise of what you will win in a single session.' },
        'Volatility describes how wins are spread. Low-volatility games pay small wins often; high-volatility games pay less often, but individual wins can be much larger. Two games with the same RTP can feel very different to play.',
        'You can find a game’s RTP and volatility on its game page or in the information screen inside the game.',
      ] },
      { title: 'Game rules and payouts', body: [
        'Every game includes its rules and paytable, available from the information or menu button inside the game. They explain how wins are calculated, what each symbol or bet pays and how bonus features work.',
        'If a game malfunctions, the affected rounds are void and the stakes are returned, as described in our Terms & Conditions.',
      ] },
      { title: 'Live casino', body: [
        'Live games do not use an RNG. They are played with real cards, wheels and dice, run by professional dealers and streamed from a studio in real time.',
        { list: ['Several cameras show every card, spin and roll', 'Results are read automatically and checked by the studio team', 'Every round is recorded and can be reviewed if a question comes up'] },
      ] },
      { title: 'Preventing fraud and collusion', body: [
        'Fair play also means protecting players from each other. We monitor activity for signs of cheating and abuse, including:',
        { list: ['several accounts used by one person or household to gain an advantage', 'players sharing information in multiplayer games', 'bots and automated play', 'stolen payment methods and bonus abuse'] },
        'When we find such activity, we may void the affected bets and close the accounts involved.',
        { callout: 'If you notice something suspicious, tell Support. Reports are handled confidentially.' },
      ] },
      { title: 'Disputed rounds', body: [
        'If you think a round was settled incorrectly, contact us. We request the round history from the game provider, which records every bet, result and payout. For live games, the studio’s video recording can also be checked.',
        'If an error is confirmed, we correct your balance. If the result was correct, we will explain how it was calculated.',
      ] },
      { title: 'Contacting support', body: [
        'To help us investigate quickly, include your Player ID, the game name, the date and time of the round and, if possible, a screenshot. You can reach the team any time through Support or the addresses on the Contact us page.',
      ] },
    ],
  },
};
