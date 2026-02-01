import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const portfolioAPI = {
    // Get portfolio for a wallet address
    getPortfolio: async (address) => {
        try {
            const response = await api.get(`/api/portfolio/${address}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch portfolio');
        }
    },

    // Get transaction history
    getTransactions: async (address, chain = 'all') => {
        try {
            const response = await api.get(`/api/transactions/${address}`, {
                params: { chain }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
        }
    },

    // Get token prices
    getTokenPrices: async (tokenIds) => {
        try {
            const response = await api.post('/api/prices', { tokenIds });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch prices');
        }
    },

    // Health check
    healthCheck: async () => {
        try {
            const response = await api.get('/health');
            return response.data;
        } catch (error) {
            throw new Error('Backend server is not responding');
        }
    }
};

export default api;
