import { useState } from 'react';
import { Star, X, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const ReviewModal = ({ isOpen, onClose, onSubmit, hotelId, hotelName }) => {
  const [formData, setFormData] = useState({
    rating: {
      overall: 5,
      breakdown: {
        cleanliness: 5,
        service: 5,
        location: 5,
        value: 5,
        amenities: 5
      }
    },
    title: '',
    comment: '',
    pros: [''],
    cons: [''],
    stayDetails: {
      roomType: '',
      stayDuration: 1,
      travelType: 'leisure',
      stayMonth: 'October'  // Default to current month
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratingCategories = [
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'service', label: 'Service' },
    { key: 'location', label: 'Location' },
    { key: 'value', label: 'Value for Money' },
    { key: 'amenities', label: 'Amenities' }
  ];

  const travelTypes = [
    { value: 'leisure', label: 'Leisure' },
    { value: 'business', label: 'Business' },
    { value: 'family', label: 'Family' },
    { value: 'couples', label: 'Couples' },
    { value: 'solo', label: 'Solo' },
    { value: 'group', label: 'Group' }
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const StarRating = ({ rating, onRatingChange, size = "w-8 h-8" }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} cursor-pointer transition-colors ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200 hover:fill-yellow-300 hover:text-yellow-300'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  const handleOverallRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating: {
        ...prev.rating,
        overall: rating
      }
    }));
  };

  const handleBreakdownRatingChange = (category, rating) => {
    setFormData(prev => ({
      ...prev,
      rating: {
        ...prev.rating,
        breakdown: {
          ...prev.rating.breakdown,
          [category]: rating
        }
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStayDetailsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      stayDetails: {
        ...prev.stayDetails,
        [field]: value
      }
    }));
  };

  const addItem = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const removeItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateItem = (type, index, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        hotel: hotelId,  // Change hotelId to hotel to match backend schema
        pros: formData.pros.filter(pro => pro.trim()),
        cons: formData.cons.filter(con => con.trim())
      });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Share Your Experience</h2>
            <p className="text-gray-600 mt-1">How was your stay at {hotelName}?</p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Overall Rating */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Overall Rating</h3>
            <div className="flex justify-center mb-2">
              <StarRating 
                rating={formData.rating.overall}
                onRatingChange={handleOverallRatingChange}
                size="w-12 h-12"
              />
            </div>
            <p className="text-gray-600">Click to rate your overall experience</p>
          </div>

          {/* Breakdown Ratings */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Rate Each Aspect</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratingCategories.map((category) => (
                <div key={category.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">{category.label}</span>
                  <StarRating
                    rating={formData.rating.breakdown[category.key]}
                    onRatingChange={(rating) => handleBreakdownRatingChange(category.key, rating)}
                    size="w-6 h-6"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Review Title *
            </label>
            <Input
              type="text"
              placeholder="Summarize your experience in a few words..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              placeholder="Tell us about your experience. What did you love? What could be improved?"
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              required
              rows={5}
              className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-semibold text-gray-700">
                  What did you like?
                </label>
                <Button
                  type="button"
                  onClick={() => addItem('pros')}
                  className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.pros.map((pro, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    type="text"
                    placeholder="Something you enjoyed..."
                    value={pro}
                    onChange={(e) => updateItem('pros', index, e.target.value)}
                    className="flex-1 mr-2 rounded-lg"
                  />
                  {formData.pros.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeItem('pros', index)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Cons */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-semibold text-gray-700">
                  What could be improved?
                </label>
                <Button
                  type="button"
                  onClick={() => addItem('cons')}
                  className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.cons.map((con, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    type="text"
                    placeholder="Something that could be better..."
                    value={con}
                    onChange={(e) => updateItem('cons', index, e.target.value)}
                    className="flex-1 mr-2 rounded-lg"
                  />
                  {formData.cons.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeItem('cons', index)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stay Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Stay Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Deluxe Suite"
                  value={formData.stayDetails.roomType}
                  onChange={(e) => handleStayDetailsChange('roomType', e.target.value)}
                  className="rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stay Duration (nights)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.stayDetails.stayDuration}
                  onChange={(e) => handleStayDetailsChange('stayDuration', parseInt(e.target.value))}
                  className="rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Type
                </label>
                <select
                  value={formData.stayDetails.travelType}
                  onChange={(e) => handleStayDetailsChange('travelType', e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-500"
                >
                  {travelTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month of Stay
                </label>
                <select
                  value={formData.stayDetails.stayMonth}
                  onChange={(e) => handleStayDetailsChange('stayMonth', e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-500"
                  required
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 py-3 text-lg rounded-xl border-2 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-105"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;