"use server";

import { assessTransactionRisk, type TransactionRiskInput } from '@/ai/flows/transaction-risk-assessment';
import type { Transaction } from '@/lib/types';

type SendFundsResult = {
  success: boolean;
  isRisk?: boolean;
  assessment?: string;
  transactions?: Transaction[];
  error?: string;
};

export async function sendFunds(
  data: TransactionRiskInput[],
  bypassRiskCheck = false
): Promise<SendFundsResult> {
  try {
    if (!bypassRiskCheck) {
      for (const recipientData of data) {
        const riskAssessment = await assessTransactionRisk(recipientData);
        if (!riskAssessment.isSafe) {
          return {
            success: false,
            isRisk: true,
            assessment: `Transaction to ${recipientData.recipientAddress} flagged as risky: ${riskAssessment.riskAssessment}`,
          };
        }
      }
    }

    // Simulate sending funds
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newTransactions: Transaction[] = data.map(recipientData => {
      const mockTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      return {
        recipient: recipientData.recipientAddress,
        amount: recipientData.amount,
        currency: 'ETH', // For now, we assume ETH.
        timestamp: new Date(),
        txHash: mockTxHash,
      };
    });

    return {
      success: true,
      transactions: newTransactions,
    };
  } catch (error) {
    console.error('Error sending funds:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while sending funds.',
    };
  }
}
