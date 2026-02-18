// ============================================================
// Clippay MVP - Custom Wallet Hook
// Bridges TW wallet state with Clippay domain logic
// ============================================================

"use client";

import { useMemo } from "react";
import { useWalletContext } from "@/components/tw-blocks/providers/WalletProvider";
import { useWallet } from "@/components/tw-blocks/wallet-kit/useWallet";
import {
  MOCK_BRANDS,
  MOCK_INFLUENCERS,
  MOCK_BRAND_ADDRESS,
  MOCK_INFLUENCER_ADDRESS,
} from "@/lib/mock-data";
import type { UserRole, Brand, Influencer } from "@/lib/types";

/**
 * Clippay-specific wallet hook.
 *
 * Wraps the low-level TW wallet context and adds:
 * - Role detection (brand vs influencer) based on the connected address
 * - Mock user profile lookup (Brand | Influencer entity)
 * - Short address helper
 * - Convenience booleans for guards / routing
 */
export function useClippayWallet() {
  const { walletAddress, walletName } = useWalletContext();
  const { handleConnect, handleDisconnect } = useWallet();

  const isConnected = Boolean(walletAddress);

  // Determine role from address (MVP: compare against mock addresses)
  const role: UserRole | null = useMemo(() => {
    if (!walletAddress) return null;
    if (walletAddress === MOCK_BRAND_ADDRESS) return "brand";
    if (walletAddress === MOCK_INFLUENCER_ADDRESS) return "influencer";
    // Default: any unknown address is treated as brand (can create campaigns)
    return "brand";
  }, [walletAddress]);

  // Look up the mock user profile for the connected address
  const brand: Brand | null = useMemo(() => {
    if (!walletAddress) return null;
    return (
      MOCK_BRANDS.find((b) => b.walletAddress === walletAddress) ?? null
    );
  }, [walletAddress]);

  const influencer: Influencer | null = useMemo(() => {
    if (!walletAddress) return null;
    return (
      MOCK_INFLUENCERS.find((i) => i.walletAddress === walletAddress) ?? null
    );
  }, [walletAddress]);

  // Short address for display (e.g. "GDXS…QZEL")
  const shortAddress = useMemo(() => {
    if (!walletAddress) return "";
    if (walletAddress.length <= 10) return walletAddress;
    return `${walletAddress.slice(0, 4)}…${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  return {
    // Connection state
    walletAddress,
    walletName,
    isConnected,
    shortAddress,

    // Role & profile
    role,
    isBrand: role === "brand",
    isInfluencer: role === "influencer",
    brand,
    influencer,

    // Actions
    connect: handleConnect,
    disconnect: handleDisconnect,
  } as const;
}
