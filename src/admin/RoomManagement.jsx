import React, { useState, useEffect } from 'react';
import './RoomManagement.css';

const RoomManagement = () => {
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
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://ai-hotel-booking-backend.vercel.app/api/admin/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError('Failed to load rooms: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://ai-hotel-booking-backend.vercel.app/api/admin/hotels', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      }
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
    }
  };

  const handleSaveRoom = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const roomData = {
        ...formData,
        pricePerNight: parseFloat(formData.pricePerNight),
        maxOccupancy: parseInt(formData.maxOccupancy),
        size: parseInt(formData.size)
      };

      const url = editingRoom 
        ? `https://ai-hotel-booking-backend.vercel.app/api/admin/rooms/${editingRoom.id}`
        : 'https://ai-hotel-booking-backend.vercel.app/api/admin/rooms';
      
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
      
      const response = await fetch(`https://ai-hotel-booking-backend.vercel.app/api/admin/rooms/${roomId}`, {
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
      name: room.name,
      type: room.type,
      pricePerNight: room.pricePerNight.toString(),
      maxOccupancy: room.maxOccupancy.toString(),
      size: room.size.toString(),
      amenities: room.amenities || [],
      images: room.images || [],
      availability: room.availability,
      hotelId: room.hotelId,
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
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getHotelName(room.hotelId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHotel = !selectedHotel || room.hotelId === selectedHotel;
    
    return matchesSearch && matchesHotel;
  });

  if (loading && rooms.length === 0) {
    return (
      <div className="room-management">
        <div className="loading-container">
          <div className="loading-spinner">🏨</div>
          <p>Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-management">
      <div className="management-header">
        <h2>🛏️ Room Management</h2>
        <button className="add-button" onClick={openAddModal}>
          + Add New Room
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button className="close-error" onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="filters-bar">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search rooms by name, type, or hotel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hotel-filter">
          <select
            className="hotel-select"
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
          >
            <option value="">All Hotels</option>
            {hotels.map(hotel => (
              <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rooms-grid">
        {filteredRooms.length === 0 ? (
          <div className="empty-state">
            <h3>No rooms found</h3>
            <p>Start by adding your first room or adjust your search filters.</p>
            <button className="add-button" onClick={openAddModal}>
              + Add First Room
            </button>
          </div>
        ) : (
          filteredRooms.map(room => (
            <div key={room.id} className="room-card">
              <div className="room-image">
                {room.images && room.images.length > 0 ? (
                  <img src={room.images[0]} alt={room.name} />
                ) : (
                  <div className="no-image">🛏️</div>
                )}
                <div className={`availability-badge ${room.availability}`}>
                  {room.availability === 'available' ? '✅ Available' : '❌ Booked'}
                </div>
              </div>
              
              <div className="room-content">
                <h3>{room.name}</h3>
                <p className="room-type">{room.type}</p>
                <p className="room-hotel">🏨 {getHotelName(room.hotelId)}</p>
                <p className="room-price">${room.pricePerNight}/night</p>
                <p className="room-occupancy">👥 Max {room.maxOccupancy} guests</p>
                <p className="room-size">📐 {room.size} sq ft</p>
                
                {room.amenities && room.amenities.length > 0 && (
                  <div className="room-amenities">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="amenity-tag">+{room.amenities.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="room-actions">
                <button className="edit-button" onClick={() => openEditModal(room)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDeleteRoom(room.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="room-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form className="room-form" onSubmit={(e) => { e.preventDefault(); handleSaveRoom(); }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Room Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter room name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Hotel</label>
                  <select
                    value={formData.hotelId}
                    onChange={(e) => setFormData({...formData, hotelId: e.target.value})}
                    required
                  >
                    <option value="">Select a hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Room Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
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