"use client";

import { useAccount, useChainId } from "wagmi";
import { projectId } from "@/configs/wagmi";
import { blockdagPrimordial } from "@/chains/blockdag";
import { useState, useEffect } from "react";

export function WalletStatus() {
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="text-gray-500">Loading wallet status...</div>;
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-white text-sm space-y-2 max-w-md">
      <h3 className="font-bold text-lg mb-3">🔧 Wallet Status</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Project ID:</span>
          <span className={projectId ? "text-green-400" : "text-red-400"}>
            {projectId ? "✅ Valid" : "❌ Missing"}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Wallet Connected:</span>
          <span className={isConnected ? "text-green-400" : "text-gray-400"}>
            {isConnected ? "✅ Yes" : "❌ No"}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Connecting:</span>
          <span className={isConnecting ? "text-yellow-400" : "text-gray-400"}>
            {isConnecting ? "⏳ Yes" : "❌ No"}
          </span>
        </div>
        
        {address && (
          <div className="flex justify-between">
            <span>Address:</span>
            <span className="text-blue-400 font-mono text-xs">
              {address.slice(0, 8)}...{address.slice(-6)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Chain ID:</span>
          <span className={chainId === blockdagPrimordial.id ? "text-green-400" : "text-yellow-400"}>
            {chainId || "None"}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Expected Chain:</span>
          <span className="text-blue-400">{blockdagPrimordial.id} (BlockDAG)</span>
        </div>
      </div>

      {!projectId && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded">
          <p className="text-red-400 text-xs">
            ⚠️ Missing WalletConnect Project ID
          </p>
          <p className="text-red-300 text-xs mt-1">
            Get one at cloud.walletconnect.com
          </p>
        </div>
      )}
    </div>
  );
}