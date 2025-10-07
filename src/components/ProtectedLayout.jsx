import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, Shield, User, Calendar, MapPin, Star, CreditCard, Hotel } from 'lucide-react';

// Skeleton components for loading states
const SkeletonCard = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-300 rounded-lg h-full"></div>
  </div>
);

// Authentication Loading Skeleton
const AuthLoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-pulse mb-6">
        <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <div className="h-6 bg-gray-300 rounded w-48 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
      </div>
      <Loader2 className="w-8 h-8 mx-auto text-blue-600 animate-spin" />
      <p className="text-gray-600 mt-4">Checking authentication...</p>
    </div>
  </div>
);

// Dashboard Loading Skeleton
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-lg mr-4"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-300 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-6 bg-gray-300 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-48 mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-6 bg-gray-300 rounded w-20 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="h-8 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Hotel Detail Loading Skeleton
const HotelDetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header Skeleton */}
    <div className="bg-white shadow-sm p-4">
      <div className="max-w-6xl mx-auto flex items-center">
        <div className="h-10 bg-gray-300 rounded w-32 mr-4 animate-pulse"></div>
        <div className="h-8 bg-gray-300 rounded w-40 animate-pulse"></div>
      </div>
    </div>

    <div className="max-w-6xl mx-auto p-4 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hotel Images and Info Skeleton */}
        <div className="lg:col-span-2">
          {/* Image Gallery Skeleton */}
          <div className="relative h-[400px] rounded-3xl overflow-hidden mb-6 bg-gray-300 animate-pulse"></div>

          {/* Hotel Info Skeleton */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="animate-pulse">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="h-10 bg-gray-300 rounded w-80 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-60 mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                </div>
                <div className="text-right">
                  <div className="h-10 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
              </div>

              {/* Description Skeleton */}
              <div className="mb-8">
                <div className="h-6 bg-gray-300 rounded w-48 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>

              {/* Amenities Skeleton */}
              <div>
                <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Card Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-40 mb-6"></div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-12 bg-gray-300 rounded w-full"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-12 bg-gray-300 rounded w-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                    <div className="h-12 bg-gray-300 rounded w-full"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                    <div className="h-12 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                </div>
              </div>

              <div className="h-12 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main ProtectedLayout Component
function ProtectedLayout({ children, skeletonType = "auth" }) {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const [tokenReady, setTokenReady] = useState(false);
  
  // Get and store session token when user is authenticated
  useEffect(() => {
    const setupToken = async () => {
      if (isSignedIn && getToken) {
        try {
          const token = await getToken();
          if (token) {
            // Store token for API requests
            sessionStorage.setItem('clerk-session-token', token);
            console.log('Clerk session token stored');
          }
          setTokenReady(true);
        } catch (error) {
          console.error('Error getting Clerk token:', error);
          setTokenReady(true); // Continue anyway
        }
      } else {
        // Clear token if not signed in
        sessionStorage.removeItem('clerk-session-token');
        setTokenReady(true);
      }
    };

    if (isLoaded) {
      setupToken();
    }
  }, [isSignedIn, isLoaded, getToken]);
  
  // Show loading skeleton while checking authentication or getting token
  if (!isLoaded || (isSignedIn && !tokenReady)) {
    if (skeletonType === "dashboard") {
      return <DashboardSkeleton />;
    } else if (skeletonType === "hotelDetail") {
      return <HotelDetailSkeleton />;
    } else {
      return <AuthLoadingSkeleton />;
    }
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Render children if authenticated and token is ready
  return children;
}

export default ProtectedLayout;