"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendFunds } from '@/app/actions';
import type { Transaction } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  recipientAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Please enter a valid Ethereum wallet address.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
});

type FundDispersalFormValues = z.infer<typeof formSchema>;

interface FundDispersalFormProps {
  onTransactionAdded: (transaction: Transaction) => void;
}

export default function FundDispersalForm({ onTransactionAdded }: FundDispersalFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [riskData, setRiskData] = useState<{ assessment: string; values: FundDispersalFormValues } | null>(null);

  const form = useForm<FundDispersalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientAddress: '',
      amount: 0,
    },
  });

  const onSubmit = (values: FundDispersalFormValues) => {
    startTransition(async () => {
      const result = await sendFunds({ ...values, userAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B' }); // userAddress is mocked
      
      if (result.success && result.transaction) {
        onTransactionAdded(result.transaction);
        toast({
          title: "Success!",
          description: "Funds have been sent.",
        });
        form.reset();
      } else if (result.isRisk && result.assessment) {
        setRiskData({ assessment: result.assessment, values });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to send funds.",
        });
      }
    });
  };

  const handleProceedWithRisk = () => {
    if (!riskData) return;
    
    startTransition(async () => {
      const result = await sendFunds({ ...riskData.values, userAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B' }, true); // Bypass risk check
      if (result.success && result.transaction) {
        onTransactionAdded(result.transaction);
        toast({
          title: "Success!",
          description: "Funds sent despite the risk.",
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to send funds.",
        });
      }
      setRiskData(null);
    });
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Disperse Funds</CardTitle>
          <CardDescription>Enter recipient details and amount to send.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="recipientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Wallet Address</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (ETH/USDC)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.1" {...field} step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send Funds
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <AlertDialog open={!!riskData} onOpenChange={(open) => !open && setRiskData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive" />
              Risk Detected
            </AlertDialogTitle>
            <AlertDialogDescription>
              {riskData?.assessment || "Our AI has flagged this transaction as potentially risky."}
              <br/><br/>
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRiskData(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleProceedWithRisk} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proceed Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
