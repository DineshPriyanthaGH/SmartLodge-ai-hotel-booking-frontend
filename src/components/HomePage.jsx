import Hero from './Hero';
import HotelListings from './HotelListtings';
import { useState, useEffect } from 'react';
import { Star, MapPin, Award, Users, Heart, Camera } from 'lucide-react';

function HomePage() {
  // Auto-sliding testimonials
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [currentAmenity, setCurrentAmenity] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "Absolutely incredible experience! The AI recommendations were spot-on and found us the perfect luxury suite.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Michael Chen",
      location: "London, UK", 
      rating: 5,
      text: "The personalized service and attention to detail exceeded all expectations. Will definitely use again!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Emma Rodriguez",
      location: "Barcelona, Spain",
      rating: 5,
      text: "SmartLodge made our honeymoon perfect. The resort they found was beyond our dreams!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  const experiences = [
    {
      title: "Luxury Spa Experiences",
      description: "Rejuvenate with world-class spa treatments",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <Heart className="w-8 h-8" />
    },
    {
      title: "Fine Dining Excellence", 
      description: "Michelin-starred restaurants at your fingertips",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <Award className="w-8 h-8" />
    },
    {
      title: "Adventure & Recreation",
      description: "Exciting activities and premium facilities",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <Camera className="w-8 h-8" />
    }
  ];

  const amenities = [
    {
      title: "Infinity Pools & Spas",
      description: "Relax in stunning infinity pools with breathtaking views",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Private Beach Access",
      description: "Exclusive beachfront locations with crystal clear waters",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Rooftop Lounges",
      description: "Sophisticated rooftop bars with panoramic city views",
      image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Auto-slide effects
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    
    const experienceInterval = setInterval(() => {
      setCurrentExperience((prev) => (prev + 1) % experiences.length);
    }, 3500);
    
    const amenityInterval = setInterval(() => {
      setCurrentAmenity((prev) => (prev + 1) % amenities.length);
    }, 5000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(experienceInterval);
      clearInterval(amenityInterval);
    };
  }, []);

  return (
    <>
      <main>
        <Hero />
      </main>
      
      {/* Luxury Amenities Auto-Sliding Section */}
      <section className="px-2 py-12">
        <div className="relative h-[400px] rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentAmenity === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={amenity.image}
                alt={amenity.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
            </div>
          ))}
          
          <div className="relative z-10 flex items-center h-full px-8">
            <div className="text-white max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {amenities[currentAmenity]?.title}
              </h2>
              <p className="text-xl mb-6 opacity-90">
                {amenities[currentAmenity]?.description}
              </p>
              <div className="flex space-x-2">
                {amenities.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      currentAmenity === index ? 'bg-white w-8' : 'bg-white/50 w-2'
                    }`}
                    onClick={() => setCurrentAmenity(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HotelListings />

      {/* Premium Experiences Auto-Sliding Section */}
      <section className="px-2 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Premium Experiences</h2>
          <p className="text-lg text-gray-600">Discover extraordinary moments crafted just for you</p>
        </div>
        
        <div className="relative h-[300px] rounded-3xl overflow-hidden">
          {experiences.map((experience, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 transform ${
                currentExperience === index 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={experience.image}
                alt={experience.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
                    {experience.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{experience.title}</h3>
                    <p className="text-lg opacity-90">{experience.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {experiences.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  currentExperience === index ? 'bg-white w-6' : 'bg-white/50 w-2'
                }`}
                onClick={() => setCurrentExperience(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Auto-Sliding Section */}
      <section className="px-2 py-12">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Guests Say</h2>
            <p className="text-lg text-gray-600">Real experiences from real travelers</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 transform ${
                    currentTestimonial === index 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-full absolute inset-0'
                  }`}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-bold text-lg">{testimonial.name}</h4>
                        <p className="text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {testimonial.location}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">"{testimonial.text}"</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-3 rounded-full transition-all ${
                    currentTestimonial === index ? 'bg-gray-800 w-8' : 'bg-gray-400 w-3'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;