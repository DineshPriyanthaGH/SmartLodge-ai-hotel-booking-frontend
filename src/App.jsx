import './App.css'
import Hero from './components/Hero';
import HotelListings from './components/HotelListtings';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HotelDetail from './components/HotelDetail';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, MapPin, Award, Users, Heart, Camera } from 'lucide-react';

import HomePage from './components/HomePage';
import Checkout from './components/Checkout';
import BookingSuccess from './components/BookingSuccess';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import UserProfilePage from './components/UserProfilePage';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
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
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App
