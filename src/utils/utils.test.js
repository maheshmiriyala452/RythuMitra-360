import { describe, it, expect } from 'vitest';
import { formatCurrency, formatNumber } from './formatters';
import { validateRequired, validatePositiveNumber, validatePhone } from './validators';

describe('Formatters Utility Suite', () => {
  it('should format numbers into Indian Rupees currency string', () => {
    const formatted = formatCurrency(125000);
    expect(formatted).toContain('1,25,000');
  });

  it('should handle zero or invalid currency gracefully', () => {
    expect(formatCurrency(0)).toContain('0');
    expect(formatCurrency('invalid')).toBe('₹0');
  });

  it('should format numbers with Indian comma grouping', () => {
    expect(formatNumber(50000)).toBe('50,000');
  });
});

describe('Validators Utility Suite', () => {
  it('should validate required non-empty string', () => {
    expect(validateRequired('Paddy', 'Crop Name')).toBeNull();
    expect(validateRequired('', 'Crop Name')).toBe('Crop Name is required.');
    expect(validateRequired(null, 'Crop Name')).toBe('Crop Name is required.');
  });

  it('should validate positive numbers', () => {
    expect(validatePositiveNumber(1500, 'Amount')).toBeNull();
    expect(validatePositiveNumber(0, 'Amount')).toBe('Amount must be greater than zero.');
    expect(validatePositiveNumber(-50, 'Amount')).toBe('Amount must be greater than zero.');
    expect(validatePositiveNumber('abc', 'Amount')).toBe('Amount must be a valid number.');
  });

  it('should validate 10-digit Indian mobile numbers', () => {
    expect(validatePhone('9876543210')).toBeNull();
    expect(validatePhone('12345')).toBe('Enter a valid 10-digit mobile number.');
    expect(validatePhone('')).toBeNull(); // optional field if empty
  });
});
