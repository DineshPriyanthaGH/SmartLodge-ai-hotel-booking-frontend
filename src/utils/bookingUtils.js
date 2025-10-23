// Utility functions for booking data handling

/**
 * Get the total guest count from various guest data formats
 * @param {number|Object} guests - Can be a number or object like {adults: 2, children: 1}
 * @returns {number} Total guest count
 */
export const getTotalGuests = (guests) => {
  if (typeof guests === 'number') {
    return guests;
  }
  
  if (typeof guests === 'object' && guests !== null) {
    const adults = guests.adults || 0;
    const children = guests.children || 0;
    return adults + children;
  }
  
  return 1; // Default fallback
};

/**
 * Format guest display text for UI
 * @param {number|Object} guests - Can be a number or object like {adults: 2, children: 1}
 * @returns {string} Formatted guest text like "2 guests" or "2 adults, 1 child"
 */
export const formatGuestDisplay = (guests) => {
  if (typeof guests === 'number') {
    return `${guests} ${guests === 1 ? 'guest' : 'guests'}`;
  }
  
  if (typeof guests === 'object' && guests !== null) {
    const adults = guests.adults || 0;
    const children = guests.children || 0;
    const total = adults + children;
    
    if (children > 0) {
      return `${adults} ${adults === 1 ? 'adult' : 'adults'}, ${children} ${children === 1 ? 'child' : 'children'}`;
    } else {
      return `${adults} ${adults === 1 ? 'adult' : 'adults'}`;
    }
  }
  
  return '1 guest'; // Default fallback
};

/**
 * Normalize guest data to ensure consistency
 * @param {number|Object} guests - Can be a number or object like {adults: 2, children: 1}
 * @returns {Object} Normalized object with adults and children
 */
export const normalizeGuestData = (guests) => {
  if (typeof guests === 'number') {
    return {
      adults: guests,
      children: 0
    };
  }
  
  if (typeof guests === 'object' && guests !== null) {
    return {
      adults: guests.adults || 1,
      children: guests.children || 0
    };
  }
  
  return {
    adults: 1,
    children: 0
  };
};