
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowRight, Blocks, Bot, Send, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-small-white/[0.2] z-0"></div>
      
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Logo />
            <h1 className="font-headline text-xl font-bold tracking-tighter text-foreground">Splitchain</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild className="group bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40">
              <Link href="/app">
                Launch App <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 z-10">
        {/* Hero Section */}
        <section className="py-24 md:py-32 lg:py-40">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-foreground !leading-tight">
              Disperse Crypto Funds,
              <br />
              <span className="text-primary">Instantly & Securely.</span>
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-6">
              The ultimate tool for batch-sending crypto. Distribute funds to multiple wallets in a single, gas-efficient transaction, safeguarded by AI-driven risk analysis.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="group bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all duration-300 hover:shadow-accent/40 scale-105">
                <Link href="/app">
                  Get Started <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card/50 border-t border-b border-white/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-transparent hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
                  <Blocks className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Batch Transactions</h3>
                <p className="mt-2 text-muted-foreground">
                  Send ETH, USDC, and other tokens to hundreds of wallets in a single transaction, saving on gas fees and time.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-transparent hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
                  <Bot className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground">AI-Powered Security</h3>
                <p className="mt-2 text-muted-foreground">
                  Our integrated AI scans transactions for potential risks, protecting you from sending funds to malicious addresses.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-transparent hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Lightning Fast UI</h3>
                <p className="mt-2 text-muted-foreground">
                  A clean, intuitive interface makes complex fund dispersal accessible. Connect your wallet and start sending in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground">
              Ready to Revolutionize Your Payouts?
            </h2>
            <div className="mt-8">
              <Button size="lg" asChild className="group bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all duration-300 hover:shadow-accent/40 scale-105">
                <Link href="/app">
                  Launch Splitchain App
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-6 border-t border-white/10 bg-card/50">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Splitchain. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
