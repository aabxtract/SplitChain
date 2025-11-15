"use client";

import type { Transaction, Currency } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const getBadgeVariant = (currency: Currency) => {
  switch (currency) {
    case 'ETH':
      return 'secondary';
    case 'ZORA':
        return 'outline';
    case 'USDC':
      return 'default';
    case 'USDT':
        return 'destructive';
    default:
      return 'outline';
  }
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <Card className="bg-card/50 border border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>A list of your recent fund dispersals.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px] pr-4 -mr-4">
          <Table>
            <TableHeader className="sticky top-0 bg-card/80 backdrop-blur-sm">
              <TableRow className="border-b-white/10 hover:bg-transparent">
                <TableHead>Recipient</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <TableRow key={tx.txHash} className="border-b-white/10 font-code hover:bg-muted/50">
                    <TableCell>
                      <a href={`https://etherscan.io/address/${tx.recipient}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                        <span className="font-medium truncate">{`${tx.recipient.substring(0, 6)}...${tx.recipient.substring(tx.recipient.length - 4)}`}</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground"/>
                      </a>
                      <div className="text-xs text-muted-foreground md:hidden">
                        {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.amount}{' '}
                      <Badge variant={getBadgeVariant(tx.currency)} className="ml-1 select-none">{tx.currency}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                      {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No transactions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
