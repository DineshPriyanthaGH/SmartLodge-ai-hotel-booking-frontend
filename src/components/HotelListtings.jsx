 import React, { useState, useEffect } from 'react';
 import HotelCard from '@/components/HotelCard';
 import { hotelAPI, apiUtils } from '../services/api';
 
 function HotelListings() {
   const [hotels, setHotels] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
     fetchHotels();
   }, []);

   const fetchHotels = async () => {
     try {
       setLoading(true);
       setError(null);
       
       const response = await hotelAPI.getAllHotels();
       
       if (response.success && response.data && response.data.hotels) {
         // Format hotel data for frontend use
         const formattedHotels = response.data.hotels.map(apiUtils.formatHotelData);
         setHotels(formattedHotels);
       } else {
         setError('Failed to fetch hotels');
       }
     } catch (err) {
       console.error('Error fetching hotels:', err);
       setError('Failed to load hotels. Please try again.');
     } finally {
       setLoading(false);
     }
   };

   if (loading) {
     return (
       <div className="px-8 py-8 lg:py-8">
         <div className="flex justify-center items-center min-h-[400px]">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           <span className="ml-3 text-gray-600">Loading amazing hotels...</span>
         </div>
       </div>
     );
   }

   if (error) {
     return (
       <div className="px-8 py-8 lg:py-8">
         <div className="flex flex-col justify-center items-center min-h-[400px]">
           <div className="text-red-600 mb-4">⚠️ {error}</div>
           <button 
             onClick={fetchHotels}
             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
           >
             Try Again
           </button>
         </div>
       </div>
     );
   }

    return ( 
        <div>
               <section className="px-8 py-8 lg:py-8">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Top trending hotels worldwide
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover the most trending hotels worldwide for an unforgettable
          experience.
        </p>
        {hotels.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Found {hotels.length} amazing hotel{hotels.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      
      {hotels.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">🏨 No hotels available at the moment</div>
          <button 
            onClick={fetchHotels}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {hotels.map((hotel) => {
           return (
             <HotelCard key={hotel.id} hotel={hotel} />
           );
         })}
        </div>
      )}
    </section>
  </div>
 );
 }

 export default HotelListings;