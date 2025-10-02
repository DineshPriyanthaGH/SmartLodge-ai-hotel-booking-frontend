 import React from 'react';
 import HotelCard from '@/components/HotelCard';//src\components\HotelCard.jsx
 import { hotels } from '@/data/hotels'; // Assuming you have a data file with hotel data
 
 function HotelListings() {
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
       {hotels.map((hotel) => {
         return (
           <HotelCard key={hotel._id} hotel={hotel} />
         );
       })}
      </div>
    </section>
  </div>
 );
 }

 export default HotelListings;