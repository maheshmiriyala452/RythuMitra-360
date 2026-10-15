import api from './api';

// Activity Service for Farm Task Management
export const activityService = {
  // Get all tasks/activities
  getAll: async () => {
    const response = await api.get('/activities');
    return response.data;
  },

  // Get single activity
  getById: async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  // Create new activity
  create: async (activityData) => {
    const response = await api.post('/activities', activityData);
    return response.data;
  },

  // Update activity
  update: async (id, activityData) => {
    const response = await api.put(`/activities/${id}`, activityData);
    return response.data;
  },

  // Partial update (e.g. toggle status)
  patchStatus: async (id, status) => {
    const response = await api.patch(`/activities/${id}`, { status });
    return response.data;
  },

  // Delete activity
  delete: async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  }
};
