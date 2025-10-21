import React, { useState, useEffect } from 'react';
import './HotelManagement.css';

const HotelManagement = ({ token }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    location: {
      city: '',
      state: '',
      country: 'USA',
      address: '',
      zipCode: ''
    },
    rating: {
      overall: 0,
      reviewCount: 0
    },
    pricing: {
      basePrice: 0,
      currency: 'USD'
    },
    images: [{
      url: '',
      alt: ''
    }],
    amenities: [],
    description: '',
    featured: false,
    status: 'active'
  });

  useEffect(() => {
    fetchHotels();
  }, [currentPage, searchTerm]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://smart-lodge-ai-hotel-booking-backen-dusky.vercel.app/admin/hotels?page=${currentPage}&limit=10&search=${searchTerm}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        setHotels(data.data.hotels);
      } else {
        setError(data.message || 'Failed to load hotels');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingHotel 
        ? `https://smart-lodge-ai-hotel-booking-backen-dusky.vercel.app/admin/hotels/${editingHotel._id}`
        : 'https://smart-lodge-ai-hotel-booking-backen-dusky.vercel.app/admin/hotels';
      
      const method = editingHotel ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        fetchHotels();
        resetForm();
        setShowForm(false);
      } else {
        setError(data.message || 'Failed to save hotel');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hotelId) => {
    if (!confirm('Are you sure you want to delete this hotel? This will also delete all associated rooms and bookings.')) {
      return;
    }

    try {
      const response = await fetch(
        `https://smart-lodge-ai-hotel-booking-backen-dusky.vercel.app/admin/hotels/${hotelId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchHotels();
      } else {
        setError(data.message || 'Failed to delete hotel');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      rating: hotel.rating,
      pricing: hotel.pricing,
      images: hotel.images,
      amenities: hotel.amenities,
      description: hotel.description,
      featured: hotel.featured,
      status: hotel.status
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingHotel(null);
    setFormData({
      name: '',
      location: {
        city: '',
        state: '',
        country: 'USA',
        address: '',
        zipCode: ''
      },
      rating: {
        overall: 0,
        reviewCount: 0
      },
      pricing: {
        basePrice: 0,
        currency: 'USD'
      },
      images: [{
        url: '',
        alt: ''
      }],
      amenities: [],
      description: '',
      featured: false,
      status: 'active'
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
      }));
    }
  };

  const addAmenity = () => {
    const amenityName = prompt('Enter amenity name:');
    if (amenityName) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, { name: amenityName, icon: 'star' }]
      }));
    }
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  if (loading && hotels.length === 0) {
    return (
      <div className="hotel-management">
        <div className="loading-container">
          <div className="loading-spinner">🔄</div>
          <p>Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hotel-management">
      <div className="management-header">
        <h2>🏨 Hotel Management</h2>
        <button 
          className="add-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          ➕ Add New Hotel
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={() => setError('')} className="close-error">✕</button>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search hotels by name, city, or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="hotel-form-modal">
            <div className="modal-header">
              <h3>{editingHotel ? '✏️ Edit Hotel' : '➕ Add New Hotel'}</h3>
              <button 
                className="close-modal"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="hotel-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Hotel Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter hotel name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Base Price *</label>
                  <input
                    type="number"
                    name="pricing.basePrice"
                    value={formData.pricing.basePrice}
                    onChange={handleInputChange}
                    required
                    placeholder="Price per night"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    required
                    placeholder="City"
                  />
                </div>
                
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    required
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Hotel description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.images[0]?.url || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    images: [{ url: e.target.value, alt: formData.name }]
                  }))}
                  placeholder="Hotel image URL"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating</label>
                  <input
                    type="number"
                    name="rating.overall"
                    value={formData.rating.overall}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0.0 - 5.0"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  Featured Hotel
                </label>
              </div>

              <div className="form-group">
                <label>Amenities</label>
                <div className="amenities-list">
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <span>{amenity.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeAmenity(index)}
                        className="remove-amenity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addAmenity} className="add-amenity">
                    ➕ Add Amenity
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="save-button">
                  {loading ? '💾 Saving...' : (editingHotel ? '💾 Update Hotel' : '💾 Save Hotel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="hotels-grid">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="hotel-card">
            <div className="hotel-image">
              <img 
                src={hotel.images[0]?.url || 'https://via.placeholder.com/300x200'} 
                alt={hotel.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              {hotel.featured && <span className="featured-badge">⭐ Featured</span>}
            </div>
            
            <div className="hotel-content">
              <h3>{hotel.name}</h3>
              <p className="hotel-location">📍 {hotel.location.city}, {hotel.location.state}</p>
              <p className="hotel-price">💰 ${hotel.pricing.basePrice}/night</p>
              <p className="hotel-rating">⭐ {hotel.rating.overall} ({hotel.rating.reviewCount} reviews)</p>
              <span className={`hotel-status ${hotel.status}`}>
                {hotel.status === 'active' ? '✅' : '⏸️'} {hotel.status}
              </span>
            </div>
            
            <div className="hotel-actions">
              <button 
                onClick={() => handleEdit(hotel)}
                className="edit-button"
              >
                ✏️ Edit
              </button>
              <button 
                onClick={() => handleDelete(hotel._id)}
                className="delete-button"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {hotels.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No hotels found</h3>
          <p>Start by adding your first hotel</p>
          <button 
            className="add-button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            ➕ Add New Hotel
          </button>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;