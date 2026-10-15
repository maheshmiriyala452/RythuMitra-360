// Client-side Validation Helper Functions

export const validateRequired = (value, fieldName = 'Field') => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${fieldName} is required.`;
  }
  return null;
};

export const validatePositiveNumber = (value, fieldName = 'Amount') => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${fieldName} is required.`;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number.`;
  }
  if (num <= 0) {
    return `${fieldName} must be greater than zero.`;
  }
  return null;
};

export const validateNonNegativeNumber = (value, fieldName = 'Quantity') => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${fieldName} is required.`;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number.`;
  }
  if (num < 0) {
    return `${fieldName} cannot be negative.`;
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null; // optional if not provided
  const cleanPhone = String(phone).replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    return 'Enter a valid 10-digit mobile number.';
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return null; // optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Enter a valid email address.';
  }
  return null;
};
