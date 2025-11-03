import { useUser } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'
import { Calendar, MapPin, Star, CreditCard, RefreshCw, AlertCircle, MessageSquare, Trash2, User, Activity } from 'lucide-react'
import { Button } from './ui/button'
import { bookingAPI, reviewAPI, userAPI, apiUtils } from '../services/api'
import ProtectedLayout from './ProtectedLayout'
import ApiTest from './ApiTest'

function DashboardContent() {
  const { user } = useUser()
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('bookings')

  useEffect(() => {
    let isMounted = true;
    
    if (user && isMounted) {
      fetchUserData()
      if (activeTab === 'reviews') {
        fetchUserReviews()
      }
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [user, activeTab])

  const fetchUserData = async () => {
    await Promise.all([
      fetchUserBookings(),
      fetchUserStats()
    ])
  }

  const fetchUserBookings = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Use axios-based API service
      const response = await bookingAPI.getUserBookings()
      
      if (response.success && response.data) {
        // The API now returns bookings directly in response.data (array)
        const bookingsArray = Array.isArray(response.data) ? response.data : (response.data.bookings || []);
        
        // Debug: Log first booking structure if in development
        if (import.meta.env.DEV && bookingsArray.length > 0) {
          console.log('📊 Sample booking data structure:', bookingsArray[0]);
        }
        
        const formattedBookings = bookingsArray
          .map(apiUtils.formatBookingData)
          .filter(booking => booking !== null); // Filter out null bookings
        setBookings(formattedBookings)
        // Only log in development
        if (import.meta.env.DEV) {
          console.log(`✅ Loaded ${formattedBookings.length} bookings from ${response.metadata?.source || 'unknown'} source`)
        }
      } else {
        setError('Failed to load bookings')
      }
    } catch (err) {
      // Essential error logging only
      if (import.meta.env.DEV) {
        console.error('Error fetching bookings:', err)
      }
      
      if (err.response?.status === 404) {
        setError('Booking system is being set up. Please try again shortly.')
      } else if (err.response?.status >= 500) {
        setError('Server is experiencing issues. Please try again later.')
      } else {
        setError('Unable to load your bookings. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await userAPI.getUserStats()
      if (response.success) {
        setUserStats(response.data)
      }
    } catch (err) {
      // Handle 404 errors more gracefully (endpoint not yet deployed)
      if (err.response?.status === 404) {
        console.info('📊 User stats endpoint not yet available')
        // Set fallback data
        setUserStats({
          totalBookings: 'Coming Soon',
          upcomingBookings: 'Coming Soon',
          favoriteDestination: 'Coming Soon'
        })
      } else {
        if (import.meta.env.DEV) {
          console.error('Error fetching user stats:', err)
        }
      }
    }
  }

  const fetchUserReviews = async () => {
    try {
      setReviewsLoading(true)
      const response = await reviewAPI.getUserReviews()
      
      if (response.success && response.data) {
        setReviews(response.data.reviews || [])
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error fetching reviews:', err)
      }
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      await reviewAPI.deleteReview(reviewId)
      setReviews(reviews.filter(review => review._id !== reviewId))
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error deleting review:', err)
      }
      alert('Failed to delete review')
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
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'bookings'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Your Bookings ({bookings.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'reviews'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Your Reviews ({reviews.length})
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'bookings' && (
                  <>
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
                  </>
                )}

                {activeTab === 'reviews' && (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Your Reviews</h2>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchUserReviews}
                        disabled={reviewsLoading}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${reviewsLoading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                    
                    {reviewsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                        ))}
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No reviews yet</p>
                        <Button asChild>
                          <a href="/">Browse Hotels to Review</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gray-50">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {review.hotel?.name || 'Hotel Name'}
                                </h3>
                                <div className="flex items-center mt-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < (review.rating?.overall || 0)
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-2 text-sm text-gray-600">
                                    {review.rating?.overall || 0}/5
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {review.verified && (
                                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    Verified Stay
                                  </span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteReview(review._id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                            
                            {review.title && (
                              <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                            )}
                            
                            {review.comment && (
                              <p className="text-gray-700 text-sm mb-4">{review.comment}</p>
                            )}
                            
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                              <div className="text-xs text-gray-500">
                                Posted on {new Date(review.createdAt).toLocaleDateString()}
                                {review.updatedAt !== review.createdAt && (
                                  <span> • Updated {new Date(review.updatedAt).toLocaleDateString()}</span>
                                )}
                              </div>
                              {review.helpfulVotes > 0 && (
                                <div className="text-xs text-gray-500">
                                  {review.helpfulVotes} found this helpful
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Account Info</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member since</p>
                  <p className="font-medium">{new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
                {user?.phoneNumbers?.[0] && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{user.phoneNumbers[0].phoneNumber}</p>
                  </div>
                )}
              </div>
              <Button className="w-full mt-4" asChild>
                <a href="/user-profile">Edit Profile</a>
              </Button>
            </div>

            {/* Activity Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Activity className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Your Activity</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="font-medium text-blue-600">{bookings.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reviews Written</span>
                  <span className="font-medium text-green-600">{reviews.length}</span>
                </div>
                {userStats && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Spent</span>
                      <span className="font-medium text-purple-600">${userStats.totalSpent || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg Rating Given</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{userStats.avgRatingGiven || 0}/5</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('reviews')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write Reviews
                </Button>
              </div>
            </div>

            {/* API Test Component (Development Only) */}
            {process.env.NODE_ENV === 'development' && <ApiTest />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedLayout skeletonType="dashboard">
      <DashboardContent />
    </ProtectedLayout>
  );
}