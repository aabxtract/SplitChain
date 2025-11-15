import type { Transaction } from './types';

export const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    recipient: '0x1a2B3c4d5E6f7a8B9c0D1e2F3a4b5c6d7e8f9a0B',
    amount: 0.5,
    currency: 'ETH',
    timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    txHash: '0xabc123...',
  },
  {
    recipient: '0x2b3C4d5e6F7a8b9C0d1e2f3A4b5c6d7E8f9a0b1C',
    amount: 1500,
    currency: 'USDC',
    timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    txHash: '0xdef456...',
  },
  {
    recipient: '0x3c4D5e6f7a8B9c0d1e2F3a4b5C6d7e8F9a0b1c2D',
    amount: 1.2,
    currency: 'ZORA',
    timestamp: new Date(Date.now() - 3600000 * 10), // 10 hours ago
    txHash: '0x123abc...',
  },
  {
    recipient: '0x4d5E6f7a8b9C0d1e2F3a4b5c6D7e8f9a0b1C2d3E',
    amount: 500,
    currency: 'USDT',
    timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
    txHash: '0x456def...',
  },
  {
    recipient: '0x5e6F7a8b9c0d1e2F3a4b5c6d7e8F9a0b1c2d3e4F',
    amount: 2.1,
    currency: 'ETH',
    timestamp: new Date(Date.now() - 3600000 * 48), // 2 days ago
    txHash: '0xghi789...',
  },
    {
    recipient: '0x6f7A8b9c0d1e2F3a4b5c6d7e8F9a0b1c2d3e4f5G',
    amount: 75,
    currency: 'USDC',
    timestamp: new Date(Date.now() - 3600000 * 72), // 3 days ago
    txHash: '0xjkl012...',
  },
];
