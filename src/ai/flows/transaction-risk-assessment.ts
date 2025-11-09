'use server';

/**
 * @fileOverview An AI agent for assessing the risk associated with a transaction.
 *
 * - assessTransactionRisk - A function that assesses the risk of a transaction.
 * - TransactionRiskInput - The input type for the assessTransactionRisk function.
 * - TransactionRiskOutput - The return type for the assessTransactionRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransactionRiskInputSchema = z.object({
  recipientAddress: z.string().describe('The recipient wallet address.'),
  amount: z.number().describe('The amount of funds to be sent.'),
  currency: z.string().describe('The currency of the transaction (e.g., ETH, USDC).'),
  userAddress: z.string().describe('The user wallet address.'),
});
export type TransactionRiskInput = z.infer<typeof TransactionRiskInputSchema>;

const TransactionRiskOutputSchema = z.object({
  riskAssessment: z
    .string()
    .describe(
      'An assessment of the risk associated with the transaction, including potential malicious activity or errors.'
    ),
  isSafe: z.boolean().describe('Whether the transaction is considered safe.'),
});
export type TransactionRiskOutput = z.infer<typeof TransactionRiskOutputSchema>;

export async function assessTransactionRisk(
  input: TransactionRiskInput
): Promise<TransactionRiskOutput> {
  return assessTransactionRiskFlow(input);
}

const assessTransactionRiskPrompt = ai.definePrompt({
  name: 'assessTransactionRiskPrompt',
  input: {schema: TransactionRiskInputSchema},
  output: {schema: TransactionRiskOutputSchema},
  prompt: `You are a security expert assessing the risk associated with a cryptocurrency transaction.

  Analyze the following transaction details to determine if the transaction is potentially malicious or erroneous.

  Recipient Address: {{{recipientAddress}}}
  Amount: {{{amount}}} {{{currency}}}
  User Address: {{{userAddress}}}

  Provide a risk assessment and indicate whether the transaction is considered safe.
  Consider factors such as known scams, suspicious activity associated with the recipient address, and unusually large transaction amounts.
  Be brief, and provide a safety assessment.`,
});

const assessTransactionRiskFlow = ai.defineFlow(
  {
    name: 'assessTransactionRiskFlow',
    inputSchema: TransactionRiskInputSchema,
    outputSchema: TransactionRiskOutputSchema,
  },
  async input => {
    const {output} = await assessTransactionRiskPrompt(input);
    return output!;
  }
);
