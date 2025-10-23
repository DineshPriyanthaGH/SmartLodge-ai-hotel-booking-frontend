import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Wifi, Car, Utensils, Dumbbell, Waves, Calendar, Users, CreditCard, ArrowLeft, Loader2, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import api from '../services/api';

const { hotelAPI, reviewAPI, apiUtils } = api;
import ProtectedLayout from './ProtectedLayout';
import ReviewModal from './ReviewModal';

function HotelDetailContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const amenityIcons = {
    'WiFi': <Wifi className="w-5 h-5" />,
    'Pool': <Waves className="w-5 h-5" />,
    'Spa': <Star className="w-5 h-5" />,
    'Restaurant': <Utensils className="w-5 h-5" />,
    'Gym': <Dumbbell className="w-5 h-5" />,
    'Parking': <Car className="w-5 h-5" />,
    'Beach Access': <Waves className="w-5 h-5" />,
    'Bar': <Utensils className="w-5 h-5" />,
    'Business Center': <CreditCard className="w-5 h-5" />,
    'Ski Access': <Star className="w-5 h-5" />,
    'Fireplace': <Star className="w-5 h-5" />,
    'Golf Course': <Star className="w-5 h-5" />,
    'Historic Architecture': <Star className="w-5 h-5" />,
    'Concierge': <Users className="w-5 h-5" />,
    'Private Beach': <Waves className="w-5 h-5" />,
    'Water Sports': <Waves className="w-5 h-5" />,
    'Rooftop Bar': <Utensils className="w-5 h-5" />,
    'Art Gallery': <Star className="w-5 h-5" />,
    'Valet Parking': <Car className="w-5 h-5" />
  };

  const hotelImages = [
    hotel?.image,
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ].filter(Boolean);

  // Fetch hotel data from API
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await hotelAPI.getHotelById(id);
        
        if (response.success && response.data && response.data.hotel) {
          // Format hotel data for frontend use
          const formattedHotel = apiUtils.formatHotelData(response.data.hotel);
          setHotel(formattedHotel);
        } else {
          setError('Hotel not found');
        }
      } catch (err) {
        console.error('Error fetching hotel:', err);
        setError('Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotel();
    }
  }, [id]);

  useEffect(() => {
    if (hotelImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [hotelImages.length]);

  // Availability checking function
  const checkAvailability = async () => {
    const totalGuests = typeof bookingData.guests === 'object' 
      ? (bookingData.guests.adults || 0) + (bookingData.guests.children || 0) 
      : bookingData.guests;
    
    if (!bookingData.checkIn || !bookingData.checkOut || !totalGuests || !bookingData.rooms) {
      return;
    }

    setIsCheckingAvailability(true);
    setAvailabilityStatus(null);

    // Simulate API call delay
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate availability logic
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      
      // Check if check-in date is in the past
      if (checkInDate < today) {
        setAvailabilityStatus('pastDate');
        setAvailableRooms(0);
        return;
      }
      
      // Check if check-out date is before or same as check-in date
      if (checkOutDate <= checkInDate) {
        setAvailabilityStatus('invalidRange');
        setAvailableRooms(0);
        return;
      }
      
      // Check if stay is too long (more than 30 days)
      const daysDiff = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
      if (daysDiff > 30) {
        setAvailabilityStatus('tooLong');
        setAvailableRooms(0);
        return;
      }

      // Simulate random availability (80% chance of availability)
      const isAvailable = Math.random() > 0.2;
      const maxRooms = Math.floor(Math.random() * 10) + 5; // 5-15 available rooms
      
      if (isAvailable && maxRooms >= bookingData.rooms) {
        setAvailabilityStatus('available');
        setAvailableRooms(maxRooms);
      } else {
        setAvailabilityStatus('unavailable');
        setAvailableRooms(maxRooms);
      }
    } catch (error) {
      setAvailabilityStatus('error');
      setAvailableRooms(0);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Auto-check availability when dates/rooms/guests change
  useEffect(() => {
    const timer = setTimeout(() => {
      const totalGuests = typeof bookingData.guests === 'object' 
        ? (bookingData.guests.adults || 0) + (bookingData.guests.children || 0) 
        : bookingData.guests;
      
      if (bookingData.checkIn && bookingData.checkOut && totalGuests && bookingData.rooms) {
        checkAvailability();
      } else {
        setAvailabilityStatus(null);
        setAvailableRooms(0);
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timer);
  }, [bookingData.checkIn, bookingData.checkOut, bookingData.guests, bookingData.rooms]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Save booking data to sessionStorage
    const bookingInfo = {
      ...bookingData,
      hotelId: hotel.id,
      totalPrice: totalPrice,
      nights: calculateNights()
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingInfo));
    
    // Navigate to checkout
    navigate(`/checkout/${hotel.id}`);
  };

  const handleBookNowClick = () => {
    console.log('Book Now clicked!');
    console.log('Hotel ID:', hotel?.id);
    console.log('Availability status:', availabilityStatus);
    console.log('Booking data:', bookingData);
    
    if (!hotel?.id) {
      console.error('Hotel ID is missing!');
      alert('Error: Hotel information not loaded properly. Please refresh the page.');
      return;
    }
    
    // Check if required booking data is present
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Please select check-in and check-out dates before booking.');
      return;
    }
    
    // Allow booking if availability is available OR if no check has been done yet
    if (availabilityStatus === 'available' || !availabilityStatus) {
      // Save current booking data and navigate to checkout
      const bookingInfo = {
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: typeof bookingData.guests === 'object' 
          ? (bookingData.guests.adults || 0) + (bookingData.guests.children || 0)
          : bookingData.guests,
        rooms: bookingData.rooms,
        hotelId: hotel.id,
        totalPrice: totalPrice,
        nights: calculateNights()
      };
      
      console.log('Booking info to save:', bookingInfo);
      sessionStorage.setItem('bookingData', JSON.stringify(bookingInfo));
      console.log('Navigating to:', `/checkout/${hotel.id}`);
      navigate(`/checkout/${hotel.id}`);
    } else {
      console.log('Availability status prevents booking:', availabilityStatus);
      alert(`Cannot proceed with booking. Status: ${availabilityStatus}. Please check your dates and try again.`);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      console.log('Submitting review:', reviewData);
      await reviewAPI.createReview(reviewData);
      setIsReviewModalOpen(false);
      
      // Show success message
      alert('Thank you for your review! It has been submitted successfully.');
      
      // Optionally refresh hotel data to update ratings
      // You can uncomment this if you want to refresh the hotel data immediately
      // const updatedHotel = await hotelAPI.getHotel(id);
      // setHotel(updatedHotel.data);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const timeDiff = checkOut - checkIn;
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      return daysDiff > 0 ? daysDiff : 0;
    }
    return 0;
  };

  const totalPrice = calculateNights() * hotel?.price * bookingData.rooms;

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to get minimum checkout date (day after checkin)
  const getMinCheckoutDate = () => {
    if (!bookingData.checkIn) return getTodayDate();
    const checkInDate = new Date(bookingData.checkIn);
    checkInDate.setDate(checkInDate.getDate() + 1);
    return checkInDate.toISOString().split('T')[0];
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
          <h2 className="text-2xl font-bold mb-4">{error || 'Hotel not found'}</h2>
          <p className="text-gray-600 mb-6">We couldn't find the hotel you're looking for.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isReviewModalOpen ? 'blur-sm' : ''}`}>
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Hotels
            </Button>
            <h1 className="text-2xl font-bold">Hotel Details</h1>
          </div>
          
          {/* Leave User Experience Button */}
          <Button 
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold flex items-center space-x-2 shadow-lg transition-all duration-200 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Leave User Experience</span>
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hotel Images and Info */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden mb-6">
              {hotelImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${hotel.name} - Image ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              
              {/* Image Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {hotelImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentImageIndex === index ? 'bg-white w-8' : 'bg-white/50 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Hotel Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="text-lg">{hotel.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold text-lg">{hotel.rating}</span>
                    </div>
                    <span className="text-gray-500">(324 reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">${hotel.price}</div>
                  <div className="text-gray-500">per night</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">About This Hotel</h3>
                <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-blue-600">
                        {amenityIcons[amenity] || <Star className="w-5 h-5" />}
                      </div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-lg sticky top-4">
              <h3 className="text-2xl font-bold mb-6">Book Your Stay</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in</label>
                  <Input
                    type="date"
                    value={bookingData.checkIn}
                    min={getTodayDate()}
                    onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                    className="w-full"
                    placeholder="Select check-in date"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out</label>
                  <Input
                    type="date"
                    value={bookingData.checkOut}
                    min={getMinCheckoutDate()}
                    onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                    className="w-full"
                    placeholder="Select check-out date"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Guests</label>
                    <Input
                      type="number"
                      min="1"
                      value={typeof bookingData.guests === 'object' 
                        ? (bookingData.guests.adults || 0) + (bookingData.guests.children || 0)
                        : bookingData.guests}
                      onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Rooms</label>
                    <Input
                      type="number"
                      min="1"
                      value={bookingData.rooms}
                      onChange={(e) => setBookingData({...bookingData, rooms: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Availability Checker */}
              {(bookingData.checkIn || bookingData.checkOut || isCheckingAvailability || availabilityStatus) && (
                <div className="mb-6">
                  {isCheckingAvailability && (
                    <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Loader2 className="w-5 h-5 mr-3 animate-spin text-blue-600" />
                      <span className="text-blue-700 font-medium">Checking availability...</span>
                    </div>
                  )}

                  {!isCheckingAvailability && availabilityStatus === 'available' && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        <span className="text-green-700 font-semibold">Great! Rooms Available</span>
                      </div>
                      <p className="text-green-600 text-sm">
                        {availableRooms} rooms available for your selected dates
                      </p>
                    </div>
                  )}

                  {!isCheckingAvailability && availabilityStatus === 'unavailable' && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center mb-2">
                        <XCircle className="w-5 h-5 mr-2 text-red-600" />
                        <span className="text-red-700 font-semibold">Limited Availability</span>
                      </div>
                      <p className="text-red-600 text-sm">
                        Only {availableRooms} rooms available. Please reduce room count or try different dates.
                      </p>
                    </div>
                  )}

                  {!isCheckingAvailability && availabilityStatus === 'pastDate' && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center mb-2">
                        <XCircle className="w-5 h-5 mr-2 text-yellow-600" />
                        <span className="text-yellow-700 font-semibold">Past Date Selected</span>
                      </div>
                      <p className="text-yellow-600 text-sm">
                        Check-in date cannot be in the past. Please select today or a future date.
                      </p>
                    </div>
                  )}

                  {!isCheckingAvailability && availabilityStatus === 'invalidRange' && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center mb-2">
                        <XCircle className="w-5 h-5 mr-2 text-yellow-600" />
                        <span className="text-yellow-700 font-semibold">Invalid Date Range</span>
                      </div>
                      <p className="text-yellow-600 text-sm">
                        Check-out date must be after check-in date. Please select a valid date range.
                      </p>
                    </div>
                  )}

                  {!isCheckingAvailability && availabilityStatus === 'tooLong' && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center mb-2">
                        <XCircle className="w-5 h-5 mr-2 text-yellow-600" />
                        <span className="text-yellow-700 font-semibold">Stay Too Long</span>
                      </div>
                      <p className="text-yellow-600 text-sm">
                        Maximum stay duration is 30 days. Please select a shorter period.
                      </p>
                    </div>
                  )}

                  {!isCheckingAvailability && availabilityStatus === 'error' && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center mb-2">
                        <XCircle className="w-5 h-5 mr-2 text-red-600" />
                        <span className="text-red-700 font-semibold">Error Checking Availability</span>
                      </div>
                      <p className="text-red-600 text-sm">
                        Unable to check availability. Please try again later.
                      </p>
                    </div>
                  )}
                  
                  {availabilityStatus && !isCheckingAvailability && (
                    <button
                      onClick={checkAvailability}
                      className="mt-3 w-full text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
                    >
                      Refresh Availability
                    </button>
                  )}
                </div>
              )}

              {/* Price Summary */}
              {calculateNights() > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span>${hotel.price} x {calculateNights()} nights x {bookingData.rooms} room(s)</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="border-t pt-2 font-bold text-lg">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleBookNowClick}
                className={`w-full py-3 text-lg font-semibold transition-all ${
                  availabilityStatus === 'available' && !isCheckingAvailability
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                disabled={
                  !bookingData.checkIn || 
                  !bookingData.checkOut || 
                  isCheckingAvailability
                }
              >
                {isCheckingAvailability ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : availabilityStatus === 'available' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Book Now - Available
                  </>
                ) : !availabilityStatus && bookingData.checkIn && bookingData.checkOut ? (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Checkout
                  </>
                ) : availabilityStatus === 'unavailable' ? (
                  'Limited Availability'
                ) : availabilityStatus === 'pastDate' ? (
                  'Select Future Date'
                ) : availabilityStatus === 'invalidRange' ? (
                  'Fix Date Range'
                ) : availabilityStatus === 'tooLong' ? (
                  'Reduce Stay Duration'
                ) : availabilityStatus === 'error' ? (
                  'Try Again Later'
                ) : (
                  'Select Dates to Continue'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6">Complete Your Booking</h2>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <Input
                    type="text"
                    required
                    value={bookingData.firstName}
                    onChange={(e) => setBookingData({...bookingData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <Input
                    type="text"
                    required
                    value={bookingData.lastName}
                    onChange={(e) => setBookingData({...bookingData, lastName: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  required
                  value={bookingData.email}
                  onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <Input
                  type="tel"
                  required
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Special Requests</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24"
                  placeholder="Any special requests or requirements..."
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h3 className="font-semibold mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hotel:</span>
                    <span>{hotel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>{bookingData.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>{bookingData.checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{typeof bookingData.guests === 'object' ? (bookingData.guests.adults || 0) + (bookingData.guests.children || 0) : bookingData.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rooms:</span>
                    <span>{bookingData.rooms}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Confirm Booking
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
          hotelId={hotel.id}
          hotelName={hotel.name}
        />
      )}
    </div>
  );
}

function HotelDetail() {
  return (
    <ProtectedLayout skeletonType="hotelDetail">
      <HotelDetailContent />
    </ProtectedLayout>
  );
}

export default HotelDetail;