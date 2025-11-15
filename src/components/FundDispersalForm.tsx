"use client";

import { useState, useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendFunds } from '@/app/actions';
import type { Transaction, Currency } from '@/lib/types';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Loader2, Send, AlertTriangle, PlusCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const recipientSchema = z.object({
  recipientAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Please enter a valid Ethereum wallet address.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
});

const formSchema = z.object({
  currency: z.enum(['ETH', 'ZORA', 'USDC', 'USDT']),
  recipients: z.array(recipientSchema).min(1, "You must add at least one recipient."),
});

type FundDispersalFormValues = z.infer<typeof formSchema>;

interface FundDispersalFormProps {
  onTransactionsAdded: (transactions: Transaction[]) => void;
  userAddress?: `0x${string}`;
}

export default function FundDispersalForm({ onTransactionsAdded, userAddress }: FundDispersalFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [riskData, setRiskData] = useState<{ assessment: string; values: FundDispersalFormValues } | null>(null);
  const { isConnected } = useAccount();

  const form = useForm<FundDispersalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: 'ETH',
      recipients: [{ recipientAddress: '', amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "recipients"
  });

  const onSubmit = (values: FundDispersalFormValues) => {
    if (!userAddress) return;
    startTransition(async () => {
      const payload = { ...values, userAddress };
      const result = await sendFunds(payload);
      
      if (result.success && result.transactions) {
        onTransactionsAdded(result.transactions);
        toast({
          title: "Funds Dispersed",
          description: "All transactions have been successfully broadcasted.",
        });
        form.reset();
        remove();
        append({ recipientAddress: '', amount: 0 });
      } else if (result.isRisk && result.assessment) {
        setRiskData({ assessment: result.assessment, values });
      } else {
        toast({
          variant: "destructive",
          title: "Transaction Failed",
          description: result.error || "An unknown error occurred while sending funds.",
        });
      }
    });
  };

  const handleProceedWithRisk = () => {
    if (!riskData || !userAddress) return;
    
    startTransition(async () => {
      const payload = { ...riskData.values, userAddress };
      const result = await sendFunds(payload, true); // Bypass risk check
      if (result.success && result.transactions) {
        onTransactionsAdded(result.transactions);
        toast({
          title: "Funds Dispersed",
          description: "Transactions sent successfully despite the risk.",
        });
        form.reset();
        remove();
        append({ recipientAddress: '', amount: 0 });
      } else {
        toast({
          variant: "destructive",
          title: "Transaction Failed",
          description: result.error || "An unknown error occurred while sending funds.",
        });
      }
      setRiskData(null);
    });
  };

  return (
    <>
      <Card className="w-full bg-card/50 border border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Disperse Funds</CardTitle>
          <CardDescription>Create a batch transaction to multiple recipients.</CardDescription>
        </CardHeader>
        {!isConnected ? (
          <CardContent>
             <Alert variant="destructive" className="bg-destructive/10 border-destructive/50 text-destructive-foreground">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertTitle>Wallet Not Connected</AlertTitle>
              <AlertDescription>
                Please connect your wallet to disperse funds.
              </AlertDescription>
            </Alert>
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-white/20">
                            <SelectValue placeholder="Select a token" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="ZORA">ZORA</SelectItem>
                          <SelectItem value="USDC">USDC</SelectItem>
                          <SelectItem value="USDT">USDT</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border border-white/10 bg-background/50 rounded-lg relative">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Remove recipient</span>
                      </Button>
                    )}
                    <FormField
                      control={form.control}
                      name={`recipients.${index}.recipientAddress`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Wallet Address</FormLabel>
                          <FormControl>
                            <Input placeholder="0x..." {...field} className="font-code bg-input border-white/20"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`recipients.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.1" {...field} step="any" className="font-code bg-input border-white/20"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed border-white/30 hover:border-white/50 hover:bg-primary/10 hover:text-primary"
                  onClick={() => append({ recipientAddress: '', amount: 0 })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Recipient
                </Button>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPending || !isConnected} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20 transition-all duration-300 hover:shadow-accent/40">
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Send to {form.getValues('recipients').length} recipient(s)
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
      
      <AlertDialog open={!!riskData} onOpenChange={(open) => !open && setRiskData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive" />
              AI Risk Assessment
            </AlertDialogTitle>
            <AlertDialogDescription>
              {riskData?.assessment || "Our AI has flagged this transaction as potentially risky."}
              <br/><br/>
              Are you sure you want to proceed with this transaction?
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
