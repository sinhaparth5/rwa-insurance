"use client";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { blockdagPrimordial } from "@/chains/blockdag";

// Get projectId from environment variables
const envProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

// Validate Project ID format (should be exactly 32 characters)
const isValidProjectId = Boolean(envProjectId && typeof envProjectId === 'string' && envProjectId.length === 32);

// Use a valid project ID or provide a fallback for development
export const projectId = isValidProjectId ? envProjectId! : "00000000000000000000000000000000";

// Only show warnings in browser environment and development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (!envProjectId) {
    console.warn("⚠️ NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is missing");
    console.info("📝 Get your Project ID from: https://cloud.walletconnect.com/");
  } else if (!isValidProjectId) {
    console.warn("⚠️ Invalid Project ID format - should be 32 characters");
    console.info("📝 Current length:", envProjectId.length);
    console.info("📝 Get a valid Project ID from: https://cloud.walletconnect.com/");
  } else {
    console.log("✅ Valid WalletConnect Project ID loaded");
  }
}

// Metadata for your app
const metadata = {
  name: "RWA Insurance Protocol",
  description: "AI-Powered Insurance for Tokenized Assets",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  icons: ["/favicon.ico"],
};

// Configure only BlockDAG chain
const chains = [blockdagPrimordial] as const;

// Create storage with SSR safety
const createSafeStorage = () => {
  if (typeof window === 'undefined') {
    // Server-side: return a no-op storage
    return createStorage({
      storage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
    });
  }
  
  // Client-side: use cookie storage
  return createStorage({
    storage: cookieStorage,
  });
};

// Create wagmi configuration with SSR safety
export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createSafeStorage(),
  // Disable WalletConnect on SSR to prevent indexedDB errors
  enableWalletConnect: typeof window !== 'undefined' && isValidProjectId,
  enableInjected: typeof window !== 'undefined',
  enableEIP6963: typeof window !== 'undefined',
  enableCoinbase: typeof window !== 'undefined',
});