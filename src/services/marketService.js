import api from './api';

// Market Prices Service for Mandi Benchmarks
export const marketService = {
  // Get all market prices
  getAll: async () => {
    const response = await api.get('/marketPrices');
    return response.data;
  },

  // Search or filter market prices by query string
  search: async (query) => {
    const response = await api.get(`/marketPrices?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};
