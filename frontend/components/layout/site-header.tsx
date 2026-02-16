"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Globe, User } from "lucide-react";
import { motion } from "framer-motion";

export function SiteHeader() {
  const pathname = usePathname();
  const { lang, toggleLanguage } = useLanguage();

  // Determine user type based on route
  const isBrand = pathname?.startsWith("/brand");
  const isInfluencer = pathname?.startsWith("/influencer");
  const isDashboard = isBrand || isInfluencer;

  // Avatar Color Setup
  // Brand: Cyan (#1DE1B9)
  // Influencer: Primary (Pink)
  // Default: Gray/White
  const avatarColor = isBrand
    ? "bg-[#1DE1B9]"
    : isInfluencer
    ? "bg-primary"
    : "bg-zinc-500";
    
  const avatarGlow = isBrand
    ? "shadow-[0_0_10px_rgba(29,225,185,0.5)]"
    : isInfluencer
    ? "shadow-[0_0_10px_rgba(236,72,153,0.5)]"
    : "";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 flex h-[64px] items-center border-b border-white/5 bg-[#0f0809]/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4 lg:px-8">
        {/* Logo - Returns to Landing */}
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

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-white/70 hover:text-white hover:bg-white/10 gap-2"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-medium uppercase">{lang}</span>
          </Button>

          {/* User Avatar (Only visible if "logged in" context implies it, or always show placeholder) */}
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            {isDashboard ? ( 
               <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                      <p className="text-xs font-medium text-white">
                          {isBrand ? "Business Account" : "Content Creator"}
                      </p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">
                          {isBrand ? "Pro Plan" : "Verified"}
                      </p>
                  </div>
                  <div className="relative group cursor-pointer">
                      {/* Avatar Circle */}
                      <div className={`h-8 w-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden`}>
                          <User className="h-4 w-4 text-white/50" />
                      </div>
                      
                      {/* Status Indicator / Color Button */}
                      <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#0f0809] ${avatarColor} ${avatarGlow}`} />
                  </div>
               </div>
            ) : (
                // Landing Page State
                <div className="flex items-center gap-2">
                     <Link href="/brand/dashboard">
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hidden md:flex">
                            Log In
                        </Button>
                     </Link>
                     <Button size="sm" className="bg-white text-black hover:bg-white/90 text-xs font-bold rounded-full px-4">
                        Get Started
                     </Button>
                </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
