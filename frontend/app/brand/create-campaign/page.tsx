// @ts-nocheck
"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { useClippayWallet } from "@/hooks/use-clippay-wallet";
import { useCreateCampaign } from "@/hooks/use-create-campaign";
import { WalletGate } from "@/components/wallet-gate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  DollarSign,
  Target,
  Users,
  ShieldCheck,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOCK_INFLUENCER_ADDRESS } from "@/lib/mock-data";

export default function CreateCampaignPage() {
  const { t } = useLanguage();
  const { shortAddress } = useClippayWallet();
  const { form, isSubmitting, estimatedConversions, handleSubmit } =
    useCreateCampaign();

  return (
    <WalletGate role="brand">
      <div className="min-h-screen bg-[#0f0809] text-white p-6 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-6 pt-4">
          {/* Back link */}
          <Link
            href="/brand/dashboard"
            className="flex items-center text-white/50 hover:text-white transition-colors text-sm group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            {t.brand.backToDashboard}
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-light">{t.brand.createCampaign}</h1>
              <Badge
                variant="outline"
                className="bg-[#1DE1B9]/10 text-[#1DE1B9] border-[#1DE1B9]/20 text-[10px]"
              >
                STELLAR ESCROW
              </Badge>
            </div>
            <p className="text-white/50 text-sm">
              Define your bounty, assign a creator, and deploy an escrow
              contract on Stellar Testnet.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Form {...form}>
              <form onSubmit={handleSubmit}>
                <Card className="bg-[#18181b] border-white/10 overflow-hidden">
                  {/* Section 1: Campaign Info */}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center gap-2 text-base">
                      <Sparkles className="h-4 w-4 text-[#1DE1B9]" />
                      {t.brand.campaignDetails}
                    </CardTitle>
                    <CardDescription className="text-white/40">
                      {t.brand.campaignSubtitle}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">
                            {t.brand.campaignTitle}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Summer Collection Launch"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">
                            {t.brand.description}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what creators need to do to earn rewards..."
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Divider */}
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-[#18181b] px-3 text-[10px] text-white/30 uppercase tracking-widest">
                          {t.brand.budgetRewards}
                        </span>
                      </div>
                    </div>

                    {/* Budget Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cpaAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80 flex items-center gap-1.5">
                              <DollarSign className="h-3 w-3 text-white/40" />
                              {t.brand.bountyPerSale}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="5.00"
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 pr-16"
                                  {...field}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 font-mono">
                                  USDC
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="totalBudget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80 flex items-center gap-1.5">
                              <Target className="h-3 w-3 text-white/40" />
                              {t.brand.totalBudget}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="500.00"
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 pr-16"
                                  {...field}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 font-mono">
                                  USDC
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Estimated conversions */}
                    {estimatedConversions > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-4 bg-[#1DE1B9]/5 border border-[#1DE1B9]/15 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-[#1DE1B9]" />
                          <span className="text-sm text-[#1DE1B9]/80">
                            {t.brand.estimatedConversions}
                          </span>
                        </div>
                        <span className="font-bold text-[#1DE1B9] tabular-nums">
                          {estimatedConversions.toLocaleString()} {t.brand.sales}
                        </span>
                      </motion.div>
                    )}

                    {/* Divider */}
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-[#18181b] px-3 text-[10px] text-white/30 uppercase tracking-widest">
                          Escrow Participants
                        </span>
                      </div>
                    </div>

                    {/* Service Provider (Influencer) */}
                    <FormField
                      control={form.control}
                      name="serviceProviderAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80 flex items-center gap-1.5">
                            <Users className="h-3 w-3 text-white/40" />
                            Creator Wallet (Service Provider)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="G..."
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 font-mono text-xs"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <button
                            type="button"
                            onClick={() =>
                              form.setValue(
                                "serviceProviderAddress",
                                MOCK_INFLUENCER_ADDRESS
                              )
                            }
                            className="text-[10px] text-[#1DE1B9]/60 hover:text-[#1DE1B9] transition-colors cursor-pointer"
                          >
                            Use mock influencer address (María López)
                          </button>
                        </FormItem>
                      )}
                    />

                    {/* Info cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                          Issuer / Approver
                        </p>
                        <p className="text-xs text-white/70 font-mono">
                          {shortAddress || "Connect wallet"}
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          Your wallet (brand)
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                          Platform Fee
                        </p>
                        <p className="text-xs text-white/70">5% → Clippay Treasury</p>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          Deducted on release
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  {/* Footer */}
                  <CardFooter className="flex justify-between border-t border-white/10 pt-6 pb-6">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                      asChild
                    >
                      <Link href="/brand/dashboard">{t.brand.cancel}</Link>
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#1DE1B9] hover:bg-[#1DE1B9]/90 text-black font-bold shadow-[0_0_20px_rgba(29,225,185,0.3)] gap-2 px-6 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Deploying Escrow…
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          {t.brand.createDeposit}
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pb-12"
          >
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                {
                  step: "01",
                  label: "Deploy Escrow",
                  desc: "Smart contract on Stellar",
                },
                {
                  step: "02",
                  label: "Fund USDC",
                  desc: "Deposit budget into escrow",
                },
                {
                  step: "03",
                  label: "Pay on Results",
                  desc: "Release on verified conversions",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-2"
                >
                  <span className="text-[#1DE1B9] text-[10px] font-mono font-bold">
                    {item.step}
                  </span>
                  <p className="text-xs font-medium text-white/80">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-white/30">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </WalletGate>
  );
}
