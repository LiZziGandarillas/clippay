"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, ShieldCheck, Activity, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function BrandDashboardPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[#0f0809] text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header - Removed manual header as it is in layout now, keeping title section */}
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#1DE1B9]/10 border border-[#1DE1B9]/20 flex items-center justify-center">
                    <div className="h-3 w-3 bg-[#1DE1B9] rounded-sm" />
                </div>
                <div>
                    <h1 className="text-xl font-light">Clip&Cash</h1>
                    <p className="text-xs text-white/50 uppercase tracking-widest">{t.brand.dashboard}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-white/70" />
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10" />
            </div>
        </div>

        {/* Main Card */}
        <div className="relative">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#1DE1B9]/20 rounded-full blur-3xl pointer-events-none" />
             
             <Card className="bg-[#18181b] border-white/10 overflow-hidden relative">
                <CardContent className="p-6 md:p-8 space-y-6">
                    {/* Status Bar */}
                    <div className="flex justify-between items-start">
                         <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-white/60" />
                            <div className="flex flex-col">
                                <span className="text-xs text-white/60 uppercase tracking-wider">{t.brand.totalEscrow}</span>
                                <span className="text-xs text-white/60 uppercase tracking-wider">Balance</span>
                            </div>
                         </div>
                         <Badge variant="outline" className="bg-[#1DE1B9]/10 text-[#1DE1B9] border-[#1DE1B9]/20 text-[10px] py-0 px-2 h-6">
                            STELLAR MAINNET
                         </Badge>
                    </div>

                    {/* Balance */}
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white">24,592.00</h2>
                            <span className="text-xl md:text-2xl text-white/60">USDC</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-400 text-xs md:text-sm">
                            <ArrowUpRight className="h-3 w-3" />
                            <span>+12.5% vs last week</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 md:max-w-md">
                        <Button className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 h-10 text-xs md:text-sm" asChild>
                            <Link href="/brand/top-up">
                                <ArrowDownLeft className="mr-2 h-3 w-3" />
                                Top Up
                            </Link>
                        </Button>
                        <Button className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 h-10 text-xs md:text-sm" asChild>
                             <Link href="/brand/create-campaign">
                                <ArrowUpRight className="mr-2 h-3 w-3" />
                                {t.brand.createCampaign}
                            </Link>
                        </Button>
                    </div>
                </CardContent>
             </Card>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            {/* Attribution Volume */}
            <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="text-sm text-white/90 font-light">{t.brand.sales} Volume</h3>
                    <span className="text-[10px] text-white/40">LAST 7 DAYS</span>
                 </div>
                 <Card className="bg-[#18181b] border-white/10 h-48 flex items-end justify-between p-6 pb-2 gap-2">
                      {/* Mock Bars */}
                      {[40, 65, 30, 85, 55, 95, 45].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                              <div 
                                className={`w-full rounded-t-sm transition-all duration-500 ${i === 5 ? 'bg-gradient-to-t from-[#1DE1B9]/50 to-[#1DE1B9] shadow-[0_0_10px_rgba(29,225,185,0.3)]' : 'bg-white/10 group-hover:bg-white/20'}`}
                                style={{ height: `${h}%` }} 
                              />
                              <span className="text-[10px] text-white/30 font-mono">
                                {['M','T','W','T','F','S','S'][i]}
                              </span>
                          </div>
                      ))}
                 </Card>
            </div>

            {/* Smart Contract Events */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm text-white/90 font-light">{t.brand.smartContractEvents}</h3>
                    <Button variant="ghost" className="text-[#1DE1B9] text-xs hover:text-[#1DE1B9]/80 hover:bg-transparent px-0 h-auto">
                        View Explorer <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                </div>

                <div className="space-y-3">
                    {/* Event Item: Sale Verified */}
                    <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-md">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                 <Badge variant="outline" className="text-[10px] text-white border-white/20 bg-transparent uppercase tracking-wider font-normal">
                                    {t.brand.sales} Verified
                                 </Badge>
                                 <span className="text-[10px] text-white/40 font-mono">2m ago</span>
                            </div>
                            <div className="flex justify-between items-start">
                                 <div className="space-y-1">
                                    <p className="text-xs text-white/50">Hash</p>
                                    <p className="text-xs text-white/90 font-mono flex items-center gap-1">
                                        0x7a...4e21
                                        <ExternalLink className="h-2 w-2 opacity-50" />
                                    </p>
                                 </div>
                                 <div className="text-right space-y-1">
                                    <p className="text-xs text-white/50">Amount</p>
                                    <p className="text-sm text-white font-medium">- $45.00 USDC</p>
                                 </div>
                            </div>
                            <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                 <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                                         <span className="text-[8px] text-white">SJ</span>
                                    </div>
                                    <span className="text-xs text-white/70">Sarah Jenkins</span>
                                 </div>
                                 <span className="text-[10px] text-white/30 uppercase tracking-widest">Campaign #882</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Event Item: Payout Released */}
                    <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-md">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                 <Badge variant="outline" className="text-[10px] text-white border-white/20 bg-transparent uppercase tracking-wider font-normal">
                                    {t.brand.payoutReleased}
                                 </Badge>
                                 <span className="text-[10px] text-white/40 font-mono">1h ago</span>
                            </div>
                             <div className="flex justify-between items-start">
                                 <div className="space-y-1">
                                    <p className="text-xs text-white/50">Hash</p>
                                    <p className="text-xs text-white/90 font-mono flex items-center gap-1">
                                        0x3b...9f02
                                        <ExternalLink className="h-2 w-2 opacity-50" />
                                    </p>
                                 </div>
                                 <div className="text-right space-y-1">
                                    <p className="text-xs text-white/50">Amount</p>
                                    <p className="text-sm text-white font-medium">- $120.50 USDC</p>
                                 </div>
                            </div>
                             <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                 <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-zinc-700 flex items-center justify-center text-white text-[8px]">
                                         MJ
                                    </div>
                                    <span className="text-xs text-white/70">Michael Jones</span>
                                 </div>
                                 <span className="text-[10px] text-white/30 uppercase tracking-widest">Campaign #882</span>
                            </div>
                        </CardContent>
                    </Card>

                     {/* Event Item: Escrow Funded */}
                     <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-md">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                 <Badge variant="outline" className="text-[10px] text-white border-white/20 bg-transparent uppercase tracking-wider font-normal">
                                    {t.brand.escrowFunded}
                                 </Badge>
                                 <span className="text-[10px] text-white/40 font-mono">4h ago</span>
                            </div>
                             <div className="flex justify-between items-start">
                                 <div className="space-y-1">
                                    <p className="text-xs text-white/50">Hash</p>
                                    <p className="text-xs text-white/90 font-mono flex items-center gap-1">
                                        0x9c...1d55
                                        <ExternalLink className="h-2 w-2 opacity-50" />
                                    </p>
                                 </div>
                                 <div className="text-right space-y-1">
                                    <p className="text-xs text-white/50">Amount</p>
                                    <p className="text-sm text-white font-medium">+ $5,000.00 USDC</p>
                                 </div>
                            </div>
                             <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                 <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-zinc-700 flex items-center justify-center text-white text-[8px]">
                                         BR
                                    </div>
                                    <span className="text-xs text-white/70">{t.brand.brandDeposit}</span>
                                 </div>
                                 <span className="text-xs text-white/70">{t.brand.treasury}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 pt-6 pb-2 flex flex-col items-center gap-2 opacity-50">
             <div className="flex items-center gap-2">
                 <div className="h-3 w-3 bg-white/20 rounded-full" /> {/* Logo placeholder */}
                 <span className="text-[10px] uppercase tracking-widest text-white">Powered by Stellar</span>
             </div>
             <span className="text-[10px] text-white/50">Clip&Cash Ecosystem v2.4</span>
        </div>
      </div>
    </div>
  );
}
