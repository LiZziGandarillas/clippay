"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { useClippayWallet } from "@/hooks/use-clippay-wallet";
import { useFundCampaign } from "@/hooks/use-fund-campaign";
import { WalletGate } from "@/components/wallet-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Wallet,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Zap,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import {
  getBrandDashboardStats,
  getCampaignsByBrand,
  getInfluencerById,
  MOCK_TRACKING_LINKS,
  MOCK_PURCHASE_EVENTS,
} from "@/lib/mock-data";
import type { Campaign } from "@/lib/types";

// ---------- Status badge config ----------

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  active: {
    label: "Active",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  draft: {
    label: "Draft",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  paused: {
    label: "Paused",
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    dot: "bg-zinc-400",
  },
  completed: {
    label: "Completed",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-500/10",
    text: "text-red-400",
    dot: "bg-red-400",
  },
};

// ---------- Helpers ----------

function truncateContractId(id: string) {
  return `${id.slice(0, 6)}...${id.slice(-4)}`;
}

function getCampaignConversions(campaignId: string) {
  return MOCK_TRACKING_LINKS.filter((l) => l.campaignId === campaignId).reduce(
    (sum, l) => sum + l.conversions,
    0
  );
}

function getCampaignRecentEvents(campaignId: string) {
  return MOCK_PURCHASE_EVENTS.filter((p) => p.campaignId === campaignId);
}

// ---------- Stat Card Component ----------

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <Card className="bg-[#18181b] border-white/[0.06] group hover:border-white/10 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div
            className={`h-9 w-9 rounded-lg flex items-center justify-center ${
              accent
                ? "bg-[#1DE1B9]/10 border border-[#1DE1B9]/20"
                : "bg-white/[0.04] border border-white/[0.06]"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${
                accent ? "text-[#1DE1B9]" : "text-white/50"
              }`}
            />
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-[11px] text-white/40 uppercase tracking-wider font-medium">
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-light tracking-tight ${
                accent ? "text-[#1DE1B9]" : "text-white"
              }`}
            >
              {value}
            </span>
            {suffix && (
              <span className="text-xs text-white/30 font-medium">
                {suffix}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- Campaign Card Component ----------

function CampaignCard({
  campaign,
  onFund,
  isFunding,
  fundingContractId,
}: {
  campaign: Campaign;
  onFund: (contractId: string, amount: number) => void;
  isFunding: boolean;
  fundingContractId: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const status = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.draft;
  const budgetPercent =
    campaign.totalBudget > 0
      ? Math.round((campaign.budgetUsed / campaign.totalBudget) * 100)
      : 0;
  const conversions = getCampaignConversions(campaign.id);
  const events = getCampaignRecentEvents(campaign.id);
  const isFundingThis =
    isFunding && fundingContractId === campaign.escrowContractId;

  const influencerNames = campaign.influencerIds
    .map((id) => getInfluencerById(id)?.displayName ?? "Unknown")
    .slice(0, 3);

  const copyContractId = () => {
    if (campaign.escrowContractId) {
      navigator.clipboard.writeText(campaign.escrowContractId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="bg-[#18181b] border-white/[0.06] overflow-hidden group hover:border-white/10 transition-all duration-300">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-5 pb-4 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-white truncate">
                {campaign.title}
              </h3>
              <p className="text-xs text-white/40 line-clamp-1">
                {campaign.description}
              </p>
            </div>
            <Badge
              className={`${status.bg} ${status.text} border-0 text-[10px] px-2 py-0.5 flex-shrink-0`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${status.dot} mr-1.5 inline-block`}
              />
              {status.label}
            </Badge>
          </div>

          {/* Quick Stats Row */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-white/50">
              <DollarSign className="h-3 w-3" />
              <span>
                <span className="text-white font-medium">
                  {campaign.cpaAmount}
                </span>{" "}
                USDC/action
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50">
              <Target className="h-3 w-3" />
              <span>
                <span className="text-white font-medium">{conversions}</span>{" "}
                conversions
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50">
              <Users className="h-3 w-3" />
              <span className="text-white font-medium">
                {campaign.influencerIds.length}
              </span>
            </div>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="px-5 pb-4 space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-white/40">Budget used</span>
            <span className="text-white/60 font-mono">
              {campaign.budgetUsed.toLocaleString()} /{" "}
              {campaign.totalBudget.toLocaleString()} USDC
            </span>
          </div>
          <div className="relative h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 bg-gradient-to-r from-[#1DE1B9]/60 to-[#1DE1B9]"
              style={{ width: `${Math.min(budgetPercent, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-white/30 text-right">
            {budgetPercent}% utilized
          </p>
        </div>

        {/* Influencers Row */}
        {influencerNames.length > 0 && (
          <div className="px-5 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {influencerNames.map((name, i) => (
                  <div
                    key={i}
                    className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center"
                  >
                    <span className="text-[8px] text-white/70 font-medium">
                      {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-white/40">
                {influencerNames.join(", ")}
              </span>
            </div>
          </div>
        )}

        {/* Escrow Section */}
        <div className="border-t border-white/[0.04] p-5 space-y-3">
          {campaign.escrowContractId ? (
            <>
              {/* Contract ID */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-white/30" />
                  <span className="text-[11px] text-white/40">Contract</span>
                </div>
                <button
                  onClick={copyContractId}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-white/60 hover:text-white transition-colors"
                >
                  {truncateContractId(campaign.escrowContractId)}
                  {copied ? (
                    <Check className="h-3 w-3 text-[#1DE1B9]" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-40" />
                  )}
                </button>
              </div>

              {/* Escrow Status */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/40">Escrow</span>
                {campaign.escrowFunded ? (
                  <Badge className="bg-[#1DE1B9]/10 text-[#1DE1B9] border-0 text-[10px]">
                    <Zap className="h-2.5 w-2.5 mr-1" />
                    Funded
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500/10 text-amber-400 border-0 text-[10px]">
                    Awaiting Funds
                  </Badge>
                )}
              </div>

              {/* Fund Button (only for unfunded) */}
              {!campaign.escrowFunded && (
                <Button
                  onClick={() =>
                    onFund(campaign.escrowContractId!, campaign.totalBudget)
                  }
                  disabled={isFunding}
                  className="w-full bg-[#1DE1B9] hover:bg-[#1DE1B9]/90 text-black font-medium h-9 text-xs"
                >
                  {isFundingThis ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Funding...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-3 w-3" />
                      Fund Escrow — {campaign.totalBudget} USDC
                    </>
                  )}
                </Button>
              )}
            </>
          ) : (
            /* No escrow yet (draft) */
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/30">
                <FileText className="h-3.5 w-3.5" />
                <span className="text-[11px]">
                  No escrow contract deployed
                </span>
              </div>
              <Badge className="bg-white/[0.04] text-white/30 border-0 text-[10px]">
                Draft
              </Badge>
            </div>
          )}
        </div>

        {/* Recent Events (if any) */}
        {events.length > 0 && (
          <div className="border-t border-white/[0.04] px-5 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-white/30 uppercase tracking-wider">
                Recent activity
              </span>
              <span className="text-[10px] text-white/20">
                {events.length} events
              </span>
            </div>
            <div className="space-y-1.5">
              {events.slice(0, 2).map((event) => {
                const influencer = getInfluencerById(event.influencerId);
                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2 text-white/50">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          event.status === "released"
                            ? "bg-[#1DE1B9]"
                            : event.status === "confirmed"
                            ? "bg-amber-400"
                            : "bg-white/20"
                        }`}
                      />
                      <span>{influencer?.displayName ?? "Unknown"}</span>
                    </div>
                    <span className="text-white/40 font-mono">
                      {event.rewardAmount} USDC
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ===============================================================
// Brand Dashboard Page
// ===============================================================

export default function BrandDashboardPage() {
  const { t } = useLanguage();
  const { shortAddress, brand } = useClippayWallet();
  const { fund, isFunding, fundingContractId } = useFundCampaign();

  const brandId = brand?.id ?? "brand-001";
  const stats = getBrandDashboardStats(brandId);
  const campaigns = getCampaignsByBrand(brandId);

  const handleFund = async (contractId: string, amount: number) => {
    await fund(contractId, amount);
  };

  return (
    <WalletGate role="brand">
      <div className="min-h-screen bg-[#0f0809] text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#1DE1B9]/10 border border-[#1DE1B9]/20 flex items-center justify-center">
                  <div className="h-3 w-3 bg-[#1DE1B9] rounded-sm" />
                </div>
                <h1 className="text-xl font-light tracking-tight">
                  {t.brand.dashboard}
                </h1>
              </div>
              <p className="text-xs text-white/40 ml-[42px]">
                Manage campaigns, fund escrows, and track conversions
                {shortAddress && (
                  <span className="ml-2 font-mono text-white/25">
                    {shortAddress}
                  </span>
                )}
              </p>
            </div>
            <Button
              asChild
              className="bg-[#1DE1B9] hover:bg-[#1DE1B9]/90 text-black font-medium h-9 text-xs px-4"
            >
              <Link href="/brand/create-campaign">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                {t.brand.createCampaign}
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon={Zap}
              label="Active Campaigns"
              value={stats.activeCampaigns}
              accent
            />
            <StatCard
              icon={Wallet}
              label="Budget Deployed"
              value={stats.totalBudgetDeployed.toLocaleString()}
              suffix="USDC"
            />
            <StatCard
              icon={TrendingUp}
              label="Total Spent"
              value={stats.totalSpent.toLocaleString()}
              suffix="USDC"
            />
            <StatCard
              icon={Target}
              label="Conversions"
              value={stats.totalConversions}
            />
          </div>

          {/* Remaining Balance Banner */}
          <div className="relative">
            <div className="absolute -top-8 -right-8 w-36 h-36 bg-[#1DE1B9]/10 rounded-full blur-3xl pointer-events-none" />
            <Card className="bg-gradient-to-r from-[#18181b] to-[#1a1a1f] border-white/[0.06] overflow-hidden relative">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#1DE1B9]/10 border border-[#1DE1B9]/20 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-[#1DE1B9]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40 uppercase tracking-wider">
                      Remaining Escrow Balance
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-light tracking-tight text-white">
                        {stats.remainingBalance.toLocaleString()}
                      </span>
                      <span className="text-sm text-white/40">USDC</span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-[#1DE1B9]/10 text-[#1DE1B9] border-[#1DE1B9]/20 text-[10px] h-6 w-fit"
                >
                  STELLAR TESTNET
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-white/80 flex items-center gap-2">
                <FileText className="h-4 w-4 text-white/30" />
                Campaigns
                <span className="text-xs text-white/30 font-normal ml-1">
                  ({campaigns.length})
                </span>
              </h2>
              <Link
                href="/brand/create-campaign"
                className="text-[11px] text-[#1DE1B9]/70 hover:text-[#1DE1B9] transition-colors flex items-center gap-1"
              >
                New campaign
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {campaigns.length === 0 ? (
              /* Empty State */
              <Card className="bg-[#18181b] border-white/[0.06] border-dashed">
                <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <Plus className="h-6 w-6 text-white/20" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-white/60">
                      No campaigns yet
                    </p>
                    <p className="text-xs text-white/30">
                      Create your first campaign and deploy an escrow
                      contract to start paying creators per conversion.
                    </p>
                  </div>
                  <Button
                    asChild
                    className="bg-[#1DE1B9] hover:bg-[#1DE1B9]/90 text-black font-medium h-9 text-xs"
                  >
                    <Link href="/brand/create-campaign">
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Create Campaign
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              /* Campaign Cards Grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onFund={handleFund}
                    isFunding={isFunding}
                    fundingContractId={fundingContractId}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] pt-6 pb-4 flex items-center justify-center gap-2 opacity-40">
            <div className="h-2 w-2 bg-[#1DE1B9]/40 rounded-full" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">
              Powered by Stellar & Trustless Work
            </span>
          </div>
        </div>
      </div>
    </WalletGate>
  );
}
