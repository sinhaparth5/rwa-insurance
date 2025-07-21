const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Base API utility
class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    console.log('📤 Request headers:', options.headers);
    console.log('📤 Request body:', options.body);
    
    const response = await fetch(url, options);
    
    console.log(`📡 Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status}`, errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      } catch (parseError) {
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    }

    const data = await response.json();
    console.log(`✅ API Success:`, data);
    return data;
  }

  async get(endpoint: string, token?: string) {
    const headers: Record<string, string> = {
      'accept': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async post(endpoint: string, data: any, token?: string) {
    const headers: Record<string, string> = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any, token?: string) {
    const headers: Record<string, string> = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string, token?: string) {
    const headers: Record<string, string> = {
      'accept': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

const api = new APIService();

// External Crypto API Service
const cryptoAPI = {
  async getCryptoPrices() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd&include_24hr_change=true');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
      // Return fallback data
      return {
        ethereum: { usd: 2400, usd_24h_change: 2.5 },
        bitcoin: { usd: 45000, usd_24h_change: -1.2 }
      };
    }
  },

  async getCryptoHistory(coinId: string, days: number = 30) {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
      const data = await response.json();
      
      // Format data for charts
      return data.prices.map((price: any, index: number) => ({
        date: new Date(price[0]).toLocaleDateString(),
        price: price[1],
        timestamp: price[0]
      }));
    } catch (error) {
      console.error(`Failed to fetch ${coinId} history:`, error);
      // Return fallback data
      const fallbackData = [];
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        fallbackData.push({
          date: date.toLocaleDateString(),
          price: coinId === 'ethereum' ? 2400 + Math.random() * 200 : 45000 + Math.random() * 5000,
          timestamp: date.getTime()
        });
      }
      return fallbackData;
    }
  }
};

// Dashboard API Service
export const dashboardAPI = {
  async getDashboardStats(token: string) {
    return api.get('/api/dashboard/stats', token);
  },

  async getPortfolioOverview(token: string) {
    return api.get('/api/dashboard/portfolio', token);
  },

  async getAnalytics(token: string) {
    return api.get('/api/dashboard/analytics', token);
  },

  async getCombinedDashboard(token: string) {
    try {
      const [stats, portfolio, analytics, cryptoPrices] = await Promise.all([
        this.getDashboardStats(token),
        this.getPortfolioOverview(token),
        this.getAnalytics(token),
        cryptoAPI.getCryptoPrices()
      ]);

      return {
        stats,
        portfolio,
        analytics,
        crypto: {
          prices: cryptoPrices,
          ethereum_history: await cryptoAPI.getCryptoHistory('ethereum', 30),
          bitcoin_history: await cryptoAPI.getCryptoHistory('bitcoin', 30)
        }
      };
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
      throw error;
    }
  }
};

// Chat API Service
export const chatAPI = {
  async sendMessage(message: string, sessionId: string, token: string) {
    console.log('💬 Sending chat message:', { message, sessionId });
    
    const payload = {
      message: message,
      session_id: sessionId
    };
    
    return api.post('/api/chat/message', payload, token);
  },

  async getChatHistory(sessionId: string, token: string) {
    return api.get(`/api/chat/history/${sessionId}`, token);
  },

  async getChatSessions(token: string) {
    return api.get('/api/chat/sessions', token);
  }
};

// Assets API Service
export const assetsAPI = {
  async getAssets(token: string) {
    return api.get('/api/assets/', token);
  },

  async getAsset(assetId: number, token: string) {
    return api.get(`/api/assets/${assetId}`, token);
  },

  async createAsset(assetData: {
    name: string;
    category: string;
    value: number;
    description?: string;
    token_id?: string;
    contract_address?: string;
    metadata?: any;
  }, token: string) {
    return api.post('/api/assets/', assetData, token);
  },

  async updateAsset(assetId: number, updateData: any, token: string) {
    return api.put(`/api/assets/${assetId}`, updateData, token);
  },

  async deleteAsset(assetId: number, token: string) {
    return api.delete(`/api/assets/${assetId}`, token);
  }
};

// Policies API Service
export const policiesAPI = {
  async getPolicies(token: string) {
    return api.get('/api/policies/', token);
  },

  async getPolicy(policyId: number, token: string) {
    return api.get(`/api/policies/${policyId}`, token);
  },

  async createPolicy(policyData: {
    asset_id: number;
    coverage_type: string;
    coverage_amount: number;
    premium_amount: number;
    deductible: number;
    start_date: string;
    end_date: string;
  }, token: string) {
    return api.post('/api/policies/', policyData, token);
  },

  async payPremium(policyId: number, token: string) {
    return api.put(`/api/policies/${policyId}/pay`, {}, token);
  }
};

// Claims API Service
export const claimsAPI = {
  async getClaims(token: string) {
    return api.get('/api/claims/', token);
  },

  async getClaim(claimId: number, token: string) {
    return api.get(`/api/claims/${claimId}`, token);
  },

  async submitClaim(claimData: {
    policy_id: number;
    claim_type: string;
    description: string;
    incident_date: string;
    claim_amount: number;
    supporting_documents?: any[];
  }, token: string) {
    return api.post('/api/claims/', claimData, token);
  },

  async updateClaimStatus(claimId: number, status: string, token: string) {
    return api.put(`/api/claims/${claimId}/status`, { status }, token);
  }
};

// Risk Assessment API Service
export const riskAPI = {
  async assessRisk(assetId: number, token: string) {
    return api.post('/api/risk/assess', { asset_id: assetId }, token);
  },

  async getRiskHistory(assetId: number, token: string) {
    return api.get(`/api/risk/history/${assetId}`, token);
  }
};

// Comprehensive service that combines all APIs
export class InsuranceAPIService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  // Dashboard methods
  dashboard = {
    getStats: () => dashboardAPI.getDashboardStats(this.token),
    getPortfolio: () => dashboardAPI.getPortfolioOverview(this.token),
    getAnalytics: () => dashboardAPI.getAnalytics(this.token),
    getCombined: () => dashboardAPI.getCombinedDashboard(this.token)
  };

  // Convenience methods that don't require passing token each time
  chat = {
    sendMessage: (message: string, sessionId: string) => 
      chatAPI.sendMessage(message, sessionId, this.token),
    getHistory: (sessionId: string) => 
      chatAPI.getChatHistory(sessionId, this.token),
    getSessions: () => 
      chatAPI.getChatSessions(this.token)
  };

  assets = {
    getAll: () => assetsAPI.getAssets(this.token),
    get: (id: number) => assetsAPI.getAsset(id, this.token),
    create: (data: any) => assetsAPI.createAsset(data, this.token),
    update: (id: number, data: any) => assetsAPI.updateAsset(id, data, this.token),
    delete: (id: number) => assetsAPI.deleteAsset(id, this.token)
  };

  policies = {
    getAll: () => policiesAPI.getPolicies(this.token),
    get: (id: number) => policiesAPI.getPolicy(id, this.token),
    create: (data: any) => policiesAPI.createPolicy(data, this.token),
    payPremium: (id: number) => policiesAPI.payPremium(id, this.token)
  };

  claims = {
    getAll: () => claimsAPI.getClaims(this.token),
    get: (id: number) => claimsAPI.getClaim(id, this.token),
    submit: (data: any) => claimsAPI.submitClaim(data, this.token),
    updateStatus: (id: number, status: string) => claimsAPI.updateClaimStatus(id, status, this.token)
  };

  risk = {
    assess: (assetId: number) => riskAPI.assessRisk(assetId, this.token),
    getHistory: (assetId: number) => riskAPI.getRiskHistory(assetId, this.token)
  };

  // Helper method to get comprehensive user data
  async getUserData() {
    try {
      const [assets, policies, claims] = await Promise.all([
        this.assets.getAll(),
        this.policies.getAll(),
        this.claims.getAll()
      ]);

      return {
        assets,
        policies,
        claims,
        summary: {
          totalAssets: assets.length,
          activePolicies: policies.filter((p: any) => p.status === 'active').length,
          pendingClaims: claims.filter((c: any) => c.status === 'pending').length,
          totalCoverage: policies.reduce((sum: number, p: any) => sum + p.coverage_amount, 0)
        }
      };
    } catch (error) {
      console.error('❌ Failed to load user data:', error);
      throw error;
    }
  }
}

// Hook to use the API service with authentication
export const useInsuranceAPI = (token: string | null) => {
  if (!token) {
    return null;
  }
  return new InsuranceAPIService(token);
};

// Export individual APIs for direct use
export { cryptoAPI };