import { useUser } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'
import { Calendar, MapPin, Star, CreditCard, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { bookingAPI, apiUtils } from '../services/api'

export default function Dashboard() {
  const { user } = useUser()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUserBookings()
  }, [])

  const fetchUserBookings = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Get Clerk token for authentication
      const token = await user.getToken()
      
      // Use our API service to fetch bookings
      const response = await bookingAPI.getUserBookings(token)
      
      if (response.success && response.data) {
        // Format booking data for frontend use
        const formattedBookings = response.data.bookings.map(apiUtils.formatBookingData)
        setBookings(formattedBookings)
      } else {
        setError('Failed to load bookings')
      }
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Unable to load your bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">Manage your bookings and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Bookings</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchUserBookings}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}
              
              {bookings.length === 0 && !error ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No bookings found</p>
                  <Button asChild>
                    <a href="/">Browse Hotels</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {booking.hotel?.name || 'Hotel Name'}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{booking.hotel?.location?.city}, {booking.hotel?.location?.state}</span>
                          </div>
                          {booking.reference && (
                            <div className="text-xs text-gray-500 mt-1">
                              Booking Reference: {booking.reference}
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <div>
                            <div className="font-medium">Check-in</div>
                            <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <div>
                            <div className="font-medium">Check-out</div>
                            <div>{new Date(booking.checkOut).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{booking.nights} nights</span> • 
                          <span className="font-medium"> {booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center text-lg font-bold text-gray-900">
                          <CreditCard className="h-5 w-5 mr-1" />
                          ${booking.total}
                        </div>
                      </div>
                      
                      {booking.createdAt && (
                        <div className="text-xs text-gray-500 mt-2">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member since</p>
                  <p className="font-medium">{new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <Button className="w-full mt-4" asChild>
                <a href="/user-profile">Edit Profile</a>
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/">
                    <Star className="h-4 w-4 mr-2" />
                    Browse Hotels
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/user-profile">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Account
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}