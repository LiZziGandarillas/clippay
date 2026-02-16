"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Copy, DollarSign, QrCode, Wallet } from "lucide-react";

export default function InfluencerDashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0f0809] text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header content removed as it's in layout now, keeping page specific */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-xl font-light">{t.influencer.creatorHub}</h1>
                <p className="text-xs text-white/50 uppercase tracking-widest">{t.influencer.activeBounties}</p>
            </div>
            <Button variant="outline" className="border-white/10 bg-white/5 text-xs h-8 gap-2 hover:bg-white/10 hover:text-white">
                <Wallet className="h-3 w-3" /> {t.influencer.connectWallet}
            </Button>
        </div>

        {/* Earnings Card */}
        <Card className="bg-primary/20 border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <DollarSign className="h-32 w-32 text-primary" />
            </div>
            <CardContent className="p-6 md:p-10 relative z-10">
                <p className="text-sm text-primary uppercase tracking-widest mb-1">{t.influencer.totalEarnings}</p>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">$1,240.50 <span className="text-lg font-light text-white/60">USDC</span></h2>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/25 w-full md:w-auto md:px-8">
                    {t.influencer.withdrawFunds}
                </Button>
            </CardContent>
        </Card>

        {/* Active Campaigns */}
        <div className="space-y-4">
             <h3 className="text-sm font-light text-white/80 uppercase tracking-widest">{t.influencer.activeCampaigns}</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campaign Card 1 */}
                <Card className="bg-[#18181b] border-white/10 hover:border-primary/50 transition-colors group cursor-pointer">
                   <CardHeader className="pb-2">
                       <div className="flex justify-between items-start">
                           <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">Active</Badge>
                           <span className="text-xs text-white/40">{t.influencer.endsIn} 2 days</span>
                       </div>
                       <CardTitle className="text-lg text-white mt-2">Summer Collection Launch</CardTitle>
                       <p className="text-xs text-white/50">Fashion • TikTok</p>
                   </CardHeader>
                   <CardContent className="space-y-4 pb-2">
                       <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                           <div className="text-center">
                               <p className="text-[10px] text-white/40 uppercase">{t.influencer.bounty}</p>
                               <p className="text-lg font-bold text-primary">$50</p>
                           </div>
                            <div className="h-8 w-px bg-white/10" />
                           <div className="text-center">
                               <p className="text-[10px] text-white/40 uppercase">{t.influencer.yourSales}</p>
                               <p className="text-lg font-bold text-white">12</p>
                           </div>
                            <div className="h-8 w-px bg-white/10" />
                           <div className="text-center">
                               <p className="text-[10px] text-white/40 uppercase">{t.influencer.earned}</p>
                               <p className="text-lg font-bold text-white">$600</p>
                           </div>
                       </div>
                       
                       <div className="space-y-2">
                           <p className="text-xs text-white/60">{t.influencer.uniqueLink}</p>
                           <div className="flex gap-2">
                               <div className="flex-1 bg-black/50 border border-white/10 rounded-md px-3 py-2 text-xs text-white/80 font-mono flex items-center justify-between">
                                   clippay.app/r/sarah-style
                                   <CheckCircle2 className="h-3 w-3 text-primary" />
                               </div>
                               <Button size="icon" variant="outline" className="h-9 w-9 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white">
                                   <Copy className="h-3 w-3" />
                               </Button>
                                <Button size="icon" variant="outline" className="h-9 w-9 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white">
                                   <QrCode className="h-3 w-3" />
                               </Button>
                           </div>
                       </div>
                   </CardContent>
                   <CardFooter className="pt-2">
                        <Button className="w-full bg-white/5 hover:bg-white/10 text-white hover:text-white/90 border border-white/10 text-xs">
                           {t.influencer.viewDetails}
                        </Button>
                   </CardFooter>
                </Card>

                 {/* Campaign Card 2 */}
                <Card className="bg-[#18181b] border-white/10 hover:border-primary/50 transition-colors group cursor-pointer opacity-70 hover:opacity-100">
                   <CardHeader className="pb-2">
                       <div className="flex justify-between items-start">
                           <Badge variant="outline" className="text-white/60 border-white/20">Pending</Badge>
                           <span className="text-xs text-white/40">Starts tomorrow</span>
                       </div>
                       <CardTitle className="text-lg text-white mt-2">Tech Gadgets Review</CardTitle>
                       <p className="text-xs text-white/50">Tech • YouTube</p>
                   </CardHeader>
                   <CardContent className="pb-4">
                        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                           <div className="bg-primary/20 p-2 rounded-full">
                               <DollarSign className="h-4 w-4 text-primary" />
                           </div>
                           <div>
                               <p className="text-sm font-medium text-white">Earn $75 per sale</p>
                               <p className="text-xs text-white/40">High ticket item bounty</p>
                           </div>
                       </div>
                   </CardContent>
                    <CardFooter className="pt-0">
                        <Button className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                           {t.influencer.apply}
                        </Button>
                   </CardFooter>
                </Card>
             </div>
        </div>
      </div>
    </div>
  );
}
