import './App.css'
import Hero from './components/Hero';
import HotelListings from './components/HotelListtings';
import Navigation from './components/Navigation';
import { useState, useEffect } from 'react';
import { Star, MapPin, Award, Users, Heart, Camera } from 'lucide-react';


function App() {
 return (
    <>
   <Navigation />
   <main >
    
       <Hero />
    </main>
    <HotelListings />

   
  
    </>
  )
}

export default App
