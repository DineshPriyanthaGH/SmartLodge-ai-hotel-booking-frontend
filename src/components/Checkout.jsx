import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, User, CreditCard, FileText, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { hotels } from '../data/hotels';
import CheckoutAuth from './CheckoutAuth';
import CheckoutSummary from './CheckoutSummary';
import CheckoutPayment from './CheckoutPayment';

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [hotel, setHotel] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    totalPrice: 0,
    nights: 0
  });

  const steps = [
    { number: 1, title: 'Login', icon: User, description: 'Sign in to continue' },
    { number: 2, title: 'Summary', icon: FileText, description: 'Review booking details' },
    { number: 3, title: 'Payment', icon: CreditCard, description: 'Complete payment' }
  ];

  useEffect(() => {
    // Get booking data from sessionStorage or URL params
    const savedBookingData = sessionStorage.getItem('bookingData');
    const foundHotel = hotels.find(h => h.id === parseInt(id));
    
    if (savedBookingData) {
      setBookingData(JSON.parse(savedBookingData));
    }
    
    if (foundHotel) {
      setHotel(foundHotel);
    } else {
      // Redirect to home if hotel not found
      navigate('/');
    }

    // Check if user is already logged in (simulate with localStorage for demo)
    const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (userLoggedIn) {
      setIsLoggedIn(true);
      setCurrentStep(2); // Skip to summary if already logged in
    }
  }, [id, navigate]);

  const handleStepComplete = (stepNumber) => {
    if (stepNumber === 1) {
      setIsLoggedIn(true);
      setCurrentStep(2);
    } else if (stepNumber === 2) {
      setCurrentStep(3);
    } else if (stepNumber === 3) {
      // Payment completed - redirect to success page
      navigate('/booking-success');
    }
  };

  const goToStep = (stepNumber) => {
    if (stepNumber === 1) {
      setCurrentStep(1);
    } else if (stepNumber === 2 && isLoggedIn) {
      setCurrentStep(2);
    } else if (stepNumber === 3 && isLoggedIn) {
      setCurrentStep(3);
    }
  };

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/hotel/${id}`)}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Hotel
            </Button>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
          <div className="text-right">
            <h2 className="font-semibold text-lg">{hotel.name}</h2>
            <p className="text-gray-600">{hotel.location}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 mt-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div 
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 cursor-pointer transition-all ${
                    currentStep > step.number
                      ? 'bg-green-500 border-green-500 text-white'
                      : currentStep === step.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-200 border-gray-300 text-gray-500'
                  }`}
                  onClick={() => goToStep(step.number)}
                >
                  {currentStep > step.number ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                
                <div className="ml-3 text-center">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`mx-6 h-0.5 w-16 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          {currentStep === 1 && (
            <CheckoutAuth 
              onComplete={() => handleStepComplete(1)}
              onSkip={() => handleStepComplete(1)}
            />
          )}
          
          {currentStep === 2 && (
            <CheckoutSummary 
              hotel={hotel}
              bookingData={bookingData}
              setBookingData={setBookingData}
              onComplete={() => handleStepComplete(2)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          
          {currentStep === 3 && (
            <CheckoutPayment 
              hotel={hotel}
              bookingData={bookingData}
              onComplete={() => handleStepComplete(3)}
              onBack={() => setCurrentStep(2)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
