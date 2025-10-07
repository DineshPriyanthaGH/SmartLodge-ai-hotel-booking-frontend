import { useAuth, useUser } from '@clerk/clerk-react';

// Get the current session token for API calls
export const getAuthToken = async () => {
  try {
    // This should be called from within a React component that has Clerk context
    const { getToken } = useAuth();
    
    if (getToken) {
      // Get the session token from Clerk
      const token = await getToken();
      return token;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Auth service for managing authentication state
export class AuthService {
  static async getToken() {
    try {
      // Get token from Clerk
      if (window.Clerk && window.Clerk.session) {
        return await window.Clerk.session.getToken();
      }
      
      // Fallback: try to get from sessionStorage
      const token = sessionStorage.getItem('clerk-session-token');
      return token;
    } catch (error) {
      console.error('Error getting session token:', error);
      return null;
    }
  }

  static setToken(token) {
    if (token) {
      sessionStorage.setItem('clerk-session-token', token);
    } else {
      sessionStorage.removeItem('clerk-session-token');
    }
  }

  static removeToken() {
    sessionStorage.removeItem('clerk-session-token');
  }

  static async getUserInfo() {
    try {
      if (window.Clerk && window.Clerk.user) {
        return window.Clerk.user;
      }
      return null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }
}

// Custom hook for authentication
export const useAuthService = () => {
  const { isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();

  const getAuthToken = async () => {
    try {
      if (isSignedIn && getToken) {
        const token = await getToken();
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  return {
    isAuthenticated: isSignedIn,
    user,
    userId,
    getToken: getAuthToken,
    isLoading: !isSignedIn && !user
  };
};