import api from './api';

// Inventory Service for Farm Supplies & Stock Management
export const inventoryService = {
  // Get all inventory items
  getAll: async () => {
    const response = await api.get('/inventory');
    return response.data;
  },

  // Get item by ID
  getById: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  // Add new inventory item
  create: async (itemData) => {
    const response = await api.post('/inventory', {
      ...itemData,
      quantity: Number(itemData.quantity),
      reorderLevel: Number(itemData.reorderLevel),
      unitCost: Number(itemData.unitCost)
    });
    return response.data;
  },

  // Update inventory item
  update: async (id, itemData) => {
    const response = await api.put(`/inventory/${id}`, {
      ...itemData,
      quantity: Number(itemData.quantity),
      reorderLevel: Number(itemData.reorderLevel),
      unitCost: Number(itemData.unitCost)
    });
    return response.data;
  },

  // Delete inventory item
  delete: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  }
};
