export type Transaction = {
  recipient: string;
  amount: number;
  currency: 'ETH' | 'USDC';
  timestamp: Date;
  txHash: string;
};
