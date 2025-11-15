
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowRight, Blocks, Bot, Send } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Logo />
            <h1 className="text-xl font-bold tracking-tighter text-foreground">Splitchain</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild>
              <Link href="/app">
                Launch App <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
              Disperse Crypto Funds, Instantly
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Splitchain is the easiest way to send cryptocurrency to multiple recipients at once. Save time, reduce errors, and manage your payouts effortlessly.
            </p>
            <div className="mt-6">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/app">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card border-t border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Blocks className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Batch Transactions</h3>
                <p className="mt-2 text-muted-foreground">
                  Send ETH, USDC, USDT, or ZORA to hundreds of wallets in a single transaction, saving on gas fees and time.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">AI-Powered Security</h3>
                <p className="mt-2 text-muted-foreground">
                  Our integrated AI scans transactions for potential risks, protecting you from sending funds to malicious addresses.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Simple & Intuitive</h3>
                <p className="mt-2 text-muted-foreground">
                  A clean, easy-to-use interface makes complex fund dispersal accessible to everyone. Connect your wallet and start sending.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
              Ready to Simplify Your Payouts?
            </h2>
            <div className="mt-6">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/app">
                  Launch Splitchain App
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-6 border-t bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Splitchain. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
