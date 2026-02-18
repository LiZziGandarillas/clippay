// ============================================================
// Clippay MVP - useFundCampaign Hook
// Handles funding an existing escrow contract with USDC
// ============================================================

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useClippayWallet } from "@/hooks/use-clippay-wallet";
import { useEscrowsMutations } from "@/components/tw-blocks/tanstack/useEscrowsMutations";
import {
  handleError,
  type ErrorResponse,
} from "@/components/tw-blocks/handle-errors/handle";

export function useFundCampaign() {
  const [isFunding, setIsFunding] = useState(false);
  const [fundingContractId, setFundingContractId] = useState<string | null>(
    null
  );
  const { walletAddress } = useClippayWallet();
  const { fundEscrow } = useEscrowsMutations();

  const fund = async (contractId: string, amount: number) => {
    if (!walletAddress) {
      toast.error("Connect your wallet first");
      return false;
    }

    try {
      setIsFunding(true);
      setFundingContractId(contractId);

      await fundEscrow.mutateAsync({
        payload: {
          contractId,
          amount,
          signer: walletAddress,
        },
        type: "single-release",
        address: walletAddress,
      });

      toast.success("Escrow funded successfully!", {
        description: `${amount} USDC deposited into contract`,
      });

      return true;
    } catch (error) {
      toast.error(handleError(error as ErrorResponse).message);
      return false;
    } finally {
      setIsFunding(false);
      setFundingContractId(null);
    }
  };

  return {
    fund,
    isFunding,
    fundingContractId,
  };
}
