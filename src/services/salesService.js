import api from './api';

// Sales Service for Crop Produce Revenue
export const salesService = {
  // Get all sales
  getAll: async () => {
    const response = await api.get('/sales');
    return response.data;
  },

  // Get single sale record
  getById: async (id) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  // Create new sale
  create: async (saleData) => {
    const qty = Number(saleData.quantitySold);
    const price = Number(saleData.unitPrice);
    const total = qty * price;
    
    const response = await api.post('/sales', {
      ...saleData,
      quantitySold: qty,
      unitPrice: price,
      totalAmount: total
    });
    return response.data;
  },

  // Update sale record
  update: async (id, saleData) => {
    const qty = Number(saleData.quantitySold);
    const price = Number(saleData.unitPrice);
    const total = qty * price;

    const response = await api.put(`/sales/${id}`, {
      ...saleData,
      quantitySold: qty,
      unitPrice: price,
      totalAmount: total
    });
    return response.data;
  },

  // Delete sale record
  delete: async (id) => {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  }
};
