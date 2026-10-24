// Deposit options per currency. Amounts are in the currency itself.

const fiatLike = { presets: [20, 50, 100, 250], min: 10, max: 10000, bonusCap: 50 };

export const depositRules = {
  USDT: { ...fiatLike, network: 'TRC-20', methods: ['crypto', 'card'] },
  USDC: { ...fiatLike, network: 'ERC-20', methods: ['crypto', 'card'] },
  EUR: { ...fiatLike, methods: ['card', 'skrill', 'neteller'] },
  BTC: { presets: [0.001, 0.005, 0.01, 0.05], min: 0.0005, max: 1, network: 'Bitcoin', methods: ['crypto', 'card'] },
  ETH: { presets: [0.02, 0.05, 0.1, 0.5], min: 0.01, max: 20, network: 'Ethereum', methods: ['crypto', 'card'] },
};

export const depositMethods = {
  crypto: { title: 'Crypto transfer', text: 'Send from any wallet or exchange' },
  card: { title: 'Visa / Mastercard', text: 'Instant, no fees' },
  skrill: { title: 'Skrill', text: 'Confirm in your Skrill account' },
  neteller: { title: 'Neteller', text: 'Confirm in your Neteller account' },
};

// Sample wallet addresses shown for crypto transfers.
export const depositAddresses = {
  USDT: 'TQ7nVx4kR2mWp9sLc8eHf3JdY6uBa1ZgKt',
  USDC: '0x8f3C2a91D4b7E6c05A1f9B3d2E8c7a64F0b1D9e2',
  BTC: 'bc1q9h7garjwnx4k8vs3l2pyd6jt0mqc5ze8f4xw2r',
  ETH: '0x4B2e9D7c1A8f3E6b05C9d2F7a1E4c8B3D6f0A5e9',
};

// ---------- Wallet page (/account/wallet). All terms are demo data. ----------

// Deposit methods on the Wallet page: crypto for crypto currencies, a bank card (via the provider's page) for all.
export const walletDepositMethods = {
  crypto: { title: 'Crypto', text: 'Send from any wallet or exchange' },
  card: { title: 'Bank card', text: 'Pay on the provider’s secure page' },
};

// Networks per crypto currency. Fee / time apply to withdrawals.
export const cryptoNetworks = {
  USDT: [{ id: 'TRC-20', fee: 1, time: 'Up to 30 minutes' }, { id: 'ERC-20', fee: 5, time: 'Up to 30 minutes' }],
  USDC: [{ id: 'ERC-20', fee: 5, time: 'Up to 30 minutes' }, { id: 'Polygon', fee: 0.5, time: 'Up to 15 minutes' }],
  BTC: [{ id: 'Bitcoin', fee: 0.0002, time: 'Up to 1 hour' }],
  ETH: [{ id: 'Ethereum', fee: 0.002, time: 'Up to 30 minutes' }, { id: 'Arbitrum', fee: 0.0005, time: 'Up to 15 minutes' }],
};
export const isCrypto = (code) => Boolean(cryptoNetworks[code]);

// A clearly non-working address: the DEMO prefix makes it invalid on every network.
export const demoAddress = (code, network) => {
  const tail = (depositAddresses[code] ?? '').slice(-22);
  return `DEMO-ONLY-${network.replace(/\W/g, '')}-${tail}`;
};

export const withdrawMethods = {
  crypto: { title: 'Crypto wallet', text: 'To your own wallet address' },
  bank: { title: 'Bank transfer', text: 'To a SEPA bank account (IBAN)' },
};
export const withdrawRules = {
  USDT: { min: 20, methods: ['crypto'] },
  USDC: { min: 20, methods: ['crypto'] },
  BTC: { min: 0.001, methods: ['crypto'] },
  ETH: { min: 0.02, methods: ['crypto'] },
  EUR: { min: 20, methods: ['bank'], bank: { fee: 2.5, time: '1–3 business days' } },
};

export const methodLabel = (tx) => ({ crypto: `Crypto${tx.network ? ` · ${tx.network}` : ''}`, card: 'Bank card', bank: 'Bank transfer', skrill: 'Skrill', neteller: 'Neteller' }[tx.method] ?? tx.method);

// Starting wallet: real balances come from `currencies`; bonus funds and history are sample data.
export const seedBonus = { USDT: 45, BTC: 0, ETH: 0, USDC: 0, EUR: 10 };

const DAY = 86400000;
const seed = [
  // [days ago, type, method, network, amount, code, status, failReason]
  [0.2, 'withdrawal', 'crypto', 'TRC-20', 150, 'USDT', 'pending'],
  [1, 'deposit', 'card', null, 100, 'USDT', 'completed'],
  [2, 'deposit', 'card', null, 250, 'EUR', 'failed', 'Payment declined by the bank'],
  [3, 'deposit', 'crypto', 'Bitcoin', 0.01, 'BTC', 'completed'],
  [5, 'withdrawal', 'crypto', 'TRC-20', 300, 'USDT', 'completed'],
  [6, 'deposit', 'crypto', 'TRC-20', 500, 'USDT', 'completed'],
  [9, 'deposit', 'crypto', 'Ethereum', 0.3, 'ETH', 'completed'],
  [12, 'withdrawal', 'bank', null, 200, 'EUR', 'completed'],
  [15, 'deposit', 'card', null, 50, 'USDC', 'failed', 'Payment cancelled on the provider page'],
  [18, 'deposit', 'card', null, 500, 'EUR', 'completed'],
  [24, 'withdrawal', 'crypto', 'ERC-20', 120, 'USDC', 'failed', 'The wallet address failed the check'],
  [33, 'deposit', 'crypto', 'Polygon', 1000, 'USDC', 'completed'],
  [41, 'deposit', 'crypto', 'TRC-20', 1000, 'USDT', 'completed'],
  [58, 'withdrawal', 'crypto', 'Bitcoin', 0.005, 'BTC', 'completed'],
  [74, 'deposit', 'card', null, 200, 'USDT', 'completed'],
  [96, 'deposit', 'crypto', 'TRC-20', 1500, 'USDT', 'completed'],
  [130, 'deposit', 'card', null, 300, 'EUR', 'completed'],
];
const feeFor = (type, method, network, code) =>
  type !== 'withdrawal' ? 0 : method === 'bank' ? withdrawRules.EUR.bank.fee : cryptoNetworks[code]?.find((n) => n.id === network)?.fee ?? 0;

export const seedTransactions = (now = Date.now()) => seed.map(([days, type, method, network, amount, code, status, failReason], i) => ({
  id: `${type === 'deposit' ? 'DP' : 'WD'}-${(9283146 - i * 7919).toString(36).toUpperCase()}`,
  type, method, network, amount, code, status, failReason,
  fee: feeFor(type, method, network, code),
  date: new Date(now - days * DAY).toISOString(),
}));
