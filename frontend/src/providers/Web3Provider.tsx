"use client";

import React, { ReactNode, useEffect, useState, useRef } from "react";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider } from "wagmi";
import { wagmiConfig, projectId } from "@/configs/wagmi";

// Create QueryClient instance outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

// Global flag to prevent multiple initializations
let modalInitialized = false;
let initializationPromise: Promise<void> | null = null;

// Safe modal creation with deduplication
async function createModalOnce() {
  // If already initialized or initializing, return
  if (modalInitialized || initializationPromise) {
    return initializationPromise;
  }

  // Check if we're in browser environment and have valid project ID
  if (typeof window === 'undefined' || !projectId) {
    return Promise.resolve();
  }

  // Create initialization promise
  initializationPromise = new Promise<void>((resolve, reject) => {
    try {
      // Check if Web3Modal already exists
      if ((window as any).__web3modal_initialized) {
        console.log("ℹ️ Web3Modal already exists, skipping initialization");
        modalInitialized = true;
        resolve();
        return;
      }

      // Wait for next tick to ensure DOM is ready
      setTimeout(() => {
        try {
          createWeb3Modal({
            wagmiConfig,
            projectId,
            enableAnalytics: false,
            enableOnramp: false,
            themeMode: 'dark',
            themeVariables: {
              '--w3m-color-mix': '#070E1B',
              '--w3m-color-mix-strength': 40,
              '--w3m-accent': '#1E40AF',
              '--w3m-border-radius-master': '8px',
            },
            // Removed featuredWalletIds to eliminate 403 API errors
            tokens: {
              1043: {
                address: '0x0000000000000000000000000000000000000000',
                image: '/images/bdag-token.png'
              },
            },
          });

          // Mark as initialized
          modalInitialized = true;
          (window as any).__web3modal_initialized = true;
          
          console.log("✅ Web3Modal initialized successfully");
          resolve();
        } catch (error) {
          console.error("❌ Failed to initialize Web3Modal:", error);
          reject(error);
        }
      }, 100);
    } catch (error) {
      reject(error);
    }
  });

  return initializationPromise;
}

export default function Web3Provider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    // Prevent multiple effect runs
    if (initRef.current) return;
    initRef.current = true;

    setMounted(true);

    // Initialize Web3Modal only once
    createModalOnce()
      .then(() => {
        setIsReady(true);
      })
      .catch((error) => {
        console.error("Web3Modal initialization failed:", error);
        setIsReady(true); // Still set ready to show the app
      });
  }, []);

  // Show loading until mounted and ready
  if (!mounted || !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing Web3...</p>
          <p className="text-blue-200 text-sm mt-2">Loading wallet providers...</p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}