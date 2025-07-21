"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { blockdagPrimordial } from "@/chains/blockdag";
import { useState, useCallback } from "react";

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCorrectNetwork = chainId === blockdagPrimordial.id;

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔌 Connecting wallet...');
      const injectedConnector = connectors.find(c => c.type === 'injected');
      if (injectedConnector) {
        await connect({ connector: injectedConnector });
        console.log('✅ Wallet connected successfully');
      } else {
        throw new Error('No wallet connector found');
      }
    } catch (error: any) {
      console.error("❌ Failed to connect wallet:", error);
      setError('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  }, [connect, connectors]);

  const disconnectWallet = useCallback(() => {
    console.log('🔌 Disconnecting wallet...');
    disconnect();
    setError(null);
  }, [disconnect]);

  const switchToBlockDAG = useCallback(async () => {
    try {
      console.log('🔄 Switching to BlockDAG network...');
      await switchChain({ chainId: blockdagPrimordial.id });
      console.log('✅ Network switched successfully');
    } catch (error) {
      console.error("❌ Failed to switch network:", error);
      setError('Failed to switch network');
    }
  }, [switchChain]);

  const clearError = () => {
    setError(null);
  };

  return {
    // Wallet states
    address,
    isConnected,
    isConnecting: isConnecting || isLoading,
    isCorrectNetwork,
    chainId,
    formattedAddress: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
    error,
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchToBlockDAG,
    clearError,
  };
}