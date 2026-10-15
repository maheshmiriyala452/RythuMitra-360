// Formatting utilities for Indian Agriculture Domain

/**
 * Format numeric value to Indian Rupees (INR)
 * e.g., 125000 -> "₹1,25,000"
 */
export const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

/**
 * Format ISO or standard date string to friendly readable format
 * e.g., "2026-10-15" -> "15 Oct 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Format numbers with Indian numbering system commas
 * e.g., 25000 -> "25,000"
 */
export const formatNumber = (num) => {
  const n = Number(num);
  if (isNaN(n)) return '0';
  return new Intl.NumberFormat('en-IN').format(n);
};

/**
 * Calculate days remaining or days overdue
 */
export const getDaysRemaining = (targetDate) => {
  if (!targetDate) return null;
  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
