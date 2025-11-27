/**
 * Shared validation utilities for form inputs
 * 
 * This module provides consistent validation logic across all forms,
 * eliminating code duplication and ensuring consistent UX.
 */

export type ValidationStatus = 'empty' | 'success' | 'error';

export interface ValidationResult {
  status: ValidationStatus;
  message: string;
  suggestion?: string;
}

/**
 * Common email domain typos that users might make
 */
const commonEmailTypos: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'yaoo.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'hotmai.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
};

/**
 * Validates an email address with typo detection
 * 
 * @param email - The email address to validate
 * @returns ValidationResult with status, message, and optional suggestion
 * 
 * @example
 * const result = validateEmail('user@gmial.com');
 * // Returns: { status: 'error', message: 'Did you mean user@gmail.com?', suggestion: 'user@gmail.com' }
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return {
      status: 'empty',
      message: '',
    };
  }

  // Basic format check
  if (!email.includes('@')) {
    return {
      status: 'error',
      message: 'Email is missing @ symbol',
    };
  }

  const parts = email.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return {
      status: 'error',
      message: 'Email format looks incorrect',
    };
  }

  const domain = parts[1].toLowerCase();

  // Check for common typos
  for (const [typo, correct] of Object.entries(commonEmailTypos)) {
    if (domain === typo) {
      return {
        status: 'error',
        message: `Did you mean ${parts[0]}@${correct}?`,
        suggestion: `${parts[0]}@${correct}`,
      };
    }
  }

  // Check for basic domain format
  if (!domain.includes('.')) {
    return {
      status: 'error',
      message: 'Domain needs a dot (like .com)',
    };
  }

  // Valid!
  return {
    status: 'success',
    message: 'Looks good!',
  };
}

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;
export type PasswordLevel = 'empty' | 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  level: PasswordLevel;
  message: string;
  hint: string;
}

/**
 * Checks password strength based on multiple criteria
 * 
 * Criteria:
 * - Length (8+ characters)
 * - Lowercase letters
 * - Uppercase letters
 * - Numbers
 * - Special characters
 * 
 * @param password - The password to check
 * @returns PasswordStrengthResult with strength level and feedback
 * 
 * @example
 * const result = checkPasswordStrength('Password123!');
 * // Returns: { strength: 4, level: 'strong', message: 'Strong password!', hint: 'Excellent choice' }
 */
export function checkPasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { strength: 0, level: 'empty', message: '', hint: '' };
  }

  let count = 0;
  const feedback: string[] = [];

  // Length (8+)
  if (password.length >= 8) count++;
  else feedback.push('Use 8+ characters');

  // Lowercase (required)
  if (/[a-z]/.test(password)) count++;
  else feedback.push('add lowercase letters');

  // Uppercase (required)
  if (/[A-Z]/.test(password)) count++;
  else feedback.push('add uppercase letters');

  // Number (required)
  if (/[0-9]/.test(password)) count++;
  else feedback.push('add numbers');

  // Special character (required)
  if (/[^A-Za-z0-9]/.test(password)) count++;
  else feedback.push('add symbols (!@#$)');

  // Map 5 criteria to 4 strength levels (0-4)
  // All 5 criteria = strong (4), 4 criteria = good (3), 3 criteria = fair (2), 2 criteria = weak (1), 0-1 = empty (0)
  let strength: PasswordStrength;
  if (count >= 5) {
    strength = 4; // Strong - all criteria met
  } else if (count === 4) {
    strength = 3; // Good - 4 criteria met
  } else if (count === 3) {
    strength = 2; // Fair - 3 criteria met
  } else if (count >= 1) {
    strength = 1; // Weak - 1-2 criteria met
  } else {
    strength = 0; // Empty
  }

  const levels: Record<PasswordStrength, { level: PasswordLevel; message: string; hint: string }> = {
    0: { level: 'empty', message: '', hint: '' },
    1: { level: 'weak', message: 'Weak password', hint: feedback.join(', ') },
    2: { level: 'fair', message: 'Fair password', hint: feedback.join(', ') },
    3: { level: 'good', message: 'Good password', hint: feedback.join(', ') },
    4: { level: 'strong', message: 'Strong password!', hint: 'Excellent choice' },
  };

  return { strength, ...levels[strength] };
}

/**
 * Validates a password and returns a ValidationResult
 * 
 * @param password - The password to validate
 * @returns ValidationResult with status and message
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {
      status: 'empty',
      message: '',
    };
  }

  const strengthResult = checkPasswordStrength(password);

  if (strengthResult.strength === 0) {
    return {
      status: 'empty',
      message: '',
    };
  }

  if (strengthResult.strength < 2) {
    return {
      status: 'error',
      message: strengthResult.hint || 'Password is too weak',
    };
  }

  return {
    status: 'success',
    message: strengthResult.message,
  };
}

/**
 * Validates a phone number (Thai format or international)
 * 
 * @param phone - The phone number to validate
 * @returns ValidationResult with status and message
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return {
      status: 'empty',
      message: '',
    };
  }

  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Thai phone number: starts with 0 followed by 8-9 digits, or starts with +66
  // International: starts with + followed by digits
  const thaiPattern = /^(0[689]\d{8}|0[2-5]\d{7})$/;
  const internationalPattern = /^\+\d{10,15}$/;

  if (thaiPattern.test(cleaned)) {
    return {
      status: 'success',
      message: 'Looks good!',
    };
  }

  if (internationalPattern.test(cleaned)) {
    return {
      status: 'success',
      message: 'Looks good!',
    };
  }

  return {
    status: 'error',
    message: 'Please enter a valid phone number',
  };
}

/**
 * Validates that two passwords match
 * 
 * @param password - The first password
 * @param confirmPassword - The confirmation password
 * @returns ValidationResult with status and message
 */
export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword) {
    return {
      status: 'empty',
      message: '',
    };
  }

  if (password !== confirmPassword) {
    return {
      status: 'error',
      message: 'Passwords do not match',
    };
  }

  return {
    status: 'success',
    message: 'Passwords match',
  };
}

