/**
 * Authentication helper functions for client-side
 */

export interface User {
  id: string;
  email: string;
  username: string;
  subscriptionTier?: 'free' | 'premium' | 'pro';
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export function requireAuth(): User {
  const user = getCurrentUser();
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
    }
    throw new Error('User not authenticated');
  }
  return user;
}

