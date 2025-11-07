import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Plus, Sparkles, Brain, Clock, Crown } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { submit } from "@/lib/features/searchSlice";
import { cn } from "@/lib/utils";

const heroImages = [
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/84555265.jpg?k=ce7c3c699dc591b8fbac1a329b5f57247cfa4d13f809c718069f948a4df78b54&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/608273980.jpg?k=c7df20ffb25ae52b6a17037dc13f5e15b94a0fe253a9b9d0b656f6376eabec7d&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/606303798.jpg?k=514943d0025704b27396faf82af167468d8b50b98f311668f206f79ca36cb53d&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/60307464.jpg?k=67ae35316203e2ec82d8e02e0cef883217cce9c436da581528b94ad6dee8e393&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308794596.jpg?k=76bbd047a4f3773844efb15819a637f10fb98671244760fcd69cf26d1073b797&o=&hp=1",
];

export default function Hero() {
  //   const dispatch = useDispatch();

  // Logic for animating slides
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index) => {
      if (index === currentSlide || isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
    },
    [currentSlide, isTransitioning]
  );

  useEffect(() => {
    let transitionTimeout;
    if (isTransitioning) {
      transitionTimeout = setTimeout(() => setIsTransitioning(false), 500);
    }
    return () => clearTimeout(transitionTimeout);
  }, [isTransitioning]);

  useEffect(() => {
    let intervalId;
    if (!isTransitioning) {
      intervalId = setInterval(() => {
        const nextSlide = (currentSlide + 1) % heroImages.length;
        goToSlide(nextSlide);
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [currentSlide, isTransitioning, goToSlide]);

  //   const handleSearch = useCallback(
  //     (e) => {
  //       e.preventDefault();
  //       const searchQuery = e.target.search.value.trim();
  //       if (!searchQuery) return;

  //       try {
  //         dispatch(submit(searchQuery));
  //       } catch (error) {
  //         console.error("Search failed:", error);
  //       }
  //     },
  //     [dispatch]
  //   );

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("dinesh");
  };

  return (
    <>
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] py-1 mx-2 my overflow-hidden rounded-2xl sm:rounded-3xl bg-black z-0">
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
            currentSlide === index ? "opacity-100" : "opacity-0"
          )}
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-white justify-center h-full px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 text-center leading-tight">
          Find Your Best Staycation
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-center max-w-xs sm:max-w-md md:max-w-2xl leading-relaxed opacity-90">
          Describe your dream destination and experience, and we'll find the
          perfect place for you.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full max-w-xs sm:max-w-md md:max-w-lg">
          <div className="relative flex items-center">
            <div className="relative flex-grow">
              <Input
                type="text"
                name="search"
                placeholder="Search destinations..." 
                className="bg-[#1a1a1a]/80 backdrop-blur-sm text-xs sm:text-sm md:text-base text-white placeholder:text-white/70 placeholder:text-xs sm:placeholder:text-sm md:placeholder:text-base border-0 rounded-full py-3 sm:py-4 md:py-6 pl-4 sm:pl-6 pr-20 sm:pr-28 md:pr-32 w-full transition-all shadow-lg"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer absolute right-1 sm:right-2 h-[75%] sm:h-[80%] my-auto bg-black text-white rounded-full px-2 sm:px-3 md:px-4 flex items-center gap-x-1 sm:gap-x-2 border-white border-2 hover:bg-white/10 transition-colors shadow-md"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 fill-white" />
              <span className="text-xs sm:text-sm font-medium">AI Search</span>
            </button>
          </div>
        </form>

        {/* Pagination dots */}
        <div className="absolute bottom-4 sm:bottom-6 flex space-x-2 sm:space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 sm:h-3 transition-all rounded-full",
                currentSlide === index
                  ? "bg-white w-6 sm:w-8"
                  : "bg-white/50 w-2 sm:w-3 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Features Section - Hidden on mobile, visible on tablet+ */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6 md:p-8 hidden sm:block">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-white">
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Brain className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />
            </div>
            <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">AI-Powered Search</h3>
            <p className="text-xs sm:text-sm text-white/80">Smart recommendations based on your preferences</p>
          </div>
          <div className="text-center hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">Instant Booking</h3>
            <p className="text-sm text-white/80">Quick and secure reservation process</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Crown className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />
            </div>
            <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">Premium Experience</h3>
            <p className="text-xs sm:text-sm text-white/80">Curated selection of luxury accommodations</p>
          </div>
        </div>
      </div>
    </div>

    {/* Popular Destinations Section */}
    <div className="px-2 py-6 sm:py-8">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Popular Destinations</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">Explore the world's most sought-after travel destinations</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <div className="relative group cursor-pointer">
            <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Paris"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl sm:rounded-2xl"></div>
              <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 text-white">
                <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl">Paris</h3>
                <p className="text-xs sm:text-sm opacity-90">City of Light</p>
              </div>
            </div>
          </div>
          
          <div className="relative group cursor-pointer">
            <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="London"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl sm:rounded-2xl"></div>
              <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 text-white">
                <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl">London</h3>
                <p className="text-xs sm:text-sm opacity-90">Historic Elegance</p>
              </div>
            </div>
          </div>
          
          <div className="relative group cursor-pointer">
            <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Santorini"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl sm:rounded-2xl"></div>
              <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 text-white">
                <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl">Santorini</h3>
                <p className="text-xs sm:text-sm opacity-90">Island Paradise</p>
              </div>
            </div>
          </div>
          
          <div className="relative group cursor-pointer">
            <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Tokyo"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl sm:rounded-2xl"></div>
              <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 text-white">
                <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl">Tokyo</h3>
                <p className="text-xs sm:text-sm opacity-90">Modern Metropolis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}