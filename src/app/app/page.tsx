
"use client";

import { useState } from 'react';
import type { Transaction } from '@/lib/types';
import { DUMMY_TRANSACTIONS } from '@/lib/dummy-data';
import WalletConnect from '@/components/WalletConnect';
import FundDispersalForm from '@/components/FundDispersalForm';
import TransactionHistory from '@/components/TransactionHistory';
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export default function AppPage() {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>(DUMMY_TRANSACTIONS);

  const addTransactions = (newTransactions: Transaction[]) => {
    setTransactions(prev => [...newTransactions, ...prev]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <div className="absolute top-0 left-0 w-full h-full bg-grid-small-white/[0.1] z-0"></div>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-4">
            <Logo />
            <h1 className="font-headline text-xl font-bold tracking-tighter text-foreground">Splitchain</h1>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="flex-1 z-10">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <FundDispersalForm onTransactionsAdded={addTransactions} userAddress={address} />
            </div>
            <div className="lg:col-span-3">
              <TransactionHistory transactions={transactions} />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-white/10 bg-card/50">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Splitchain. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
