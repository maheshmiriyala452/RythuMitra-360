import api from './api';

// Farmer Profile & System Notifications Service
export const farmerService = {
  // Get farmer profile details
  getProfile: async () => {
    const response = await api.get('/farmers');
    return Array.isArray(response.data) ? response.data[0] : response.data;
  },

  // Update farmer profile
  updateProfile: async (id, profileData) => {
    const response = await api.put(`/farmers/${id}`, {
      ...profileData,
      totalArea: Number(profileData.totalArea)
    });
    return response.data;
  },

  // Get notifications
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}`, { isRead: true });
    return response.data;
  }
};
