import api from './api';

// Weather Service for Agro-Meteorological Data
export const weatherService = {
  // Get current weather & 7-day forecast
  getWeather: async () => {
    const response = await api.get('/weather');
    // Returns array or single weather object
    return Array.isArray(response.data) ? response.data[0] : response.data;
  }
};
