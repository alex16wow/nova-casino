// Support widget content: help categories, articles and the demo conversation.
// Articles are the single source of text: Home, Help, search and related links all read from here.
// Body blocks: { h } subheading, { p } paragraph, { ul } / { ol } list of strings.

export const helpCategories = [
  { id: 'account', title: 'My account', description: 'Password, profile and account history' },
  { id: 'verification', title: 'Verification', description: 'Confirming your identity' },
  { id: 'payments', title: 'Deposits & withdrawals', description: 'Adding funds and cashing out' },
  { id: 'bonuses', title: 'Bonuses & promotions', description: 'Welcome bonus and bonus rules' },
];

export const helpArticles = [
  {
    id: 'change-password',
    category: 'account',
    title: 'How do I change my password?',
    summary: 'Update your password from the account menu in a few steps.',
    body: [
      { p: 'You can change your password at any time while you are logged in. A strong, unique password is the easiest way to keep your account safe.' },
      { h: 'Steps' },
      { ol: [
        'Open the profile menu in the top-right corner of the site.',
        'Go to the security settings of your account.',
        'Enter your current password, then the new one twice.',
        'Save the changes. You will stay logged in on this device.',
      ] },
      { h: 'Forgot your current password?' },
      { p: 'Log out and use “Forgot password?” in the login window. We will send a reset link to the email address on your account.' },
    ],
    related: ['account-history', 'verify-account'],
  },
  {
    id: 'account-history',
    category: 'account',
    title: 'How can I view my account history?',
    summary: 'Find your bets, deposits and withdrawals in one place.',
    body: [
      { p: 'Your account history shows everything that happened on your balance: game rounds, deposits, withdrawals and bonus activity.' },
      { h: 'Where to find it' },
      { ul: [
        'Open the profile menu and choose the history section.',
        'Switch between bets and transactions using the tabs.',
        'Use the date filter to narrow the list down.',
      ] },
      { p: 'If you see an entry you don’t recognise, change your password first and then send us a message so we can take a look together.' },
    ],
    related: ['change-password', 'withdrawal-status'],
  },
  {
    id: 'verify-account',
    category: 'verification',
    title: 'How do I verify my account?',
    summary: 'Confirm your identity to unlock every feature of your account.',
    body: [
      { p: 'Verification confirms that the account belongs to you. It protects your funds and is required before some actions, such as withdrawals.' },
      { h: 'How it works' },
      { ol: [
        'Open the profile menu and go to the verification section.',
        'Upload clear photos or scans of the requested documents.',
        'Wait for the review. You will get a notification when it is done.',
      ] },
      { p: 'The exact list of documents can depend on your country and payment method. The verification section always shows what is needed for your account.' },
    ],
    related: ['required-documents', 'withdrawal-status'],
  },
  {
    id: 'required-documents',
    category: 'verification',
    title: 'Which documents are required?',
    summary: 'What to prepare and how to make sure your documents are accepted.',
    body: [
      { p: 'Usually we ask for a proof of identity and a proof of address. Some payment methods may need an extra confirmation.' },
      { h: 'Common documents' },
      { ul: [
        'Proof of identity: passport, ID card or driving licence.',
        'Proof of address: a recent utility bill or bank statement.',
        'Payment method: a photo or statement that shows it belongs to you.',
      ] },
      { h: 'Tips for a quick review' },
      { ul: [
        'All four corners of the document are visible.',
        'Text is sharp and nothing is covered by glare.',
        'The name matches the one on your account.',
      ] },
      { p: 'The current requirements for your account are listed in the verification section of your profile.' },
    ],
    related: ['verify-account', 'make-deposit'],
  },
  {
    id: 'make-deposit',
    category: 'payments',
    title: 'How can I make a deposit?',
    summary: 'Top up your balance with a card, e-wallet or crypto.',
    body: [
      { p: 'Adding funds takes less than a minute. You can start a deposit from the Deposit button in the header or the plus next to your balance.' },
      { h: 'Steps' },
      { ol: [
        'Press Deposit and choose the currency.',
        'Pick a payment method: card, e-wallet or crypto.',
        'Enter the amount and follow the instructions on screen.',
        'Once the payment is confirmed, your balance updates automatically.',
      ] },
      { h: 'Limits and fees' },
      { p: 'Minimum amounts, limits and possible fees depend on the payment method. You will see them in the deposit window before you confirm the payment.' },
    ],
    related: ['withdrawal-status', 'welcome-bonus'],
  },
  {
    id: 'withdrawal-status',
    category: 'payments',
    title: 'Where can I check my withdrawal status?',
    summary: 'Track a withdrawal from request to payout.',
    body: [
      { p: 'Every withdrawal request appears in your account history, where you can follow its status.' },
      { h: 'Statuses' },
      { ul: [
        'Pending: the request is waiting for review.',
        'Approved: the payment has been sent to your method.',
        'Declined: something needs your attention. The history entry explains why.',
      ] },
      { p: 'Processing times depend on the payment method and on whether your account is verified. Check the withdrawal window and the verification section for the details that apply to you.' },
    ],
    related: ['account-history', 'verify-account'],
  },
  {
    id: 'welcome-bonus',
    category: 'bonuses',
    title: 'Welcome bonus',
    summary: 'How to claim the welcome offer on your first deposit.',
    body: [
      { p: 'New players can get a welcome bonus on their first deposit. It adds extra funds to your balance so you can try more games.' },
      { h: 'How to claim it' },
      { ol: [
        'Create an account and choose the welcome bonus during sign-up.',
        'Make your first deposit and keep the bonus option switched on.',
        'The bonus is added to your balance once the deposit is confirmed.',
      ] },
      { p: 'The bonus size, wagering rules and validity are listed on the Promotions page. Please read them before you play with bonus funds.' },
    ],
    related: ['bonus-terms', 'make-deposit'],
  },
  {
    id: 'bonus-terms',
    category: 'bonuses',
    title: 'Where can I find bonus terms?',
    summary: 'Every offer has its own rules. Here is where to read them.',
    body: [
      { p: 'Each bonus and promotion comes with its own terms: how to activate it, which games count and what needs to happen before you can withdraw.' },
      { h: 'Where to look' },
      { ul: [
        'The Promotions page: open an offer to see its full rules.',
        'The deposit window: a short summary next to the bonus switch.',
        'Terms & Conditions in the footer: the general bonus policy.',
      ] },
      { p: 'If a rule is unclear, send us a message before you activate the offer and we will explain it.' },
    ],
    related: ['welcome-bonus', 'account-history'],
  },
];

// Popular articles on the Home tab.
export const popularArticles = ['make-deposit', 'welcome-bonus'];

export const articleById = (id) => helpArticles.find((a) => a.id === id);
export const categoryById = (id) => helpCategories.find((c) => c.id === id);
export const articlesIn = (categoryId) => helpArticles.filter((a) => a.category === categoryId);

const blockText = (b) => b.p ?? b.h ?? (b.ul ?? b.ol ?? []).join(' ');
const plainText = (article) => [article.summary, ...article.body.map(blockText)].join(' ');

// Local search over titles and texts. Returns articles with a short snippet around the first match.
export function searchArticles(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return helpArticles.flatMap((article) => {
    const text = plainText(article);
    const inTitle = article.title.toLowerCase().includes(q);
    const at = text.toLowerCase().indexOf(q);
    if (!inTitle && at < 0) return [];
    let snippet = article.summary;
    if (!inTitle && at >= 0) {
      const from = Math.max(0, at - 40);
      snippet = (from ? '…' : '') + text.slice(from, at + q.length + 70).trim() + '…';
    }
    return [{ article, snippet, rank: inTitle ? 0 : 1 }];
  }).sort((a, b) => a.rank - b.rank);
}

// Demo conversation: a fixed greeting and one automatic reply. No real chat behind it.
export const chatGreeting = 'Hi! Tell us how we can help.';
export const chatAutoReply = 'Thanks for your message! This is a demo conversation, so no agent is connected here. In the live product a support specialist would pick it up from this point.';
