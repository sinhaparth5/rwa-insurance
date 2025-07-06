"use client";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { blockdagPrimordial } from "@/chains/blockdag";

// Get projectId from WalletConnect Cloud (https://cloud.walletconnect.com)
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  console.warn("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined. Wallet connection will not work.");
}

// Metadata for your app
const metadata = {
  name: "RWA Insurance Protocol",
  description: "AI-Powered Insurance for Tokenized Real-World Assets",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://rwa-insurance.com",
  icons: ["/images/logo.png"],
};

// Configure chains - only BlockDAG for now
const chains = [blockdagPrimordial] as const;

// Create wagmi configuration
export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: projectId || "",
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
});
