"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { useWalletContext } from "@/components/tw-blocks/providers/WalletProvider";
import { useWallet } from "@/components/tw-blocks/wallet-kit/useWallet";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Globe,
  Wallet,
  Copy,
  Check,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const { lang, toggleLanguage } = useLanguage();
  const { walletAddress, walletName } = useWalletContext();
  const { handleConnect, handleDisconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  // Determine user type based on route
  const isBrand = pathname?.startsWith("/brand");
  const isInfluencer = pathname?.startsWith("/influencer");
  const isDashboard = isBrand || isInfluencer;

  // Accent colors per role
  const accentColor = isBrand
    ? "text-[#1DE1B9]"
    : isInfluencer
    ? "text-pink-400"
    : "text-white";

  const accentBg = isBrand
    ? "bg-[#1DE1B9]/10 border-[#1DE1B9]/20 text-[#1DE1B9]"
    : isInfluencer
    ? "bg-pink-500/10 border-pink-500/20 text-pink-400"
    : "bg-white/10 border-white/20 text-white";

  const statusDot = isBrand
    ? "bg-[#1DE1B9]"
    : isInfluencer
    ? "bg-pink-400"
    : "bg-emerald-400";

  const shortAddress = useMemo(() => {
    if (!walletAddress) return "";
    if (walletAddress.length <= 10) return walletAddress;
    return `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  const copyAddress = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 flex h-[64px] items-center border-b border-white/5 bg-[#0f0809]/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="relative size-8 shrink-0"
          >
            <Image
              src="/logo.png"
              alt="Clippay Logo"
              fill
              className="object-contain"
            />
          </motion.div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-white/90 transition-colors">
            Clippay
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Dashboard quick-nav (only on landing when connected) */}
          {!isDashboard && walletAddress && (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/brand/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-[#1DE1B9] hover:bg-[#1DE1B9]/10 text-xs gap-1.5 cursor-pointer"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Brand
                </Button>
              </Link>
              <Link href="/influencer/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-pink-400 hover:bg-pink-500/10 text-xs gap-1.5 cursor-pointer"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Creator
                </Button>
              </Link>
            </div>
          )}

          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-white/70 hover:text-white hover:bg-white/10 gap-2 cursor-pointer"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-medium uppercase">{lang}</span>
          </Button>

          {/* Divider */}
          <div className="h-6 w-px bg-white/10" />

          {/* Wallet Section */}
          {walletAddress ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-9 px-3 gap-2 font-medium border ${accentBg} cursor-pointer`}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusDot} opacity-75`}
                    />
                    <span
                      className={`relative inline-flex h-2 w-2 rounded-full ${statusDot}`}
                    />
                  </span>
                  <span className="hidden sm:inline text-xs">
                    {walletName}
                  </span>
                  <span className="font-mono text-xs opacity-70">
                    {shortAddress}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0 bg-[#18181b] border-white/10"
                align="end"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-white/60" />
                      <span className="font-medium text-white text-sm">
                        {walletName}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      TESTNET
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                      Stellar Address
                    </p>
                    <p className="font-mono text-xs text-white/80 break-all leading-relaxed">
                      {walletAddress}
                    </p>
                  </div>

                  {isDashboard && (
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                        Role
                      </p>
                      <p className={`text-sm font-medium ${accentColor}`}>
                        {isBrand ? "Brand / Issuer" : "Content Creator"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 p-3 flex gap-2">
                  <Button
                    onClick={copyAddress}
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-white/60 hover:text-white hover:bg-white/10 cursor-pointer text-xs"
                    disabled={copied}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDisconnect}
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer text-xs"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1.5" />
                    Disconnect
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex items-center gap-2">
              {!isDashboard && (
                <Link href="/brand/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hidden md:flex text-xs cursor-pointer"
                  >
                    Log In
                  </Button>
                </Link>
              )}
              <Button
                size="sm"
                onClick={handleConnect}
                className="bg-white text-black hover:bg-white/90 text-xs font-bold rounded-full px-5 gap-2 cursor-pointer"
              >
                <Wallet className="h-3.5 w-3.5" />
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
