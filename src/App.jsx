import './App.css'
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Core components - loaded immediately
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardErrorBoundary from './components/DashboardErrorBoundary';

// Lazy load heavy components for better HMR performance
const HomePage = lazy(() => import('./components/HomePage'));
const HotelDetail = lazy(() => import('./components/HotelDetail'));
const Checkout = lazy(() => import('./components/Checkout'));
const BookingSuccess = lazy(() => import('./components/BookingSuccess'));
const SignInPage = lazy(() => import('./components/SignInPage'));
const SignUpPage = lazy(() => import('./components/SignUpPage'));
const UserProfilePage = lazy(() => import('./components/UserProfilePage'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const EmailVerification = lazy(() => import('./components/EmailVerification'));
const AdminPanel = lazy(() => import('./admin/AdminPanel'));
const Chatbot = lazy(() => import('./components/Chatbot'));

// Loading component for Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Admin Panel Routes - Lazy loaded for better performance */}
        <Route path="/admin-secret-panel-2024" element={<AdminPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
        
        {/* Public Routes with Navigation and Footer */}
        <Route path="/*" element={
          <>
            <Navigation />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hotel/:id" element={<HotelDetail />} />
                <Route path="/checkout/:id" element={<Checkout />} />
                <Route path="/booking-success" element={<BookingSuccess />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route 
                  path="/user-profile" 
                  element={
                    <ProtectedRoute>
                      <UserProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardErrorBoundary>
                        <Dashboard />
                      </DashboardErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
            <Footer />
            {/* Global chatbot floating widget - lazy loaded */}
            <Suspense fallback={null}>
              <Chatbot />
            </Suspense>
          </>
        } />
      </Routes>
    </Suspense>
  );
}

export default App
