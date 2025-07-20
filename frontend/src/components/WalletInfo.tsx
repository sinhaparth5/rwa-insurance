"use client";

import { useAccount, useBalance, useEnsName } from "wagmi";
import { blockdagPrimordial } from "@/chains/blockdag";
import { useState, useEffect } from "react";

export function WalletInfo() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address,
    chainId: blockdagPrimordial.id,
  });
  const { data: ensName } = useEnsName({ address });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isConnected || !address) {
    return null;
  }

  const isCorrectChain = chain?.id === blockdagPrimordial.id;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mt-6">
      <h3 className="text-xl font-semibold text-white mb-4">Wallet Information</h3>
      
      <div className="space-y-4">
        {/* ENS Name or Address */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Address:</span>
          <div className="flex items-center gap-2">
            <code 
              className="text-blue-400 text-sm cursor-pointer hover:text-blue-300 transition-colors"
              onClick={() => copyToClipboard(address)}
              title="Click to copy"
            >
              {ensName || `${address.slice(0, 8)}...${address.slice(-6)}`}
            </code>
            <button
              onClick={() => copyToClipboard(address)}
              className="text-gray-400 hover:text-white transition-colors"
              title="Copy address"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Network Status */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Network:</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isCorrectChain ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className={isCorrectChain ? "text-green-400" : "text-red-400"}>
              {chain?.name || "Unknown"}
            </span>
          </div>
        </div>

        {/* Balance Display */}
        {isCorrectChain && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">BDAG Balance:</span>
            <span className="text-white font-semibold">
              {balanceLoading ? (
                <div className="w-16 h-4 bg-gray-600 animate-pulse rounded" />
              ) : (
                `${parseFloat(balance?.formatted || "0").toFixed(4)} BDAG`
              )}
            </span>
          </div>
        )}

        {/* Chain ID */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Chain ID:</span>
          <span className="text-white font-mono text-sm">{chain?.id}</span>
        </div>

        {/* Explorer Link */}
        {isCorrectChain && (
          <div className="pt-4 border-t border-gray-700">
            <a
              href={`${blockdagPrimordial.blockExplorers.default.url}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              <span>View on BDAGScan</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Network Switch Warning */}
      {!isCorrectChain && (
        <div className="mt-4 bg-red-900/20 border border-red-800 rounded-lg p-4">
          <p className="text-red-400 text-sm">
            ⚠️ You're connected to the wrong network. Please switch to BlockDAG Primordial (Chain ID: 1043) to use this application.
          </p>
        </div>
      )}
    </div>
  );
}