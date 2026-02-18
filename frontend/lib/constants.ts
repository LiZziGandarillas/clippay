// ============================================================
// Clippay MVP - Constants & Configuration
// ============================================================

/** Stellar network identifiers */
export const STELLAR_NETWORKS = {
  testnet: "Test SDF Network ; September 2015",
  mainnet: "Public Global Stellar Network ; September 2015",
} as const;

/** Current network based on env */
export const CURRENT_NETWORK =
  (process.env.NEXT_PUBLIC_STELLAR_NETWORK as "testnet" | "mainnet") ??
  "testnet";

/** Platform treasury address */
export const PLATFORM_ADDRESS =
  process.env.NEXT_PUBLIC_PLATFORM_ADDRESS ??
  "GCFMQXIRXFJR5DNFBXHG3NMQC3CFTEQKQUSRSXWM4B6K2DPBGYRD5HAR";

/** Platform fee as a string percentage (e.g. "5") */
export const PLATFORM_FEE =
  process.env.NEXT_PUBLIC_PLATFORM_FEE ?? "5";

/** Backend API URL for webhook endpoints */
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

/** USDC asset details on Stellar Testnet */
export const USDC_ASSET = {
  code: "USDC",
  issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
} as const;

/** Trustless Work escrow type used in Clippay */
export const ESCROW_TYPE = "single-release" as const;

/** Escrow role mappings for Clippay */
export const ESCROW_ROLES = {
  /** Brand = the party that funds the escrow (issuer / approver) */
  issuer: "issuer",
  /** Influencer = the service provider who receives funds */
  serviceProvider: "serviceProvider",
  /** Platform = receives the fee */
  platform: "platform",
} as const;

/** Routes */
export const ROUTES = {
  home: "/",
  brandDashboard: "/brand/dashboard",
  brandCreateCampaign: "/brand/create-campaign",
  influencerDashboard: "/influencer/dashboard",
} as const;
