import api from './api';

// Crop Service for CRUD operations
export const cropService = {
  // Get all crops
  getAll: async () => {
    const response = await api.get('/crops');
    return response.data;
  },

  // Get single crop by ID
  getById: async (id) => {
    const response = await api.get(`/crops/${id}`);
    return response.data;
  },

  // Add new crop
  create: async (cropData) => {
    const response = await api.post('/crops', {
      ...cropData,
      areaAcres: Number(cropData.areaAcres)
    });
    return response.data;
  },

  // Update existing crop
  update: async (id, cropData) => {
    const response = await api.put(`/crops/${id}`, {
      ...cropData,
      areaAcres: Number(cropData.areaAcres)
    });
    return response.data;
  },

  // Delete crop
  delete: async (id) => {
    const response = await api.delete(`/crops/${id}`);
    return response.data;
  }
};
