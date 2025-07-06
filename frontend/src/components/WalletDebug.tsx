"use client";

import { useAccount, useChainId } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { projectId } from "@/configs/wagmi";

export function WalletDebug() {
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  const { open } = useWeb3Modal();

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white text-sm space-y-2">
      <h3 className="font-bold">Wallet Debug Info:</h3>
      <p>Project ID: {projectId ? "✅ Set" : "❌ Missing"}</p>
      <p>Connected: {isConnected ? "✅ Yes" : "❌ No"}</p>
      <p>Connecting: {isConnecting ? "⏳ Yes" : "❌ No"}</p>
      <p>Address: {address || "None"}</p>
      <p>Chain ID: {chainId || "None"}</p>
      <p>Expected Chain: 1043 (BlockDAG)</p>
      <button 
        onClick={() => open()} 
        className="bg-blue-600 px-3 py-1 rounded mt-2"
      >
        Test Open Modal
      </button>
    </div>
  );
}