export type Currency = 'ETH' | 'ZORA' | 'USDC' | 'USDT';

export type Transaction = {
  recipient: string;
  amount: number;
  currency: Currency;
  timestamp: Date;
  txHash: string;
};
