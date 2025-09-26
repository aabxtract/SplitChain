"use server";

import { assessTransactionRisk, type TransactionRiskInput } from '@/ai/flows/transaction-risk-assessment';
import type { Transaction } from '@/lib/types';

type SendFundsResult = {
  success: boolean;
  isRisk?: boolean;
  assessment?: string;
  transaction?: Transaction;
  error?: string;
};

export async function sendFunds(
  data: TransactionRiskInput,
  bypassRiskCheck = false
): Promise<SendFundsResult> {
  try {
    if (!bypassRiskCheck) {
      const riskAssessment = await assessTransactionRisk(data);

      if (!riskAssessment.isSafe) {
        return {
          success: false,
          isRisk: true,
          assessment: riskAssessment.riskAssessment,
        };
      }
    }

    // Simulate sending funds (e.g., calling a Firebase function or interacting with a smart contract)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // This would be a real transaction hash from the blockchain
    const mockTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const newTransaction: Transaction = {
      recipient: data.recipientAddress,
      amount: data.amount,
      currency: 'ETH', // For now, we assume ETH. Could be extended to support USDC via form input.
      timestamp: new Date(),
      txHash: mockTxHash,
    };

    return {
      success: true,
      transaction: newTransaction,
    };
  } catch (error) {
    console.error('Error sending funds:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while sending funds.',
    };
  }
}
