import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Star, MapPin, Calendar, Users, Bed, FileText, 
  Wifi, Car, Utensils, Dumbbell, Waves, Edit, Check, X 
} from 'lucide-react';

function CheckoutSummary({ hotel, bookingData, setBookingData, onComplete, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(bookingData);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const amenityIcons = {
    'WiFi': <Wifi className="w-4 h-4" />,
    'Pool': <Waves className="w-4 h-4" />,
    'Spa': <Star className="w-4 h-4" />,
    'Restaurant': <Utensils className="w-4 h-4" />,
    'Gym': <Dumbbell className="w-4 h-4" />,
    'Parking': <Car className="w-4 h-4" />,
    'Beach Access': <Waves className="w-4 h-4" />,
    'Bar': <Utensils className="w-4 h-4" />
  };

  useEffect(() => {
    // Load user email from localStorage if logged in
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setGuestInfo(prev => ({ ...prev, email: userEmail }));
    }

    // Calculate booking details
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * hotel.price * bookingData.rooms;

    setBookingData(prev => ({
      ...prev,
      nights: nights,
      totalPrice: totalPrice
    }));
  }, [bookingData.checkIn, bookingData.checkOut, bookingData.rooms, hotel.price, setBookingData]);

  const handleEditSave = () => {
    setBookingData(editData);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditData(bookingData);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const taxAmount = bookingData.totalPrice * 0.12; // 12% tax
  const finalTotal = bookingData.totalPrice + taxAmount;

  const handleContinue = () => {
    // Save guest info to booking data
    setBookingData(prev => ({
      ...prev,
      ...guestInfo
    }));
    
    // Save to session storage
    sessionStorage.setItem('bookingData', JSON.stringify({
      ...bookingData,
      ...guestInfo
    }));
    
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Review Your Booking</h2>
        <p className="text-gray-600">Please review the details before proceeding to payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hotel Details & Booking Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hotel Info */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{hotel.location}</span>
                </div>
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-semibold">{hotel.rating}</span>
                  <span className="text-gray-500 ml-1">(324 reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.slice(0, 4).map((amenity, index) => (
                    <div key={index} className="flex items-center bg-white rounded-lg px-3 py-1 text-sm">
                      {amenityIcons[amenity] || <Star className="w-4 h-4" />}
                      <span className="ml-1">{amenity}</span>
                    </div>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <div className="bg-white rounded-lg px-3 py-1 text-sm text-gray-600">
                      +{hotel.amenities.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Booking Details</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center"
              >
                {isEditing ? <X className="w-4 h-4 mr-1" /> : <Edit className="w-4 h-4 mr-1" />}
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in</label>
                    <Input
                      type="date"
                      value={editData.checkIn}
                      onChange={(e) => setEditData({...editData, checkIn: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out</label>
                    <Input
                      type="date"
                      value={editData.checkOut}
                      onChange={(e) => setEditData({...editData, checkOut: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Guests</label>
                    <Input
                      type="number"
                      min="1"
                      value={editData.guests}
                      onChange={(e) => setEditData({...editData, guests: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Rooms</label>
                    <Input
                      type="number"
                      min="1"
                      value={editData.rooms}
                      onChange={(e) => setEditData({...editData, rooms: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={handleEditSave} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Check className="w-4 h-4 mr-1" />
                    Save Changes
                  </Button>
                  <Button onClick={handleEditCancel} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-sm text-gray-600">{formatDate(bookingData.checkIn)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Check-out</p>
                    <p className="text-sm text-gray-600">{formatDate(bookingData.checkOut)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Guests</p>
                    <p className="text-sm text-gray-600">{typeof bookingData.guests === 'object' ? `${(bookingData.guests.adults || 0) + (bookingData.guests.children || 0)} guests` : `${bookingData.guests} ${bookingData.guests === 1 ? 'guest' : 'guests'}`}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bed className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">Rooms</p>
                    <p className="text-sm text-gray-600">{bookingData.rooms} {bookingData.rooms === 1 ? 'room' : 'rooms'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Guest Information */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-4">Guest Information</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <Input
                    type="text"
                    required
                    value={guestInfo.firstName}
                    onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <Input
                    type="text"
                    required
                    value={guestInfo.lastName}
                    onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  required
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <Input
                  type="tel"
                  required
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Special Requests</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20"
                  value={guestInfo.specialRequests}
                  onChange={(e) => setGuestInfo({...guestInfo, specialRequests: e.target.value})}
                  placeholder="Any special requests or requirements..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sticky top-4">
            <h4 className="text-lg font-semibold mb-4">Price Summary</h4>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>${hotel.price} × {bookingData.nights} night{bookingData.nights !== 1 ? 's' : ''}</span>
                <span>${hotel.price * bookingData.nights}</span>
              </div>
              
              {bookingData.rooms > 1 && (
                <div className="flex justify-between">
                  <span>× {bookingData.rooms} room{bookingData.rooms !== 1 ? 's' : ''}</span>
                  <span>${bookingData.totalPrice}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Taxes & fees</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h5 className="font-semibold mb-2">Your Stay</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{formatDate(bookingData.checkIn)} - {formatDate(bookingData.checkOut)}</p>
                <p>{bookingData.nights} night{bookingData.nights !== 1 ? 's' : ''} • {typeof bookingData.guests === 'object' ? (bookingData.guests.adults || 0) + (bookingData.guests.children || 0) : bookingData.guests} guest{(typeof bookingData.guests === 'object' ? (bookingData.guests.adults || 0) + (bookingData.guests.children || 0) : bookingData.guests) !== 1 ? 's' : ''} • {bookingData.rooms} room{bookingData.rooms !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone}
              >
                Continue to Payment
              </Button>
              
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSummary;