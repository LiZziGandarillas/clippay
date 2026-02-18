// @ts-nocheck
// ============================================================
// Clippay MVP - useCreateCampaign Hook
// Handles campaign creation + escrow deployment on Stellar
// ============================================================

"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useClippayWallet } from "@/hooks/use-clippay-wallet";
import { useEscrowsMutations } from "@/components/tw-blocks/tanstack/useEscrowsMutations";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { trustlineOptions } from "@/components/tw-blocks/wallet-kit/trustlines";
import {
  handleError,
  type ErrorResponse,
} from "@/components/tw-blocks/handle-errors/handle";
import { PLATFORM_ADDRESS, PLATFORM_FEE } from "@/lib/constants";
import type { InitializeSingleReleaseEscrowPayload } from "@trustless-work/escrow/types";

// ---------- Schema ----------

export const createCampaignSchema = z.object({
  title: z.string().min(3, "Campaign title must be at least 3 characters"),
  description: z.string().min(10, "Provide a meaningful description"),
  cpaAmount: z.coerce
    .number()
    .positive("CPA must be greater than 0")
    .max(10000, "CPA cannot exceed 10,000 USDC"),
  totalBudget: z.coerce
    .number()
    .positive("Budget must be greater than 0")
    .max(1000000, "Budget cannot exceed 1,000,000 USDC"),
  serviceProviderAddress: z
    .string()
    .min(56, "Enter a valid Stellar address")
    .max(56, "Enter a valid Stellar address"),
});

export type CreateCampaignValues = z.infer<typeof createCampaignSchema>;

// ---------- Hook ----------

export function useCreateCampaign() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { walletAddress } = useClippayWallet();
  const { deployEscrow } = useEscrowsMutations();
  const { setSelectedEscrow } = useEscrowContext();

  const form = useForm<CreateCampaignValues>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      title: "",
      description: "",
      cpaAmount: undefined,
      totalBudget: undefined,
      serviceProviderAddress: "",
    },
    mode: "onChange",
  });

  const { watch } = form;
  const cpaAmount = watch("cpaAmount");
  const totalBudget = watch("totalBudget");

  const estimatedConversions =
    cpaAmount && totalBudget && cpaAmount > 0
      ? Math.floor(totalBudget / cpaAmount)
      : 0;

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!walletAddress) {
      toast.error("Connect your wallet first");
      return;
    }

    try {
      setIsSubmitting(true);

      const usdc = trustlineOptions.find((t) => t.label === "USDC");
      if (!usdc) {
        toast.error("USDC trustline not found");
        return;
      }

      // Map Clippay form → Trustless Work single-release escrow payload
      const payload: InitializeSingleReleaseEscrowPayload = {
        title: values.title,
        description: values.description,
        amount: values.totalBudget,
        platformFee: Number(PLATFORM_FEE),
        signer: walletAddress,
        engagementId: `clippay-${Date.now()}`,
        trustline: {
          address: usdc.value,
          symbol: usdc.label,
        },
        roles: {
          approver: walletAddress, // brand approves milestones
          serviceProvider: values.serviceProviderAddress, // influencer
          platformAddress: PLATFORM_ADDRESS, // clippay treasury
          receiver: values.serviceProviderAddress, // influencer receives funds
          releaseSigner: walletAddress, // brand signs the release
          disputeResolver: PLATFORM_ADDRESS, // platform resolves disputes
        },
        milestones: [
          {
            description: `CPA Campaign: ${values.title} — $${values.cpaAmount} per conversion`,
          },
        ],
      };

      const response = await deployEscrow.mutateAsync({
        payload,
        type: "single-release",
        address: walletAddress,
      });

      toast.success("Escrow deployed on Stellar!", {
        description: `Contract ID: ${(response as { contractId?: string }).contractId?.slice(0, 12)}…`,
      });

      // Store the escrow in context
      setSelectedEscrow({
        ...payload,
        contractId: (response as { contractId?: string }).contractId ?? "",
      });

      // Navigate back to dashboard
      setTimeout(() => router.push("/brand/dashboard"), 1500);
    } catch (error) {
      toast.error(handleError(error as ErrorResponse).message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    isSubmitting,
    estimatedConversions,
    handleSubmit,
  };
}
