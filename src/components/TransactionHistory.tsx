"use client";

import type { Transaction } from '@/lib/types';
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

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>A list of your recent fund dispersals.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <TableRow key={tx.txHash}>
                    <TableCell>
                      <div className="font-medium truncate">{`${tx.recipient.substring(0, 6)}...${tx.recipient.substring(tx.recipient.length - 4)}`}</div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.amount}{' '}
                      <Badge variant={tx.currency === 'ETH' ? 'secondary' : 'default'} className="ml-1">{tx.currency}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">
                      {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
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
