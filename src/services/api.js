import axios from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

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
    console.error('API Request Error:', error.response || error);
    
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
    console.error(`API Request Error (${endpoint}):`, error);
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
    return {
      id: booking._id,
      reference: booking.bookingReference,
      hotel: booking.hotel,
      checkIn: new Date(booking.dates.checkIn),
      checkOut: new Date(booking.dates.checkOut),
      nights: booking.dates.nights,
      guests: booking.guests,
      status: booking.status,
      total: booking.pricing.total,
      currency: booking.pricing.currency,
      guestDetails: booking.guestDetails,
      createdAt: new Date(booking.createdAt)
    };
  }
};

export default {
  hotelAPI,
  bookingAPI,
  userAPI,
  paymentAPI,
  reviewAPI,
  apiUtils
};