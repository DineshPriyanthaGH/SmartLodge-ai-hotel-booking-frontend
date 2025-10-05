import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  CreditCard, Shield, Lock, Calendar, 
  CheckCircle, AlertCircle, Loader2 
} from 'lucide-react';

function CheckoutPayment({ hotel, bookingData, onComplete, onBack }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'US'
  });

  const taxAmount = bookingData.totalPrice * 0.12;
  const finalTotal = bookingData.totalPrice + taxAmount;

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardData({ ...cardData, cardNumber: formatted });
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setCardData({ ...cardData, expiryDate: formatted });
  };

  const getCardType = (number) => {
    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'mastercard';
    if (num.startsWith('3')) return 'amex';
    return 'generic';
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Save booking confirmation
      const bookingConfirmation = {
        bookingId: 'BK' + Date.now(),
        hotel: hotel,
        bookingData: bookingData,
        paymentMethod: paymentMethod,
        totalAmount: finalTotal,
        paymentStatus: 'confirmed',
        bookingDate: new Date().toISOString()
      };
      
      sessionStorage.setItem('bookingConfirmation', JSON.stringify(bookingConfirmation));
      sessionStorage.removeItem('bookingData');
      
      onComplete();
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Secure Payment</h2>
        <p className="text-gray-600">Your payment information is encrypted and secure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Selection */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-4">Payment Method</h4>
            <div className="space-y-3">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3" />
                    <span className="font-medium">Credit or Debit Card</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                    <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                    <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3 bg-blue-600 rounded"></div>
                  <span className="font-medium">PayPal</span>
                </div>
              </div>

              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'apple' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('apple')}
              >
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3 bg-gray-800 rounded"></div>
                  <span className="font-medium">Apple Pay</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Details Form */}
          {paymentMethod === 'card' && (
            <form onSubmit={handlePaymentSubmit} className="bg-gray-50 rounded-2xl p-6">
              <h4 className="text-lg font-semibold mb-4">Card Information</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <div className="relative">
                    <Input
                      type="text"
                      required
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 1234 1234 1234"
                      className="w-full pr-12"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getCardType(cardData.cardNumber) === 'visa' && (
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                      )}
                      {getCardType(cardData.cardNumber) === 'mastercard' && (
                        <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <Input
                      type="text"
                      required
                      value={cardData.expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <Input
                      type="text"
                      required
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="123"
                      maxLength="4"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                  <Input
                    type="text"
                    required
                    value={cardData.cardName}
                    onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Billing Address</label>
                  <Input
                    type="text"
                    required
                    value={cardData.billingAddress}
                    onChange={(e) => setCardData({ ...cardData, billingAddress: e.target.value })}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input
                      type="text"
                      required
                      value={cardData.city}
                      onChange={(e) => setCardData({ ...cardData, city: e.target.value })}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <Input
                      type="text"
                      required
                      value={cardData.zipCode}
                      onChange={(e) => setCardData({ ...cardData, zipCode: e.target.value })}
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Your payment is protected</span>
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    SSL encrypted connection
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    PCI DSS compliant
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Alternative Payment Methods */}
          {paymentMethod !== 'card' && (
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {paymentMethod === 'paypal' && 'PayPal Payment'}
                  {paymentMethod === 'apple' && 'Apple Pay'}
                </h3>
                <p className="text-gray-600 mb-6">
                  You will be redirected to complete your payment securely
                </p>
                <Button
                  onClick={handlePaymentSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay with ${paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'}`
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sticky top-4">
            <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
            
            {/* Hotel Info */}
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h5 className="font-semibold">{hotel.name}</h5>
                <p className="text-sm text-gray-600">{hotel.location}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>${hotel.price} × {bookingData.nights} night{bookingData.nights !== 1 ? 's' : ''}</span>
                <span>${hotel.price * bookingData.nights}</span>
              </div>
              
              {bookingData.rooms > 1 && (
                <div className="flex justify-between">
                  <span>× {bookingData.rooms} room{bookingData.rooms !== 1 ? 's' : ''}</span>
                  <span>${bookingData.totalPrice}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Taxes & fees</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Button */}
            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <Button
                  type="submit"
                  form="payment-form"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                  disabled={isProcessing}
                  onClick={handlePaymentSubmit}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay ${finalTotal.toFixed(2)}
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                  disabled={isProcessing}
                >
                  Back to Summary
                </Button>
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center text-green-700">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">Free cancellation until 24 hours before check-in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPayment;