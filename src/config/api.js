// API Configuration
const API_CONFIG = {
  // Use environment variable with fallback to the actual working backend URL
  BASE_URL: import.meta.env.VITE_API_URL || 'https://smart-lodge-ai-hotel-booking-backen-dusky.vercel.app',
  
  // Admin endpoints (note: these are direct paths without /api/ prefix)
  ADMIN: {
    LOGIN: 'admin/login',
    DASHBOARD: 'admin/dashboard', 
    HOTELS: 'admin/hotels',
    ROOMS: 'admin/rooms',
    BOOKINGS: 'admin/bookings'
  }
};

// Debug logging to track what URL is being used (PRODUCTION DEBUG)
console.log('🔧 API Config Debug:', {
  ENV_VITE_API_URL: import.meta.env.VITE_API_URL,
  ACTUAL_BASE_URL: API_CONFIG.BASE_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD
});

// Additional debug to verify endpoint generation
console.log('🔍 Admin Endpoints Debug:', {
  LOGIN: API_CONFIG.ADMIN.LOGIN,
  DASHBOARD: API_CONFIG.ADMIN.DASHBOARD,
  HOTELS: API_CONFIG.ADMIN.HOTELS,
  ROOMS: API_CONFIG.ADMIN.ROOMS,
  BOOKINGS: API_CONFIG.ADMIN.BOOKINGS
});

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  const fullUrl = `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
  console.log(`🌐 API URL Generated: ${endpoint} → ${fullUrl}`);
  console.log(`🔍 Full URL Breakdown:`, {
    baseUrl: API_CONFIG.BASE_URL,
    originalEndpoint: endpoint,
    cleanEndpoint: cleanEndpoint,
    finalUrl: fullUrl
  });
  return fullUrl;
};

// Admin API helper functions
export const adminApi = {
  // Get full URL for admin endpoints
  login: () => {
    const url = getApiUrl(API_CONFIG.ADMIN.LOGIN);
    console.error('🔴 LOGIN URL:', url);
    return url;
  },
  dashboard: () => {
    const url = getApiUrl(API_CONFIG.ADMIN.DASHBOARD);
    console.error('🔴 DASHBOARD URL:', url);
    return url;
  },
  hotels: (id = '') => {
    const url = getApiUrl(`${API_CONFIG.ADMIN.HOTELS}${id ? `/${id}` : ''}`);
    console.error('🔴 HOTELS URL:', url);
    return url;
  },
  rooms: (id = '') => {
    const url = getApiUrl(`${API_CONFIG.ADMIN.ROOMS}${id ? `/${id}` : ''}`);
    console.error('🔴 ROOMS URL:', url);
    return url;
  },
  bookings: (id = '') => {
    const url = getApiUrl(`${API_CONFIG.ADMIN.BOOKINGS}${id ? `/${id}` : ''}`);
    console.error('🔴 BOOKINGS URL:', url);
    return url;
  },
  
  // Helper for query parameters
  hotelsWithQuery: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${adminApi.hotels()}${queryString ? `?${queryString}` : ''}`;
    console.error('🔴 HOTELS WITH QUERY:', url);
    return url;
  },
  
  roomsWithQuery: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${adminApi.rooms()}${queryString ? `?${queryString}` : ''}`;
    console.error('🔴 ROOMS WITH QUERY:', url);
    return url;
  },
  
  bookingsWithQuery: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${adminApi.bookings()}${queryString ? `?${queryString}` : ''}`;
    console.error('🔴 BOOKINGS WITH QUERY:', url);
    return url;
  }
};

export default API_CONFIG;