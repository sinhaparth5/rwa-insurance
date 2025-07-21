const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export interface LoginRequest {
    wallet_address: string
    signature: string
    message: string
}

export interface LoginResponse {
    access_token: string
    token_type: string
    user: {
        id: number
        wallet_address: string
        email?: string
        created_at: string
        updated_at: string
    }
}

export const authApi = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'Login failed')
        }

        return response.json()
    },

    async verifyToken(token: string) {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error('Token verification failed')
        }
        return response.json()
    },

    async getProfile(token: string) {
        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) {
            throw new Error('Failed to fetch profile')
        }
        return response.json()
    }
}