import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star, 
  MapPin, 
  DollarSign,
  Loader2,
  Hotel,
  Image,
  Save,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { adminApi } from '../config/api';
import api from '../services/api';

const { hotelAPI } = api;

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
      setError('');

      // Fetch from real database via public API
      const response = await hotelAPI.getAllHotels({ 
        page: currentPage, 
        limit: 10, 
        search: searchTerm 
      });

      if (response.success && response.data?.hotels) {
        setHotels(response.data.hotels);
      } else {
        setError('Failed to load hotels');
      }
    } catch (err) {
      console.error('Fetch hotels error:', err);
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
        ? adminApi.hotels(editingHotel._id)
        : adminApi.hotels();
      
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
        adminApi.hotels(hotelId),
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
          <div className="loading-spinner"></div>
          <p>Loading hotels...</p>
        </div>
      </div>
    );
  }

  if (loading && hotels.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hotel className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Hotel Management</h2>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Hotel
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError('')}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search hotels by name, city, or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Hotel Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card text-card-foreground border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold">
                {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hotel Name *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter hotel name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Price *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      name="pricing.basePrice"
                      value={formData.pricing.basePrice}
                      onChange={handleInputChange}
                      required
                      placeholder="Price per night"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City *</label>
                  <Input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    required
                    placeholder="City"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">State *</label>
                  <Input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    required
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Hotel description"
                  rows="3"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="url"
                    value={formData.images[0]?.url || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      images: [{ url: e.target.value, alt: formData.name }]
                    }))}
                    placeholder="Hotel image URL"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      name="rating.overall"
                      value={formData.rating.overall}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="0.0 - 5.0"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Featured Hotel
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amenities</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <div key={index} className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm">
                        <span>{amenity.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAmenity(index)}
                          className="h-auto p-0 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={addAmenity} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Amenity
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingHotel ? 'Update Hotel' : 'Save Hotel'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="bg-card text-card-foreground border border-border rounded-lg overflow-hidden">
            <div className="relative h-48">
              <img 
                src={hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'} 
                alt={hotel.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';
                }}
              />
              {hotel.featured && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                  Featured
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{hotel.location?.city}, {hotel.location?.state}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>${hotel.pricing?.basePrice || 0}/night</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>{hotel.rating?.overall || 0} ({hotel.rating?.reviewCount || 0} reviews)</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    hotel.status === 'active' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {hotel.status}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border p-4 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEdit(hotel)}
                className="flex-1"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDelete(hotel._id)}
                className="flex-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {hotels.length === 0 && !loading && (
        <div className="text-center py-12">
          <Hotel className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
          <p className="text-muted-foreground mb-4">Start by adding your first hotel</p>
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Hotel
          </Button>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;