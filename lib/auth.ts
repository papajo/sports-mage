/**
 * Authentication utilities and helpers
 */

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  subscriptionTier?: 'free' | 'premium' | 'pro';
  subscriptionExpires?: Date;
}

export interface Session {
  user: User;
  expires: string;
}

/**
 * Simple password validation
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  return { valid: true };
}

/**
 * Email validation
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

