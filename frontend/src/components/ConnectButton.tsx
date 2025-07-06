"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { useState, useEffect } from "react";
import { blockdagPrimordial } from "@/chains/blockdag";
import { projectId } from "@/configs/wagmi";
import { ClientOnly } from "./ClientOnly";

function ConnectButtonInner() {
  const { open } = useWeb3Modal();
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCorrectNetwork = chainId === blockdagPrimordial.id;
  const hasValidProjectId = projectId && projectId.length === 32;

  const handleConnect = async () => {
    if (!hasValidProjectId) {
      setError("Invalid WalletConnect Project ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await open();
    } catch (error: any) {
      console.error("Failed to open Web3Modal:", error);
      setError("Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
      setError(null);
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const switchNetwork = async () => {
    try {
      await open({ view: 'Networks' });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Project ID validation error
  if (!hasValidProjectId) {
    return (
      <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold min-w-[160px] text-center cursor-not-allowed">
        Setup Required
      </div>
    );
  }

  // Connected state
  if (isConnected && address) {
    return (
      <div className="flex flex-col gap-3">
        {/* Wallet Info */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`px-4 py-2 rounded-lg border text-sm font-mono ${
            isCorrectNetwork 
              ? 'bg-green-900/20 text-green-400 border-green-800' 
              : 'bg-yellow-900/20 text-yellow-400 border-yellow-800'
          }`}>
            {formatAddress(address)}
          </div>
          <button
            onClick={handleDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Disconnect
          </button>
        </div>

        {/* Network Warning */}
        {!isCorrectNetwork && (
          <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-yellow-400 font-semibold">Wrong Network</span>
            </div>
            <p className="text-yellow-200 text-sm mb-3">
              Connected to chain {chainId}. Please switch to BlockDAG Primordial (Chain ID: 1043).
            </p>
            <button
              onClick={switchNetwork}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Switch Network
            </button>
          </div>
        )}

        {/* Success State */}
        {isCorrectNetwork && (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-400 font-semibold">Connected to BlockDAG</span>
            </div>
            <p className="text-green-200 text-sm mt-1">
              Ready to use RWA Insurance Protocol!
            </p>
          </div>
        )}
      </div>
    );
  }

  // Connect button
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleConnect}
        disabled={isConnecting || isLoading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 min-w-[160px] justify-center"
      >
        {isConnecting || isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

export default function ConnectButton() {
  return (
    <ClientOnly 
      fallback={
        <div className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold animate-pulse min-w-[160px] text-center">
          Loading...
        </div>
      }
    >
      <ConnectButtonInner />
    </ClientOnly>
  );
}