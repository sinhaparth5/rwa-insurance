"use client";

import { useEffect, useState } from 'react'
import { useWallet } from '@/hooks/useWallet' // Just for wallet connection
import { useAuth } from '@/contexts/AuthContext' // For authentication
import { ClientOnly } from './ClientOnly'

function ConnectButtonInner() {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    isCorrectNetwork, 
    chainId,
    connectWallet, 
    disconnectWallet, 
    switchToBlockDAG,
    formattedAddress 
  } = useWallet()
  
  const { 
    login, 
    logout, 
    isAuthenticated, 
    isAuthenticating, 
    error: authError, 
    user,
    clearError 
  } = useAuth()
  
  const [error, setError] = useState<string | null>(null)

  // Debug logging
  useEffect(() => {
    console.log('🔄 ConnectButton state:', {
      isConnected,
      address,
      isAuthenticated,
      isAuthenticating,
      authError,
      localError: error
    })
  }, [isConnected, address, isAuthenticated, isAuthenticating, authError, error])

  const handleConnect = async () => {
    console.log('🎯 Connect button clicked')
    setError(null)
    clearError()
    
    try {
      await connectWallet()
      console.log('✅ Wallet connected successfully')
    } catch (error: any) {
      console.error('❌ Failed to connect wallet:', error)
      setError('Failed to connect wallet')
    }
  }

  const handleDisconnect = () => {
    console.log('🔌 Disconnect button clicked')
    try {
      disconnectWallet()
      logout()
      setError(null)
      clearError()
    } catch (error) {
      console.error('❌ Failed to disconnect:', error)
    }
  }

  const handleRetryAuth = async () => {
    if (address) {
      console.log('🔄 Retry authentication clicked')
      clearError()
      setError(null)
      try {
        await login(address)
      } catch (err) {
        // Error handled by AuthContext
      }
    }
  }

  // Show current error (wallet or auth)
  const currentError = error || authError

  // Connected state
  if (isConnected && address) {
    return (
      <div className="flex flex-col gap-3">
        {/* Wallet Info Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`px-4 py-2 rounded-lg border text-sm font-mono ${
            isCorrectNetwork 
              ? 'bg-green-900/20 text-green-400 border-green-800' 
              : 'bg-yellow-900/20 text-yellow-400 border-yellow-800'
          }`}>
            {formattedAddress}
          </div>
          
          {/* Authentication Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isAuthenticated 
              ? 'bg-green-900/20 text-green-400 border border-green-800'
              : isAuthenticating
              ? 'bg-blue-900/20 text-blue-400 border border-blue-800'
              : 'bg-red-900/20 text-red-400 border border-red-800'
          }`}>
            {isAuthenticated ? '✓ Authenticated' : isAuthenticating ? 'Authenticating...' : '✗ Not Authenticated'}
          </div>

          <button
            onClick={handleDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Disconnect
          </button>
        </div>

        {/* Debug Info (remove in production) */}
        <div className="bg-gray-900/20 border border-gray-700 rounded-lg p-2 text-xs">
          <div className="text-gray-400">Debug Info:</div>
          <div className="text-gray-300">
            Connected: {isConnected.toString()} | 
            Auth: {isAuthenticated.toString()} | 
            Authenticating: {isAuthenticating.toString()}
          </div>
          {user && <div className="text-gray-300">User ID: {user.id}</div>}
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
              onClick={switchToBlockDAG}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Switch Network
            </button>
          </div>
        )}

        {/* Success State - Both Connected and Authenticated */}
        {isCorrectNetwork && isAuthenticated && (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-400 font-semibold">Connected & Authenticated</span>
            </div>
            <p className="text-green-200 text-sm mt-1">
              Welcome {user?.wallet_address ? formattedAddress : 'back'}! Ready to use RWA Insurance Protocol.
            </p>
            {user?.email && (
              <p className="text-green-300 text-xs mt-1">
                Email: {user.email}
              </p>
            )}
          </div>
        )}

        {/* Authentication Loading State */}
        {isCorrectNetwork && !isAuthenticated && isAuthenticating && (
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-blue-400 font-semibold">Authenticating with backend...</span>
            </div>
            <p className="text-blue-200 text-sm mt-1">
              Please sign the message in your wallet to complete authentication.
            </p>
          </div>
        )}

        {/* Authentication Error */}
        {currentError && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-400 font-semibold">Authentication Error</span>
            </div>
            <p className="text-red-300 text-sm mb-3">{currentError}</p>
            {!isAuthenticated && !isAuthenticating && (
              <button
                onClick={handleRetryAuth}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                Retry Authentication
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  // Disconnected state - Connect button
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 min-w-[160px] justify-center"
      >
        {isConnecting ? (
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
      {currentError && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
          <p className="text-red-400 text-sm">{currentError}</p>
        </div>
      )}
    </div>
  )
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
  )
}