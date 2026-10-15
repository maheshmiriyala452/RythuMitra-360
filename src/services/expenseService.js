import api from './api';

// Expense Service for Farm Expenditures
export const expenseService = {
  // Get all expenses
  getAll: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },

  // Get single expense
  getById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  // Create new expense
  create: async (expenseData) => {
    const response = await api.post('/expenses', {
      ...expenseData,
      amount: Number(expenseData.amount)
    });
    return response.data;
  },

  // Update expense
  update: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}`, {
      ...expenseData,
      amount: Number(expenseData.amount)
    });
    return response.data;
  },

  // Delete expense
  delete: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  }
};
