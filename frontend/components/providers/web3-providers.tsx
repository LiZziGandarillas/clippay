"use client";

import React from "react";
import { ReactQueryClientProvider } from "@/components/tw-blocks/providers/ReactQueryClientProvider";
import { TrustlessWorkProvider } from "@/components/tw-blocks/providers/TrustlessWork";
import { WalletProvider } from "@/components/tw-blocks/providers/WalletProvider";
import { EscrowProvider } from "@/components/tw-blocks/providers/EscrowProvider";
import { EscrowDialogsProvider } from "@/components/tw-blocks/providers/EscrowDialogsProvider";
import { EscrowAmountProvider } from "@/components/tw-blocks/providers/EscrowAmountProvider";
import { Toaster } from "sonner";

/**
 * Web3Providers wraps the app with all Trustless Work + wallet providers.
 * Order matters:
 *   ReactQueryClientProvider → TrustlessWorkProvider → WalletProvider
 *   → EscrowProvider → EscrowDialogsProvider → EscrowAmountProvider
 */
export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryClientProvider>
      <TrustlessWorkProvider>
        <WalletProvider>
          <EscrowProvider>
            <EscrowDialogsProvider>
              <EscrowAmountProvider>
                {children}
                <Toaster richColors position="top-right" />
              </EscrowAmountProvider>
            </EscrowDialogsProvider>
          </EscrowProvider>
        </WalletProvider>
      </TrustlessWorkProvider>
    </ReactQueryClientProvider>
  );
}
