"use server";

import { ethers } from 'ethers';
import { assessTransactionRisk, type TransactionRiskInput } from '@/ai/flows/transaction-risk-assessment';
import type { Transaction } from '@/lib/types';

type SendFundsData = {
  recipientAddress: string;
  amount: number;
  currency: 'ETH' | 'USDC';
}

type SendFundsResult = {
  success: boolean;
  isRisk?: boolean;
  assessment?: string;
  transactions?: Transaction[];
  error?: string;
};

// Initialize the Ethereum provider
const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL!);

async function resolveAddress(addressOrEns: string): Promise<string | null> {
  if (addressOrEns.endsWith('.eth')) {
    try {
      const resolvedAddress = await provider.resolveName(addressOrEns);
      return resolvedAddress;
    } catch (error) {
      console.error(`Failed to resolve ENS name ${addressOrEns}:`, error);
      return null;
    }
  }
  // It's already an address, return it
  if (ethers.isAddress(addressOrEns)) {
    return addressOrEns;
  }
  return null;
}

export async function sendFunds(
  data: SendFundsData[],
  bypassRiskCheck = false
): Promise<SendFundsResult> {
  try {
    const resolvedData: TransactionRiskInput[] = [];

    // --- ENS Resolution Step ---
    for (const recipient of data) {
      const resolvedAddress = await resolveAddress(recipient.recipientAddress);
      if (!resolvedAddress) {
        return {
          success: false,
          error: `Invalid Ethereum address or unable to resolve ENS name: ${recipient.recipientAddress}`,
        };
      }
      resolvedData.push({
        ...recipient,
        recipientAddress: resolvedAddress,
        userAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', // Mock user address
      });
    }
    // --- End ENS Resolution ---

    if (!bypassRiskCheck) {
      for (const recipientData of resolvedData) {
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

    const newTransactions: Transaction[] = resolvedData.map(recipientData => {
      const mockTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      return {
        recipient: recipientData.recipientAddress,
        amount: recipientData.amount,
        currency: recipientData.currency as 'ETH' | 'USDC',
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
