"use client";

import { useState } from 'react';
import { useWalletAuth } from '@/hooks/useWalletAuth';

interface PolicyFormData {
  assetTokenId: string;
  assetType: 'vehicle' | 'property' | 'art';
  coverageAmount: string;
  duration: number;
  assetDetails: {
    name: string;
    estimatedValue: string;
    location: string;
  };
}

export function PolicyCreationForm() {
  const { userSession } = useWalletAuth();
  const [formData, setFormData] = useState<PolicyFormData>({
    assetTokenId: '',
    assetType: 'vehicle',
    coverageAmount: '',
    duration: 12,
    assetDetails: {
      name: '',
      estimatedValue: '',
      location: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<any>(null);

  const getQuote = async () => {
    setLoading(true);
    try {
      // Simulate AI risk assessment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const riskScore = Math.floor(Math.random() * 40) + 60;
      const monthlyPremium = Math.floor(parseInt(formData.coverageAmount) * 0.003);
      
      setQuote({
        riskScore,
        monthlyPremium,
        annualPremium: monthlyPremium * 12,
        factors: [
          'Asset location: Low crime area (+10 points)',
          'Asset type: Classic vehicle (-5 points)',
          'Owner history: No previous claims (+15 points)'
        ]
      });
    } catch (error) {
      console.error('Failed to get quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPolicy = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          owner: userSession?.address,
          premium: quote.monthlyPremium.toString()
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Policy created successfully!');
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Failed to create policy:', error);
      alert('Failed to create policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Create Insurance Policy</h2>
      
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asset Type
          </label>
          <select
            value={formData.assetType}
            onChange={(e) => setFormData({...formData, assetType: e.target.value as any})}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="vehicle">Vehicle</option>
            <option value="property">Property</option>
            <option value="art">Art & Collectibles</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asset Token ID
          </label>
          <input
            type="text"
            value={formData.assetTokenId}
            onChange={(e) => setFormData({...formData, assetTokenId: e.target.value})}
            placeholder="e.g., 456 for CarNFT-AstonDB5-456"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asset Name
          </label>
          <input
            type="text"
            value={formData.assetDetails.name}
            onChange={(e) => setFormData({
              ...formData, 
              assetDetails: {...formData.assetDetails, name: e.target.value}
            })}
            placeholder="e.g., 1965 Aston Martin DB5"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coverage Amount (£)
            </label>
            <input
              type="number"
              value={formData.coverageAmount}
              onChange={(e) => setFormData({...formData, coverageAmount: e.target.value})}
              placeholder="50000"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (months)
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
              <option value={24}>24 months</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.assetDetails.location}
            onChange={(e) => setFormData({
              ...formData, 
              assetDetails: {...formData.assetDetails, location: e.target.value}
            })}
            placeholder="London, UK"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={getQuote}
            disabled={loading || !formData.coverageAmount}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Calculating...' : 'Get AI Quote'}
          </button>
        </div>
      </form>

      {quote && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">AI Risk Assessment</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-gray-600">Risk Score:</span>
              <span className="ml-2 font-bold text-lg">{quote.riskScore}/100</span>
            </div>
            <div>
              <span className="text-gray-600">Monthly Premium:</span>
              <span className="ml-2 font-bold text-lg text-green-600">£{quote.monthlyPremium}</span>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Risk Factors:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {quote.factors.map((factor: string, index: number) => (
                <li key={index}>• {factor}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={createPolicy}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating Policy...' : 'Create Policy'}
          </button>
        </div>
      )}
    </div>
  );
}