"use server";

import { assessTransactionRisk, type TransactionRiskInput } from '@/ai/flows/transaction-risk-assessment';
import type { Transaction, Currency } from '@/lib/types';

type SendFundsData = {
  recipients: {
    recipientAddress: string;
    amount: number;
  }[];
  currency: Currency;
  userAddress: `0x${string}`;
}

type SendFundsResult = {
  success: boolean;
  isRisk?: boolean;
  assessment?: string;
  transactions?: Transaction[];
  error?: string;
};

export async function sendFunds(
  data: SendFundsData,
  bypassRiskCheck = false
): Promise<SendFundsResult> {
  try {
    const { recipients, currency, userAddress } = data;

    if (!bypassRiskCheck) {
      for (const recipientData of recipients) {
        const riskInput: TransactionRiskInput = {
          ...recipientData,
          userAddress,
        }
        const riskAssessment = await assessTransactionRisk(riskInput);
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

    const newTransactions: Transaction[] = recipients.map(recipientData => {
      const mockTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      return {
        recipient: recipientData.recipientAddress,
        amount: recipientData.amount,
        currency: currency,
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
