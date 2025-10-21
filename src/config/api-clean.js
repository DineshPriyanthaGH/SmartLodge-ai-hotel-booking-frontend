// CLEAN API Configuration - No legacy code
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://smart-lodge-ai-hotel-booking-backen-dusky.vercel.app';

console.error('🟢 CLEAN API CONFIG LOADED');
console.error('🟢 BACKEND_URL:', BACKEND_URL);
console.error('🟢 Environment variables:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD
});

// Clean admin API functions
export const cleanAdminApi = {
  login: () => `${BACKEND_URL}/admin/login`,
  dashboard: () => `${BACKEND_URL}/admin/dashboard`,
  hotels: (id = '') => `${BACKEND_URL}/admin/hotels${id ? `/${id}` : ''}`,
  rooms: (id = '') => `${BACKEND_URL}/admin/rooms${id ? `/${id}` : ''}`,
  bookings: (id = '') => `${BACKEND_URL}/admin/bookings${id ? `/${id}` : ''}`,
  
  hotelsWithQuery: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${BACKEND_URL}/admin/hotels${queryString ? `?${queryString}` : ''}`;
    console.error('🟢 CLEAN HOTELS WITH QUERY:', url);
    return url;
  },
  
  roomsWithQuery: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return `${BACKEND_URL}/admin/rooms${queryString ? `?${queryString}` : ''}`;
  },
  
  bookingsWithQuery: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return `${BACKEND_URL}/admin/bookings${queryString ? `?${queryString}` : ''}`;
  }
};

// Log all functions to verify
console.error('🟢 CLEAN API FUNCTIONS:');
console.error('LOGIN:', cleanAdminApi.login());
console.error('DASHBOARD:', cleanAdminApi.dashboard());
console.error('HOTELS:', cleanAdminApi.hotels());
console.error('HOTELS WITH QUERY:', cleanAdminApi.hotelsWithQuery({ page: 1, limit: 10, search: '' }));