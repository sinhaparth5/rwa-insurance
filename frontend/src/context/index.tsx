'use client'

import { wagmiAdapter, projectId, networks } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
})

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'RWA Insurance Protocol',
  description: 'AI-Powered Insurance for Tokenized Assets',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  icons: ['/favicon.ico']
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: networks[0], // Use BlockDAG as default
  metadata: metadata,
  features: {
    analytics: false, // Disable analytics for privacy
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#070E1B',
    '--w3m-color-mix-strength': 40,
    '--w3m-accent': '#1E40AF',
    '--w3m-border-radius-master': '8px',
  },
})

function ContextProvider({ 
  children, 
  cookies 
}: { 
  children: ReactNode
  cookies: string | null 
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
