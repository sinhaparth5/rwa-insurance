"use client";

import React, { ReactNode } from "react";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider } from "wagmi";
import { wagmiConfig, projectId } from "@/configs/wagmi";

// Setup QueryClient with better configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Create Web3Modal only if projectId exists
if (projectId) {
  createWeb3Modal({
    wagmiConfig,
    projectId,
    enableAnalytics: true,
    enableOnramp: false, // Disable fiat on-ramp for now
    themeMode: 'dark',
    themeVariables: {
      '--w3m-color-mix': '#070E1B',
      '--w3m-color-mix-strength': 40,
      '--w3m-accent': '#1E40AF',
      '--w3m-border-radius-master': '8px',
    },
    featuredWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
      '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927', // Ledger Live
    ],
    tokens: {
      1043: {
        address: '0x0000000000000000000000000000000000000000', // Native BDAG token
        image: '/images/bdag-token.png' // Optional: Add token image
      },
    },
    // Remove the chains property - it's already defined in wagmiConfig
  });
} else {
  console.error("WalletConnect Project ID is required. Get one at https://cloud.walletconnect.com");
}

export default function Web3Provider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}