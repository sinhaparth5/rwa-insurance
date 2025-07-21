
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { authApi, LoginResponse } from '@/lib/api/auth'
import { generateAuthMessage, signAuthMessage } from '@/lib/utils/auth'

interface User {
  id: number
  wallet_address: string
  email?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAuthenticating: boolean
  login: (walletAddress: string) => Promise<void>
  logout: () => void
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useAccount()

  console.log('🔄 AuthProvider render:', { 
    address, 
    isConnected, 
    isAuthenticated: !!user && !!token,
    isAuthenticating,
    hasError: !!error 
  })

  // Load token from localStorage on mount - ONLY ONCE
  useEffect(() => {
    const loadSavedAuth = async () => {
      console.log('📂 Loading saved authentication...')
      
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('user_data')
      
      if (savedToken && savedUser) {
        console.log('💾 Found saved auth data, verifying...')
        try {
          await authApi.verifyToken(savedToken)
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
          console.log('✅ Saved auth data is valid')
        } catch (error) {
          console.warn('⚠️ Saved auth data is invalid, clearing...')
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_data')
        }
      } else {
        console.log('📭 No saved auth data found')
      }
    }

    loadSavedAuth()
  }, []) // FIXED: Empty dependency array - only run once

  // Auto-authenticate when wallet connects (FIXED - no more loops)
  useEffect(() => {
    const authenticateWallet = async () => {
      // Only authenticate if:
      // 1. Wallet is connected
      // 2. We have an address
      // 3. We're not already authenticated
      // 4. We're not currently authenticating
      // 5. We don't have a token for this address
      if (isConnected && address && !isAuthenticating && !token) {
        console.log('🎯 Auto-authenticating wallet:', address)
        try {
          await login(address)
        } catch (err) {
          console.error('❌ Auto-authentication failed:', err)
          // Error is already handled by login function
        }
      }
    }

    authenticateWallet()
  }, [isConnected, address, token, isAuthenticating]) // FIXED: Proper dependencies

  // Clear auth when wallet disconnects
  useEffect(() => {
    if (!isConnected && (user || token)) {
      console.log('🔌 Wallet disconnected, clearing auth...')
      logout()
    }
  }, [isConnected, user, token])

  const login = async (walletAddress: string) => {
    console.log('🚀 Starting authentication for:', walletAddress)
    setIsAuthenticating(true)
    setError(null)

    try {
      // Generate message
      const message = generateAuthMessage(walletAddress)
      console.log('📝 Generated message:', message)

      // Sign message
      console.log('✍️ Requesting signature...')
      const signature = await signAuthMessage(message)

      // Call backend API
      console.log('📡 Calling backend login API...')
      console.log('🌐 API URL:', `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/auth/login`)
      
      const response: LoginResponse = await authApi.login({
        wallet_address: walletAddress,
        signature,
        message
      })

      console.log('✅ Backend authentication successful!')
      console.log('👤 User ID:', response.user.id)

      // Store auth data
      setToken(response.access_token)
      setUser(response.user)
      localStorage.setItem('auth_token', response.access_token)
      localStorage.setItem('user_data', JSON.stringify(response.user))

    } catch (err: any) {
      console.error('❌ Authentication failed:', err)
      setError(err.message || 'Authentication failed')
      throw err
    } finally {
      setIsAuthenticating(false)
    }
  }

  const logout = () => {
    console.log('🔓 Logging out...')
    setUser(null)
    setToken(null)
    setError(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  const clearError = () => {
    setError(null)
  }

  const isAuthenticated = !!user && !!token

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isAuthenticating,
      login,
      logout,
      error,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}