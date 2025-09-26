"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Loader2, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WalletState {
  address: string | null;
  balance: string | null;
}

export default function WalletConnect() {
  const [wallet, setWallet] = useState<WalletState>({ address: null, balance: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = () => {
    setIsLoading(true);
    // Simulate API call for wallet connection
    setTimeout(() => {
      setWallet({
        address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
        balance: '1.234 ETH',
      });
      setIsConnected(true);
      setIsLoading(false);
    }, 1500);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWallet({ address: null, balance: null });
  };
  
  if (isLoading) {
    return <Button disabled variant="outline"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Connecting</Button>;
  }

  if (isConnected && wallet.address) {
    return (
        <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none truncate">{`${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`}</p>
                <p className="text-xs text-muted-foreground">{wallet.balance}</p>
             </div>
            <Button variant="ghost" size="icon" onClick={disconnectWallet}>
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
    );
  }

  return (
    <Button onClick={connectWallet} variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
