// Small reusable validation helpers used by the checkout, contact and
// newsletter forms. Each returns an error message, or '' when valid.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateEmail = (value) => {
  if (!value.trim()) return 'Enter your email address.';
  if (!EMAIL_PATTERN.test(value.trim())) return 'Enter a valid email, like name@example.com.';
  return '';
};

export const validateRequired = (value, label, minLength = 1) => {
  const trimmed = value.trim();
  if (!trimmed) return `Enter your ${label}.`;
  if (trimmed.length < minLength) return `Your ${label} must be at least ${minLength} characters.`;
  return '';
};

export const validatePhone = (value) => {
  if (!value.trim()) return 'Enter your phone number.';
  const digits = value.replace(/[\s-]/g, '').replace(/^(\+91|91)/, '');
  if (!/^\d{10}$/.test(digits)) return 'Enter a 10-digit phone number.';
  return '';
};

export const validatePincode = (value) => {
  if (!value.trim()) return 'Enter your PIN code.';
  if (!/^\d{6}$/.test(value.trim())) return 'PIN code must be 6 digits.';
  return '';
};
