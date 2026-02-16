"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, DollarSign, Target } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CreateCampaignPage() {
  const { t } = useLanguage();
  const [bountyAmount, setBountyAmount] = useState("");
  const [totalBudget, setTotalBudget] = useState("");

  const estimatedReach = bountyAmount && totalBudget 
    ? Math.floor(parseInt(totalBudget) / parseInt(bountyAmount)) 
    : 0;

  return (
    <div className="min-h-screen bg-[#0f0809] text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-6"> {/* Increased max-w for desktop */}
        
        <Link href="/brand/dashboard" className="flex items-center text-white/50 hover:text-white transition-colors text-sm mb-4">
             <ArrowLeft className="mr-2 h-4 w-4" /> {t.brand.backToDashboard}
        </Link>

        <div>
            <h1 className="text-3xl font-light mb-2">{t.brand.createCampaign}</h1>
            <p className="text-white/60">Launch a new bounty campaign for creators.</p>
        </div>

        <Card className="bg-[#18181b] border-white/10">
            <CardHeader>
                <CardTitle className="text-white">{t.brand.campaignDetails}</CardTitle>
                <CardDescription className="text-white/40">{t.brand.campaignSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-white/80">{t.brand.campaignTitle}</Label>
                    <Input id="title" placeholder="e.g. Summer Collection Launch" className="bg-white/5 border-white/10 text-white placeholder:text-white/20" />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-white/80">{t.brand.description}</Label>
                    <Textarea 
                        id="description" 
                        placeholder="Explain what creators need to do..." 
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[100px]" 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="category" className="text-white/80">{t.brand.category}</Label>
                        <Select>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#18181b] border-white/10 text-white">
                                <SelectItem value="fashion">Fashion</SelectItem>
                                <SelectItem value="tech">Tech</SelectItem>
                                <SelectItem value="beauty">Beauty</SelectItem>
                                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="platform" className="text-white/80">{t.brand.platform}</Label>
                         <Select>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#18181b] border-white/10 text-white">
                                <SelectItem value="tiktok">TikTok</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                </div>

                <Separator className="bg-white/10 my-4" />

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-white/90">{t.brand.budgetRewards}</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bounty" className="text-white/80">{t.brand.bountyPerSale}</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                                <Input 
                                    id="bounty" 
                                    type="number"
                                    placeholder="50.00" 
                                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20" 
                                    value={bountyAmount}
                                    onChange={(e) => setBountyAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="budget" className="text-white/80">{t.brand.totalBudget}</Label>
                             <div className="relative">
                                <Target className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                                <Input 
                                    id="budget" 
                                    type="number" 
                                    placeholder="5000.00" 
                                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20" 
                                    value={totalBudget}
                                    onChange={(e) => setTotalBudget(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {estimatedReach > 0 && (
                        <div className="p-3 bg-[#1DE1B9]/10 border border-[#1DE1B9]/20 rounded-lg flex items-center justify-between">
                            <span className="text-sm text-[#1DE1B9]">{t.brand.estimatedConversions}</span>
                            <span className="font-bold text-[#1DE1B9]">{estimatedReach} {t.brand.sales}</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-white/10 pt-6">
                <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">{t.brand.cancel}</Button>
                <Button className="bg-[#1DE1B9] hover:bg-[#1DE1B9]/90 text-black font-bold shadow-[0_0_20px_rgba(29,225,185,0.3)]">
                    {t.brand.createDeposit}
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
