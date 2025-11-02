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
  Bed,
  Users,
  Wifi,
  Save,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { adminApi } from '../config/api';

const RoomManagement = ({ token }) => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    pricePerNight: '',
    maxOccupancy: '',
    size: '',
    amenities: [],
    images: [],
    availability: 'available',
    hotelId: '',
    description: ''
  });

  const roomTypes = [
    'Standard Room',
    'Deluxe Room',
    'Suite',
    'Presidential Suite',
    'Single Room',
    'Double Room',
    'Twin Room',
    'King Room',
    'Queen Room',
    'Family Room',
    'Connecting Rooms',
    'Executive Room',
    'Penthouse'
  ];

  const commonAmenities = [
    'Air Conditioning',
    'Free WiFi',
    'TV',
    'Mini Bar',
    'Room Service',
    'Safe',
    'Balcony',
    'Ocean View',
    'City View',
    'Mountain View',
    'Jacuzzi',
    'Kitchenette',
    'Workspace',
    'Coffee Maker',
    'Hair Dryer',
    'Iron & Ironing Board',
    'Bathrobe',
    'Slippers',
    'Soundproof',
    'Non-smoking'
  ];

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const fetchRooms = async () => {
    try {
      console.log('🛏️ Fetching rooms with token:', !!token);
      const response = await fetch(adminApi.rooms(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🛏️ Rooms response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch rooms');
      }

      const data = await response.json();
      console.log('🛏️ Rooms data:', data);
      
      if (data.success && data.data) {
        setRooms(data.data.rooms || []);
      } else {
        setRooms([]);
        setError(data.message || 'No rooms found');
      }
    } catch (err) {
      console.error('🚨 Room fetch error:', err);
      setError('Failed to load rooms: ' + err.message);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      console.log('🏨 Fetching hotels for room management...');
      const response = await fetch(adminApi.hotels(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🏨 Hotels data for rooms:', data);
        
        if (data.success && data.data) {
          setHotels(data.data.hotels || []);
        } else {
          setHotels([]);
        }
      } else {
        const errorData = await response.json();
        console.error('🚨 Hotel fetch failed:', errorData);
        setError('Failed to load hotels');
      }
    } catch (err) {
      console.error('🚨 Hotel fetch error for rooms:', err);
      setError('Failed to load hotels: ' + err.message);
    }
  };

  const handleSaveRoom = async () => {
    try {
      setLoading(true);
      
      const roomData = {
        ...formData,
        pricePerNight: parseFloat(formData.pricePerNight),
        maxOccupancy: parseInt(formData.maxOccupancy),
        size: parseInt(formData.size)
      };

      const url = editingRoom 
        ? adminApi.rooms(editingRoom.id)
        : adminApi.rooms();
      
      const method = editingRoom ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(roomData)
      });

      if (!response.ok) {
        throw new Error('Failed to save room');
      }

      await fetchRooms();
      setShowModal(false);
      resetForm();
      setError('');
    } catch (err) {
      setError('Failed to save room: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(adminApi.rooms(roomId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete room');
      }

      await fetchRooms();
      setError('');
    } catch (err) {
      setError('Failed to delete room: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      pricePerNight: '',
      maxOccupancy: '',
      size: '',
      amenities: [],
      images: [],
      availability: 'available',
      hotelId: '',
      description: ''
    });
    setEditingRoom(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || '',
      type: room.type || '',
      pricePerNight: (room.pricePerNight || room.pricing?.basePrice || '').toString(),
      maxOccupancy: (room.maxOccupancy || room.capacity?.adults || '').toString(),
      size: (room.size || '').toString(),
      amenities: room.amenities || [],
      images: room.images || [],
      availability: room.availability || 'available',
      hotelId: room.hotelId || '',
      description: room.description || ''
    });
    setShowModal(true);
  };

  const addAmenity = (amenity) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity]
      });
    }
  };

  const removeAmenity = (amenityToRemove) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(amenity => amenity !== amenityToRemove)
    });
  };

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, url.trim()]
      });
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove)
    });
  };

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h._id === hotelId || h.id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = (room.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getHotelName(room.hotelId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHotel = !selectedHotel || room.hotelId === selectedHotel;
    
    return matchesSearch && matchesHotel;
  });

  if (loading && rooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Room Management</h2>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Room
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded-md flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError('')}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search rooms by name, type, or hotel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-64">
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">All Hotels</option>
            {hotels.map(hotel => (
              <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <Bed className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No rooms found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first room or adjust your search filters.</p>
            <Button onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Room
            </Button>
          </div>
        ) : (
          filteredRooms.map(room => (
            <div key={room.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                {room.images && room.images.length > 0 ? (
                  <img 
                    src={room.images[0]} 
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Bed className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  room.availability === 'available' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {room.availability === 'available' ? 'Available' : 'Booked'}
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">{room.name}</h3>
                  <p className="text-sm text-muted-foreground">{room.type}</p>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Hotel className="h-3 w-3" />
                    {getHotelName(room.hotelId)}
                  </div>
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <DollarSign className="h-3 w-3" />
                    {room.pricePerNight}/night
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    Max {room.maxOccupancy} guests
                  </div>
                  {room.size && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {room.size} sq ft
                    </div>
                  )}
                </div>
                
                {room.amenities && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="px-4 pb-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(room)} className="flex-1">
                  <Edit2 className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteRoom(room.id)} className="flex-1 text-destructive hover:text-destructive">
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveRoom(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Room Name *</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter room name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hotel *</label>
                  <select
                    value={formData.hotelId}
                    onChange={(e) => setFormData({...formData, hotelId: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select a hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Room Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select room type</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({...formData, availability: e.target.value})}
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price per Night ($)</label>
                  <input
                    type="number"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({...formData, pricePerNight: e.target.value})}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max Occupancy</label>
                  <input
                    type="number"
                    value={formData.maxOccupancy}
                    onChange={(e) => setFormData({...formData, maxOccupancy: e.target.value})}
                    placeholder="Enter max guests"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Room Size (sq ft)</label>
                <input
                  type="number"
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  placeholder="Enter room size"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter room description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Amenities</label>
                <div className="amenities-list">
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      {amenity}
                      <button
                        type="button"
                        className="remove-amenity"
                        onClick={() => removeAmenity(amenity)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <select
                    className="add-amenity"
                    onChange={(e) => {
                      if (e.target.value) {
                        addAmenity(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">Add amenity</option>
                    {commonAmenities
                      .filter(amenity => !formData.amenities.includes(amenity))
                      .map(amenity => (
                        <option key={amenity} value={amenity}>{amenity}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Images</label>
                <div className="images-list">
                  {formData.images.map((image, index) => (
                    <div key={index} className="image-item">
                      <img src={image} alt={`Room ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-image" onClick={addImage}>
                    + Add Image URL
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={loading || !formData.name || !formData.hotelId || !formData.type}
                >
                  {loading ? 'Saving...' : editingRoom ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;