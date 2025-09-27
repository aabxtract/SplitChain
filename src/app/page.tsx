"use client";

import { useState } from 'react';
import type { Transaction } from '@/lib/types';
import { DUMMY_TRANSACTIONS } from '@/lib/dummy-data';
import WalletConnect from '@/components/WalletConnect';
import FundDispersalForm from '@/components/FundDispersalForm';
import TransactionHistory from '@/components/TransactionHistory';
import Logo from '@/components/Logo';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(DUMMY_TRANSACTIONS);

  const addTransactions = (newTransactions: Transaction[]) => {
    setTransactions(prev => [...newTransactions, ...prev]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Logo />
            <h1 className="text-xl font-bold tracking-tighter text-foreground">Web3 Disperser</h1>
          </div>
          <WalletConnect />
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <FundDispersalForm onTransactionsAdded={addTransactions} />
            </div>
            <div className="lg:col-span-3">
              <TransactionHistory transactions={transactions} />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Web3 Disperser. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
