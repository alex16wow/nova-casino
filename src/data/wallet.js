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
