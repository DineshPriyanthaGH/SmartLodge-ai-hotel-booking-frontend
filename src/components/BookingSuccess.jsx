import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, Calendar, MapPin, Users, Bed, 
  Download, Mail, Share, Home, Star 
} from 'lucide-react';
import { Button } from './ui/button';

function BookingSuccess() {
  const navigate = useNavigate();
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const confirmation = sessionStorage.getItem('bookingConfirmation');
    if (confirmation) {
      setBookingConfirmation(JSON.parse(confirmation));
      setIsLoading(false);
    } else {
      // If no booking confirmation, redirect to home
      setTimeout(() => navigate('/'), 2000);
    }
  }, [navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const downloadConfirmation = () => {
    // Simulate PDF download
    alert('Booking confirmation PDF downloaded!');
  };

  const shareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Hotel Booking',
        text: `I just booked ${bookingConfirmation.hotel.name} through SmartLodge!`,
        url: window.location.origin
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`I just booked ${bookingConfirmation.hotel.name} through SmartLodge! Check it out at ${window.location.origin}`);
      alert('Booking details copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-4">Processing your booking...</h2>
        </div>
      </div>
    );
  }

  if (!bookingConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No booking found</h2>
          <Button onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const { hotel, bookingData, bookingId, totalAmount } = bookingConfirmation;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Your reservation at <span className="font-semibold">{hotel.name}</span> is confirmed
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          {/* Hotel Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative p-6 h-full flex items-end">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2">{hotel.name}</h2>
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">{hotel.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-semibold">{hotel.rating}</span>
                  <span className="ml-2 opacity-90">(324 reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Check-in/out */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Stay</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">Check-in</p>
                      <p className="text-gray-600">{formatDate(bookingData.checkIn)}</p>
                      <p className="text-sm text-gray-500">After 3:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">Check-out</p>
                      <p className="text-gray-600">{formatDate(bookingData.checkOut)}</p>
                      <p className="text-sm text-gray-500">Before 11:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Guest Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">{bookingData.guests} Guest{bookingData.guests !== 1 ? 's' : ''}</p>
                      <p className="text-gray-600">{bookingData.firstName} {bookingData.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Bed className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">{bookingData.rooms} Room{bookingData.rooms !== 1 ? 's' : ''}</p>
                      <p className="text-gray-600">{bookingData.nights} night{bookingData.nights !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-8 mb-8">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">{bookingData.email}</p>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">{bookingData.phone}</p>
                </div>
              </div>
              {bookingData.specialRequests && (
                <div className="mt-4">
                  <p className="font-medium">Special Requests</p>
                  <p className="text-gray-600">{bookingData.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Room rate ({bookingData.nights} night{bookingData.nights !== 1 ? 's' : ''})</span>
                    <span>${(bookingData.totalPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & fees</span>
                    <span>${(totalAmount - bookingData.totalPrice).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Paid</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={downloadConfirmation}
            variant="outline"
            className="flex items-center justify-center py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </Button>
          
          <Button
            onClick={() => window.open(`mailto:${bookingData.email}?subject=Hotel Booking Confirmation - ${bookingId}`)}
            variant="outline"
            className="flex items-center justify-center py-3 border-2 border-green-600 text-green-600 hover:bg-green-50"
          >
            <Mail className="w-5 h-5 mr-2" />
            Email Confirmation
          </Button>
          
          <Button
            onClick={shareBooking}
            variant="outline"
            className="flex items-center justify-center py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <Share className="w-5 h-5 mr-2" />
            Share Booking
          </Button>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Information</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
              A confirmation email has been sent to {bookingData.email}
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
              Free cancellation until 24 hours before check-in
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
              Please bring a valid ID and credit card for check-in
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
              Contact the hotel directly for any special arrangements
            </li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="text-center space-y-4">
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold mr-4"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 px-8 py-3 text-lg"
          >
            View My Bookings
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;