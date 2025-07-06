"use client";

import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useEffect, useState } from 'react';
import { RWAAsset, InsurancePolicy, Claim } from '@/types/insurance';

export function InsuranceDashboard() {
  const { userSession } = useWalletAuth();
  const [assets, setAssets] = useState<RWAAsset[]>([]);
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  
  // @TODO this useEffect is demo, need to update when the API is created
  useEffect(() => {
    if (userSession?.address) {
      fetchUserData();
    }
  }, [userSession]);

  const fetchUserData = async () => {
    try {
      const [assetsRes, policiesRes, claimsRes] = await Promise.all([
        fetch(`/api/assets?owner=${userSession!.address}`),
        fetch(`/api/policies?owner=${userSession!.address}`),
        fetch(`/api/claims?owner=${userSession!.address}`),
      ]);

      const [assetsData, policiesData, claimsData] = await Promise.all([
        assetsRes.json(),
        policiesRes.json(),
        claimsRes.json(),
      ]);

      setAssets(assetsData.assets || []);
      setPolicies(policiesData.policies || []);
      setClaims(claimsData.claims || []);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userSession?.isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">Connect your wallet to access your insurance dashboard</p>
        {/* ConnectButton component here */}
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading your insurance data...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Insurance Dashboard</h1>
        <p className="text-gray-600">Manage your tokenized asset insurance policies</p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Assets</h3>
          <p className="text-3xl font-bold text-blue-600">{assets.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Active Policies</h3>
          <p className="text-3xl font-bold text-green-600">
            {policies.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Coverage</h3>
          <p className="text-3xl font-bold text-purple-600">
            £{policies.reduce((sum, p) => sum + parseInt(p.coverageAmount), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending Claims</h3>
          <p className="text-3xl font-bold text-orange-600">
            {claims.filter(c => c.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Assets Section */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Your Tokenized Assets</h2>
        </div>
        <div className="p-6">
          {assets.length === 0 ? (
            <p className="text-gray-600">No assets found. Start by tokenizing your first asset!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => (
                <div key={asset.tokenId} className="border rounded-lg p-4">
                  <img src={asset.metadata.image} alt={asset.metadata.name} className="w-full h-32 object-cover rounded mb-4" />
                  <h3 className="font-semibold">{asset.metadata.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{asset.metadata.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      asset.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {asset.verified ? 'Verified' : 'Pending'}
                    </span>
                    <span className="text-sm font-medium">Score: {asset.ownershipScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Policies Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Insurance Policies</h2>
        </div>
        <div className="p-6">
          {policies.length === 0 ? (
            <p className="text-gray-600">No insurance policies yet. Create your first policy!</p>
          ) : (
            <div className="space-y-4">
              {policies.map((policy) => (
                <div key={policy.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Policy #{policy.id}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      policy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {policy.status}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Coverage:</span>
                      <span className="ml-2 font-medium">£{parseInt(policy.coverageAmount).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Premium:</span>
                      <span className="ml-2 font-medium">£{policy.premium}/month</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Expires:</span>
                      <span className="ml-2 font-medium">{new Date(policy.expiredAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
