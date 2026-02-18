// ============================================================
// Clippay MVP - Core TypeScript Interfaces
// All domain types for Brand, Influencer, Campaign, and Escrow
// ============================================================

// ---------- Wallet / Auth ----------

export type UserRole = "brand" | "influencer";

export interface WalletState {
  address: string | null;
  name: string | null;
  isConnected: boolean;
  network: "testnet" | "mainnet";
}

// ---------- Brand ----------

export interface Brand {
  id: string;
  walletAddress: string;
  name: string;
  logoUrl?: string;
  description?: string;
  createdAt: string;
}

// ---------- Influencer / Creator ----------

export interface Influencer {
  id: string;
  walletAddress: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  totalEarnings: number; // in USDC
  createdAt: string;
}

// ---------- Campaign ----------

export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "cancelled";

export interface Campaign {
  id: string;
  brandId: string;
  title: string;
  description: string;
  /** Cost-per-action in USDC – the reward per qualifying purchase */
  cpaAmount: number;
  /** Total budget deposited in escrow (USDC) */
  totalBudget: number;
  /** How much has been released so far */
  budgetUsed: number;
  status: CampaignStatus;
  /** Trustless Work escrow contract ID (on-chain) */
  escrowContractId?: string;
  /** Whether escrow has been funded on-chain */
  escrowFunded: boolean;
  /** Assigned influencer IDs */
  influencerIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------- Tracking / QR Link ----------

export interface TrackingLink {
  id: string;
  campaignId: string;
  influencerId: string;
  /** The unique code used in the QR / URL */
  code: string;
  /** Full URL for the QR/link (e.g. /api/webhook/purchase?code=XYZ) */
  url: string;
  /** Number of scans / clicks */
  clicks: number;
  /** Number of confirmed purchases */
  conversions: number;
  createdAt: string;
}

// ---------- Purchase Event ----------

export type PurchaseStatus = "pending" | "confirmed" | "released" | "failed";

export interface PurchaseEvent {
  id: string;
  trackingLinkId: string;
  campaignId: string;
  influencerId: string;
  /** Amount paid by end customer (informational) */
  customerAmount: number;
  /** CPA reward amount in USDC to the influencer */
  rewardAmount: number;
  status: PurchaseStatus;
  /** Trustless Work state-update tx hash */
  txHash?: string;
  createdAt: string;
}

// ---------- Escrow (Trustless Work) ----------

export type EscrowStatus =
  | "initialized"
  | "funded"
  | "milestone_approved"
  | "released"
  | "disputed"
  | "resolved";

export interface ClippayEscrow {
  contractId: string;
  campaignId: string;
  /** Brand wallet – acts as "issuer" / "approver" in TW terms */
  issuerAddress: string;
  /** Influencer wallet – acts as "service provider" */
  serviceProviderAddress: string;
  /** Platform fee receiver (Clippay treasury) */
  platformAddress: string;
  amount: number;
  balance: number;
  status: EscrowStatus;
  milestones: EscrowMilestone[];
  createdAt: string;
}

export interface EscrowMilestone {
  index: number;
  description: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  evidence?: string;
}

// ---------- Payload types for API / hooks ----------

export interface InitializeEscrowPayload {
  campaignId: string;
  title: string;
  description: string;
  amount: number;
  issuerAddress: string;
  serviceProviderAddress: string;
  platformAddress: string;
  platformFee: string; // percentage as string, e.g. "5"
}

export interface FundEscrowPayload {
  contractId: string;
  amount: number;
  signerAddress: string;
}

export interface WebhookPurchasePayload {
  trackingCode: string;
  customerAmount: number;
}

export interface WebhookPurchaseResponse {
  success: boolean;
  purchaseId: string;
  rewardAmount: number;
  message: string;
}

// ---------- Dashboard summary types ----------

export interface BrandDashboardStats {
  activeCampaigns: number;
  totalBudgetDeployed: number;
  totalSpent: number;
  totalConversions: number;
  remainingBalance: number;
}

export interface InfluencerDashboardStats {
  activeCampaigns: number;
  totalEarnings: number;
  pendingEarnings: number;
  totalConversions: number;
  availableForWithdraw: number;
}
