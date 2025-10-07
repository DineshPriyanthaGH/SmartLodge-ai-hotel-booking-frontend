// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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

// Generic API request function with Clerk authentication
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get authentication token
  const token = await getClerkToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`API Request: ${options.method || 'GET'} ${endpoint}`, {
      hasToken: !!token,
      headers: config.headers
    });
    
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Authentication failed - redirecting to login');
        // Clear any stored tokens
        sessionStorage.removeItem('clerk-session-token');
        // Optionally redirect to login or refresh page
        window.location.href = '/sign-in';
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API Request Error (${endpoint}):`, error);
    throw error;
  }
}

// Hotel API functions
export const hotelAPI = {
  // Get all hotels
  getAllHotels: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/hotels${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get hotel by ID
  getHotelById: async (id) => {
    return apiRequest(`/hotels/${id}`);
  },

  // Search hotels
  searchHotels: async (searchParams) => {
    const queryParams = new URLSearchParams(searchParams).toString();
    return apiRequest(`/hotels/search?${queryParams}`);
  },

  // Get featured hotels
  getFeaturedHotels: async (limit = 10) => {
    return apiRequest(`/hotels/featured?limit=${limit}`);
  },

  // Check hotel availability
  checkAvailability: async (hotelId, checkIn, checkOut, guests) => {
    return apiRequest(`/hotels/${hotelId}/availability`, {
      method: 'POST',
      body: JSON.stringify({ checkIn, checkOut, guests }),
    });
  }
};

// Booking API functions
export const bookingAPI = {
  // Create a new booking
  createBooking: async (bookingData, authToken) => {
    return apiRequest('/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(bookingData),
    });
  },

  // Get user's bookings
  getUserBookings: async (authToken) => {
    return apiRequest('/bookings/my-bookings', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
  },

  // Get booking by ID
  getBookingById: async (bookingId, authToken) => {
    return apiRequest(`/bookings/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
  },

  // Cancel booking
  cancelBooking: async (bookingId, authToken) => {
    return apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
  }
};

// User API functions
export const userAPI = {
  // Sync user with Clerk
  syncClerkUser: async (userData) => {
    return apiRequest('/auth/sync-clerk-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get user profile
  getUserProfile: async (authToken) => {
    return apiRequest('/users/profile', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
  },

  // Update user profile
  updateUserProfile: async (profileData, authToken) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(profileData),
    });
  }
};

// Payment API functions
export const paymentAPI = {
  // Create payment intent
  createPaymentIntent: async (amount, currency, authToken) => {
    return apiRequest('/payments/create-intent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ amount, currency }),
    });
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId, authToken) => {
    return apiRequest('/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ paymentIntentId }),
    });
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
  apiUtils
};