// API Configuration
// CRITICAL FIX: Remove /api suffix if present in environment variable
let baseUrl = import.meta.env.VITE_API_URL || 'https://smart-lodge-ai-hotel-booking-backen-dusky.vercel.app';

if (baseUrl.endsWith('/api')) {
  baseUrl = baseUrl.slice(0, -4); // Remove last 4 characters (/api)
  console.error('🟡 REMOVED /api SUFFIX FROM BASE URL');
}

const API_CONFIG = {
  // Use corrected URL without /api suffix
  BASE_URL: baseUrl,
  
  // Admin endpoints (note: these are direct paths without /api/ prefix)
  ADMIN: {
    LOGIN: 'admin/login',
    DASHBOARD: 'admin/dashboard', 
    HOTELS: 'admin/hotels',
    ROOMS: 'admin/rooms',
    BOOKINGS: 'admin/bookings'
  }
};

// Debug logging to track what URL is being used (PRODUCTION DEBUG - CLEANED)
console.log('✅ API Config Ready:', {
  BASE_URL: API_CONFIG.BASE_URL,
  MODE: import.meta.env.MODE
});

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  const fullUrl = `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
  return fullUrl;
};

// Admin API helper functions
export const adminApi = {
  // Get full URL for admin endpoints
  login: () => getApiUrl(API_CONFIG.ADMIN.LOGIN),
  dashboard: () => getApiUrl(API_CONFIG.ADMIN.DASHBOARD),
  hotels: (id = '') => getApiUrl(`${API_CONFIG.ADMIN.HOTELS}${id ? `/${id}` : ''}`),
  rooms: (id = '') => getApiUrl(`${API_CONFIG.ADMIN.ROOMS}${id ? `/${id}` : ''}`),
  bookings: (id = '') => getApiUrl(`${API_CONFIG.ADMIN.BOOKINGS}${id ? `/${id}` : ''}`),
  
  // Helper for query parameters
  hotelsWithQuery: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return `${adminApi.hotels()}${queryString ? `?${queryString}` : ''}`;
  },
  
  roomsWithQuery: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return `${adminApi.rooms()}${queryString ? `?${queryString}` : ''}`;
  },
  
  bookingsWithQuery: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return `${adminApi.bookings()}${queryString ? `?${queryString}` : ''}`;
  }
};

export default API_CONFIG;