"use client";

import { useClippayWallet } from "@/hooks/use-clippay-wallet";
import { Button } from "@/components/ui/button";
import { Wallet, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface WalletGateProps {
  children: ReactNode;
  /** Which role this dashboard expects */
  role: "brand" | "influencer";
}

/**
 * Renders children only when a wallet is connected.
 * Otherwise shows a full-page connect prompt styled for the expected role.
 */
export function WalletGate({ children, role }: WalletGateProps) {
  const { isConnected, connect } = useClippayWallet();

  if (isConnected) return <>{children}</>;

  const isBrand = role === "brand";
  const accent = isBrand ? "#1DE1B9" : "#ec4899";
  const label = isBrand ? "Brand Dashboard" : "Creator Hub";
  const subtitle = isBrand
    ? "Connect your Stellar wallet to manage campaigns, fund escrows, and track performance."
    : "Connect your Stellar wallet to view active bounties, track earnings, and withdraw rewards.";

  return (
    <div className="min-h-screen bg-[#0f0809] text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-md w-full text-center space-y-8"
      >
        {/* Glow */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: accent }}
        />

        {/* Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <ShieldCheck className="h-10 w-10" style={{ color: accent }} />
          <div
            className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-[#0f0809] flex items-center justify-center"
            style={{ backgroundColor: accent }}
          >
            <Wallet className="h-3 w-3 text-black" />
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-3">
          <p
            className="text-[10px] uppercase tracking-[0.2em] font-medium"
            style={{ color: accent }}
          >
            {label}
          </p>
          <h1 className="text-2xl font-bold text-white">
            Connect Your Wallet
          </h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-sm mx-auto">
            {subtitle}
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={connect}
          size="lg"
          className="w-full text-sm font-bold rounded-full gap-2 cursor-pointer"
          style={{
            backgroundColor: accent,
            color: "#000",
          }}
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
          <ArrowRight className="h-4 w-4" />
        </Button>

        {/* Hint */}
        <p className="text-[10px] text-white/30">
          Stellar Testnet • Freighter or any supported wallet
        </p>
      </motion.div>
    </div>
  );
}
