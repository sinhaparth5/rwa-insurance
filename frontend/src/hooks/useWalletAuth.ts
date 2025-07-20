import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';
import type { UserSession } from '../types/user.d.ts';

export function useWalletAuth() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchOrCreateUserProfile(address);
    } else {
      setUserSession(null);
    }
  }, [isConnected, address]);

  const fetchOrCreateUserProfile = async (walletAddress: string) => {
    setLoading(true);
    try {
      // @TODO Call backend API - DEMO API for wireframe
      const response = await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });

      const profileData = await response.json();
      
      setUserSession({
        address: walletAddress,
        isConnected: true,
        hasProfile: !!profileData.id,
        profileData,
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUserSession({
        address: walletAddress,
        isConnected: true,
        hasProfile: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    disconnect();
    setUserSession(null);
  };

  return {
    userSession,
    loading,
    logout,
    isAuthenticated: !!userSession?.isConnected,
  };
}
