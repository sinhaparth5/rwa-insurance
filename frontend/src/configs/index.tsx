"use client";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { morphHolesky } from "viem/chains";
import { CookieStorage } from "@wallectconnect/key"

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create WalletConnect storage
const walletConnectStorage = new CookieStorage({ prefix: "wc_" })

// Create wagmiConfig
const chains = [morphHolesky] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [
    walletConnect({
      projectId,
      storage: createStorage({ storage: cookieStorage }),
      metadata,
      showQrModal: false,
    })
  ]
});
