// ============================================================
// Clippay MVP - Mock Data
// Simulated state for brands, influencers, campaigns, and links
// ============================================================

import type {
  Brand,
  Influencer,
  Campaign,
  TrackingLink,
  PurchaseEvent,
  BrandDashboardStats,
  InfluencerDashboardStats,
} from "./types";

// ---------- Mocked Wallet Addresses ----------

export const MOCK_BRAND_ADDRESS =
  "GDXSRISWI3NREZSN4JPA4DVJWSOKXUT7XMYQIOVG5FHXWLQHSWGQZEL";
export const MOCK_INFLUENCER_ADDRESS =
  "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
export const MOCK_PLATFORM_ADDRESS =
  "GCFMQXIRXFJR5DNFBXHG3NMQC3CFTEQKQUSRSXWM4B6K2DPBGYRD5HAR";

// ---------- Brands ----------

export const MOCK_BRANDS: Brand[] = [
  {
    id: "brand-001",
    walletAddress: MOCK_BRAND_ADDRESS,
    name: "Clip&Cash",
    logoUrl: "/brand-logo.svg",
    description:
      "Tienda boutique de moda sostenible en CDMX. Conectando estilo con blockchain.",
    createdAt: "2026-01-15T10:00:00Z",
  },
];

// ---------- Influencers ----------

export const MOCK_INFLUENCERS: Influencer[] = [
  {
    id: "influencer-001",
    walletAddress: MOCK_INFLUENCER_ADDRESS,
    displayName: "María López",
    avatarUrl: "/avatar-maria.jpg",
    bio: "Content creator de lifestyle y moda. 50k seguidores en TikTok.",
    totalEarnings: 1240.5,
    createdAt: "2026-01-20T14:30:00Z",
  },
  {
    id: "influencer-002",
    walletAddress: "GCYB7JC2MW5E7MKNBZ5PWJTEK5CGXLFNHQAQFHQQ75CPW2GJJBFKLTDB",
    displayName: "Carlos Ruiz",
    avatarUrl: "/avatar-carlos.jpg",
    bio: "Foodie y reviewer de restaurantes locales. 30k en Instagram.",
    totalEarnings: 890.0,
    createdAt: "2026-02-01T09:15:00Z",
  },
];

// ---------- Campaigns ----------

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "campaign-001",
    brandId: "brand-001",
    title: "Summer Collection Launch",
    description:
      "Promoción de la colección de verano. Los creadores comparten un QR que da 10% de descuento al cliente y genera una recompensa de 5 USDC por cada compra confirmada.",
    cpaAmount: 5,
    totalBudget: 500,
    budgetUsed: 125,
    status: "active",
    escrowContractId: "CAB2YMZWQ5EDFOQNZHGLVJPTPWPJKFCGPG2BPQDXKRYZM32YFQKSTEST",
    escrowFunded: true,
    influencerIds: ["influencer-001", "influencer-002"],
    createdAt: "2026-02-01T12:00:00Z",
    updatedAt: "2026-02-15T08:30:00Z",
  },
  {
    id: "campaign-002",
    brandId: "brand-001",
    title: "Valentine's Special",
    description:
      "Campaña especial de San Valentín con paquetes de regalo. Recompensa de 8 USDC por compra.",
    cpaAmount: 8,
    totalBudget: 1000,
    budgetUsed: 640,
    status: "active",
    escrowContractId: "CDLZFC5VDCM7WO4AF5QDPCHJMTO7RMRL4OY2FA6LWY3YVF3BOQ7XTEST",
    escrowFunded: true,
    influencerIds: ["influencer-001"],
    createdAt: "2026-02-05T10:00:00Z",
    updatedAt: "2026-02-14T19:00:00Z",
  },
  {
    id: "campaign-003",
    brandId: "brand-001",
    title: "Spring Pre-Launch",
    description: "Pre-lanzamiento de colección primavera. Sin fondear todavía.",
    cpaAmount: 3,
    totalBudget: 300,
    budgetUsed: 0,
    status: "draft",
    escrowFunded: false,
    influencerIds: [],
    createdAt: "2026-02-18T08:00:00Z",
    updatedAt: "2026-02-18T08:00:00Z",
  },
];

// ---------- Tracking Links ----------

export const MOCK_TRACKING_LINKS: TrackingLink[] = [
  {
    id: "link-001",
    campaignId: "campaign-001",
    influencerId: "influencer-001",
    code: "MARIA-SUMMER-2026",
    url: "/api/webhook/purchase?code=MARIA-SUMMER-2026",
    clicks: 342,
    conversions: 25,
    createdAt: "2026-02-02T10:00:00Z",
  },
  {
    id: "link-002",
    campaignId: "campaign-001",
    influencerId: "influencer-002",
    code: "CARLOS-SUMMER-2026",
    url: "/api/webhook/purchase?code=CARLOS-SUMMER-2026",
    clicks: 189,
    conversions: 12,
    createdAt: "2026-02-02T10:30:00Z",
  },
  {
    id: "link-003",
    campaignId: "campaign-002",
    influencerId: "influencer-001",
    code: "MARIA-VDAY-2026",
    url: "/api/webhook/purchase?code=MARIA-VDAY-2026",
    clicks: 520,
    conversions: 80,
    createdAt: "2026-02-06T12:00:00Z",
  },
];

// ---------- Purchase Events ----------

export const MOCK_PURCHASE_EVENTS: PurchaseEvent[] = [
  {
    id: "purchase-001",
    trackingLinkId: "link-001",
    campaignId: "campaign-001",
    influencerId: "influencer-001",
    customerAmount: 89.99,
    rewardAmount: 5,
    status: "released",
    txHash: "abc123def456789",
    createdAt: "2026-02-10T15:30:00Z",
  },
  {
    id: "purchase-002",
    trackingLinkId: "link-003",
    campaignId: "campaign-002",
    influencerId: "influencer-001",
    customerAmount: 149.99,
    rewardAmount: 8,
    status: "confirmed",
    createdAt: "2026-02-14T11:00:00Z",
  },
  {
    id: "purchase-003",
    trackingLinkId: "link-002",
    campaignId: "campaign-001",
    influencerId: "influencer-002",
    customerAmount: 65.0,
    rewardAmount: 5,
    status: "pending",
    createdAt: "2026-02-17T09:45:00Z",
  },
];

// ---------- Dashboard Stats Helpers ----------

export function getBrandDashboardStats(brandId: string): BrandDashboardStats {
  const brandCampaigns = MOCK_CAMPAIGNS.filter(
    (c) => c.brandId === brandId && c.status === "active"
  );
  const totalBudget = brandCampaigns.reduce((sum, c) => sum + c.totalBudget, 0);
  const totalSpent = brandCampaigns.reduce((sum, c) => sum + c.budgetUsed, 0);
  const totalConversions = MOCK_TRACKING_LINKS
    .filter((l) => brandCampaigns.some((c) => c.id === l.campaignId))
    .reduce((sum, l) => sum + l.conversions, 0);

  return {
    activeCampaigns: brandCampaigns.length,
    totalBudgetDeployed: totalBudget,
    totalSpent,
    totalConversions,
    remainingBalance: totalBudget - totalSpent,
  };
}

export function getInfluencerDashboardStats(
  influencerId: string
): InfluencerDashboardStats {
  const influencer = MOCK_INFLUENCERS.find((i) => i.id === influencerId);
  const links = MOCK_TRACKING_LINKS.filter(
    (l) => l.influencerId === influencerId
  );
  const purchases = MOCK_PURCHASE_EVENTS.filter(
    (p) => p.influencerId === influencerId
  );

  const totalEarnings = influencer?.totalEarnings ?? 0;
  const pendingEarnings = purchases
    .filter((p) => p.status === "confirmed" || p.status === "pending")
    .reduce((sum, p) => sum + p.rewardAmount, 0);
  const totalConversions = links.reduce((sum, l) => sum + l.conversions, 0);

  return {
    activeCampaigns: links.length,
    totalEarnings,
    pendingEarnings,
    totalConversions,
    availableForWithdraw: pendingEarnings,
  };
}

// ---------- Lookup Helpers ----------

export function getCampaignsByBrand(brandId: string): Campaign[] {
  return MOCK_CAMPAIGNS.filter((c) => c.brandId === brandId);
}

export function getCampaignsByInfluencer(influencerId: string): Campaign[] {
  return MOCK_CAMPAIGNS.filter((c) =>
    c.influencerIds.includes(influencerId)
  );
}

export function getTrackingLinkByCode(code: string): TrackingLink | undefined {
  return MOCK_TRACKING_LINKS.find((l) => l.code === code);
}

export function getInfluencerById(id: string): Influencer | undefined {
  return MOCK_INFLUENCERS.find((i) => i.id === id);
}

export function getCampaignById(id: string): Campaign | undefined {
  return MOCK_CAMPAIGNS.find((c) => c.id === id);
}
