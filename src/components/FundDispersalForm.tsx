"use client";

import { useState, useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Loader2, Send, AlertTriangle, PlusCircle, XCircle } from 'lucide-react';

const recipientSchema = z.object({
  recipientAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Please enter a valid Ethereum wallet address.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
});

const formSchema = z.object({
  recipients: z.array(recipientSchema).min(1, "You must add at least one recipient."),
});

type FundDispersalFormValues = z.infer<typeof formSchema>;

interface FundDispersalFormProps {
  onTransactionsAdded: (transactions: Transaction[]) => void;
}

export default function FundDispersalForm({ onTransactionsAdded }: FundDispersalFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [riskData, setRiskData] = useState<{ assessment: string; values: FundDispersalFormValues } | null>(null);

  const form = useForm<FundDispersalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipients: [{ recipientAddress: '', amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "recipients"
  });

  const onSubmit = (values: FundDispersalFormValues) => {
    startTransition(async () => {
      const recipientData = values.recipients.map(r => ({ ...r, userAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B' }));
      const result = await sendFunds(recipientData);
      
      if (result.success && result.transactions) {
        onTransactionsAdded(result.transactions);
        toast({
          title: "Success!",
          description: "All funds have been sent.",
        });
        form.reset();
        remove();
        append({ recipientAddress: '', amount: 0 });
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
      const recipientData = riskData.values.recipients.map(r => ({ ...r, userAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B' }));
      const result = await sendFunds(recipientData, true); // Bypass risk check
      if (result.success && result.transactions) {
        onTransactionsAdded(result.transactions);
        toast({
          title: "Success!",
          description: "Funds sent despite the risk.",
        });
        form.reset();
        remove();
        append({ recipientAddress: '', amount: 0 });
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
          <CardDescription>Enter recipient details and amount to send. You can add multiple recipients.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg relative">
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
                          <Input placeholder="0x..." {...field} />
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
                        <FormLabel>Amount (ETH/USDC)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.1" {...field} step="0.01" />
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
                className="w-full"
                onClick={() => append({ recipientAddress: '', amount: 0 })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Recipient
              </Button>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
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
