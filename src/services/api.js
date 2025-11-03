import axios from 'axios';

// API configuration
// Ensure the base URL always points to the backend root and includes the '/api' prefix
// Frontend endpoints call paths like '/hotels', so the server must be reached at '<BASE>/api'
const RAW_API_BASE = import.meta.env.VITE_API_URL || 'https://smart-lodge-ai-hotel-booking-backen-dusky.vercel.app';
// Normalize: remove trailing slash, then append '/api' unless it's already present
const API_BASE_URL = (() => {
  try {
    const cleaned = RAW_API_BASE.replace(/\/+$/, '');
    if (cleaned.endsWith('/api')) return cleaned;
    return `${cleaned}/api`;
  } catch (e) {
    return RAW_API_BASE;
  }
})();

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

console.log('API base URL set to:', API_BASE_URL);

// Get Clerk session token
async function getClerkToken() {
  try {
    // Method 1: Get token from Clerk session
    if (window.Clerk && window.Clerk.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        return token;
      }
    }
    
    // Method 2: Fallback to sessionStorage
    const storedToken = sessionStorage.getItem('clerk-session-token');
    if (storedToken) {
      return storedToken;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting Clerk token:', error);
    return null;
  }
}

// Add request interceptor to automatically include auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getClerkToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Only log detailed errors for unexpected issues
    const isExpectedChatError = error.response?.status === 500 && 
                               error.config?.url?.includes('/chat/ask') &&
                               error.response?.data?.code === 'MISSING_API_KEY';
    
    const is404Error = error.response?.status === 404;
    
    if (!isExpectedChatError && !is404Error) {
      console.error('API Request Error:', error.response || error);
    } else if (isExpectedChatError) {
      console.info('🤖 Chat service temporarily unavailable (API key configuration needed)');
    } else if (is404Error) {
      console.info(`🔍 API endpoint not found: ${error.config?.url}`);
    }
    
    if (error.response?.status === 401) {
      console.error('Authentication failed - redirecting to login');
      // Clear any stored tokens
      sessionStorage.removeItem('clerk-session-token');
      // Optionally redirect to login
      window.location.href = '/sign-in';
    }
    
    throw error;
  }
);

// Generic API request function with Clerk authentication
async function apiRequest(endpoint, options = {}) {
  try {
    const { method = 'GET', data, params, headers = {}, ...axiosOptions } = options;
    
    const config = {
      method,
      url: endpoint,
      data,
      params,
      headers,
      ...axiosOptions,
    };

    return await axiosInstance(config);
  } catch (error) {
    // Only log detailed errors for unexpected issues
    const isExpectedChatError = endpoint.includes('/chat/ask') && 
                               error.response?.status === 500 &&
                               error.response?.data?.code === 'MISSING_API_KEY';
    
    const is404Error = error.response?.status === 404;
    
    if (!isExpectedChatError && !is404Error) {
      console.error(`API Request Error (${endpoint}):`, error);
    }
    throw error;
  }
}

// Hotel API functions
export const hotelAPI = {
  // Get all hotels
  getAllHotels: async (queryParams = {}) => {
    return apiRequest('/hotels', {
      params: queryParams,
    });
  },

  // Get hotel by ID
  getHotelById: async (id) => {
    return apiRequest(`/hotels/${id}`);
  },

  // Search hotels
  searchHotels: async (searchParams) => {
    return apiRequest('/hotels/search', {
      params: searchParams,
    });
  },

  // Get featured hotels
  getFeaturedHotels: async (limit = 10) => {
    return apiRequest('/hotels/featured', {
      params: { limit },
    });
  },

  // Check hotel availability
  checkAvailability: async (hotelId, checkIn, checkOut, guests) => {
    return apiRequest(`/hotels/${hotelId}/availability`, {
      method: 'POST',
      data: { checkIn, checkOut, guests },
    });
  }
};

// Booking API functions
export const bookingAPI = {
  // Create a new booking
  createBooking: async (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      data: bookingData,
    });
  },

  // Get user's bookings
  getUserBookings: async () => {
    return apiRequest('/bookings/my-bookings');
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}`);
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
  }
};

// User API functions
export const userAPI = {
  // Sync user with Clerk
  syncClerkUser: async (userData) => {
    return apiRequest('/auth/sync-clerk-user', {
      method: 'POST',
      data: userData,
    });
  },

  // Get user profile
  getUserProfile: async () => {
    return apiRequest('/users/profile');
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      data: profileData,
    });
  },

  // Get user statistics
  getUserStats: async () => {
    return apiRequest('/users/stats');
  }
};

// Payment API functions
export const paymentAPI = {
  // Create payment intent
  createPaymentIntent: async (amount, currency = 'usd') => {
    return apiRequest('/payments/create-intent', {
      method: 'POST',
      data: { amount, currency },
    });
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId) => {
    return apiRequest('/payments/confirm', {
      method: 'POST',
      data: { paymentIntentId },
    });
  }
};

// Review API functions
export const reviewAPI = {
  // Create a new review
  createReview: async (reviewData) => {
    return apiRequest('/reviews', {
      method: 'POST',
      data: reviewData,
    });
  },

  // Get reviews for a hotel
  getHotelReviews: async (hotelId, queryParams = {}) => {
    return apiRequest(`/reviews/hotel/${hotelId}`, {
      params: queryParams,
    });
  },

  // Get review statistics for a hotel
  getReviewStats: async (hotelId) => {
    return apiRequest(`/reviews/hotel/${hotelId}/stats`);
  },

  // Get user's reviews
  getUserReviews: async (queryParams = {}) => {
    return apiRequest('/reviews/my-reviews', {
      params: queryParams,
    });
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    return apiRequest(`/reviews/${reviewId}`, {
      method: 'PUT',
      data: reviewData,
    });
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    return apiRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },

  // Mark review as helpful
  markHelpful: async (reviewId) => {
    return apiRequest(`/reviews/${reviewId}/helpful`, {
      method: 'POST',
    });
  },

  // Get eligible bookings for review
  getEligibleBookings: async () => {
    return apiRequest('/reviews/eligible-bookings');
  }
};

// Utility functions
export const apiUtils = {
  // Format hotel data for frontend
  formatHotelData: (hotel) => {
    return {
      id: hotel._id,
      name: hotel.name,
      location: `${hotel.location.city}, ${hotel.location.state}`,
      fullLocation: hotel.location,
      rating: hotel.rating.overall,
      price: hotel.pricing.basePrice,
      image: hotel.primaryImage || hotel.images[0]?.url,
      images: hotel.images,
      amenities: hotel.amenities.map(a => a.name),
      description: hotel.shortDescription || hotel.description,
      fullDescription: hotel.description,
      roomTypes: hotel.roomTypes,
      policies: hotel.policies,
      contact: hotel.contact,
      featured: hotel.featured,
      reviewCount: hotel.rating.reviewCount
    };
  },

  // Format booking data for frontend
  formatBookingData: (booking) => {
    // Handle null/undefined booking
    if (!booking) {
      console.warn('formatBookingData: Received null/undefined booking');
      return null;
    }

    // Handle different booking data structures
    try {
      return {
        id: booking._id || booking.id,
        reference: booking.bookingReference || booking.reference || booking.id,
        hotel: booking.hotelName || booking.hotel?.name || booking.hotel || 'Unknown Hotel',
        // Handle backend date formats: checkInDate, checkIn, or dates.checkIn
        checkIn: booking.checkInDate ? new Date(booking.checkInDate) : 
                 booking.dates?.checkIn ? new Date(booking.dates.checkIn) : 
                 booking.checkIn ? new Date(booking.checkIn) : null,
        checkOut: booking.checkOutDate ? new Date(booking.checkOutDate) : 
                  booking.dates?.checkOut ? new Date(booking.dates.checkOut) : 
                  booking.checkOut ? new Date(booking.checkOut) : null,
        nights: booking.dates?.nights || booking.nights || 1,
        guests: booking.guests || booking.numberOfGuests || 1,
        status: booking.status || 'pending',
        total: booking.totalPrice || booking.pricing?.total || booking.total || 0,
        currency: booking.pricing?.currency || booking.currency || 'USD',
        guestDetails: booking.guestDetails || {
          name: booking.guestName,
          email: booking.guestEmail
        },
        roomType: booking.roomType,
        bookingDate: booking.bookingDate,
        createdAt: booking.createdAt ? new Date(booking.createdAt) : 
                   booking.bookingDate ? new Date(booking.bookingDate) : new Date()
      };
    } catch (error) {
      console.error('Error formatting booking data:', error, booking);
      return {
        id: booking._id || booking.id || 'unknown',
        reference: 'ERROR',
        hotel: 'Error Loading Hotel',
        checkIn: null,
        checkOut: null,
        nights: 0,
        guests: 0,
        status: 'error',
        total: 0,
        currency: 'USD',
        guestDetails: {},
        createdAt: new Date()
      };
    }
  }
};

// Chatbot API functions
export const chatAPI = {
  // Send message to AI chatbot
  sendMessage: async (message, history = []) => {
    return apiRequest('/chat/ask', {
      method: 'POST',
      data: { message, history },
    });
  }
};

export default {
  hotelAPI,
  bookingAPI,
  userAPI,
  paymentAPI,
  reviewAPI,
   chatAPI,
  apiUtils
};