"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { blockdagPrimordial } from "@/chains/blockdag";
import { useState, useCallback } from "react";

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isLoading, setIsLoading] = useState(false);

  const isCorrectNetwork = chainId === blockdagPrimordial.id;

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      await open();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsLoading(false);
    }
  }, [open]);

  const disconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const switchToBlockDAG = useCallback(async () => {
    try {
      await switchChain({ chainId: blockdagPrimordial.id });
    } catch (error) {
      console.error("Failed to switch network:", error);
      // Fallback: open network selection
      await open({ view: 'Networks' });
    }
  }, [switchChain, open]);

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isLoading,
    isCorrectNetwork,
    chainId,
    connectWallet,
    disconnectWallet,
    switchToBlockDAG,
    formattedAddress: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
  };
}