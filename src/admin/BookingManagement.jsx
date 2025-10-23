import React, { useState, useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import { adminApi } from '../config/api';
import './BookingManagement.css';

const BookingManagement = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    hotelId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    guests: '',
    totalPrice: '',
    status: 'confirmed',
    paymentStatus: 'pending',
    specialRequests: ''
  });

  const bookingStatuses = ['confirmed', 'cancelled', 'completed', 'no-show'];
  const paymentStatuses = ['pending', 'paid', 'refunded', 'failed'];

  useEffect(() => {
    fetchBookings();
    fetchHotels();
    fetchRooms();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(adminApi.bookings(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(adminApi.hotels(), {
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

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(adminApi.rooms(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  };

  const handleSaveBooking = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const bookingData = {
        ...formData,
        guests: parseInt(formData.guests),
        totalPrice: parseFloat(formData.totalPrice)
      };

      const url = editingBooking 
        ? adminApi.bookings(editingBooking.id)
        : adminApi.bookings();
      
      const method = editingBooking ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Failed to save booking');
      }

      await fetchBookings();
      setShowModal(false);
      resetForm();
      setError('');
    } catch (err) {
      setError('Failed to save booking: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(adminApi.bookings(bookingId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      await fetchBookings();
      setError('');
    } catch (err) {
      setError('Failed to delete booking: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      hotelId: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      guests: '',
      totalPrice: '',
      status: 'confirmed',
      paymentStatus: 'pending',
      specialRequests: ''
    });
    setEditingBooking(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (booking) => {
    setEditingBooking(booking);
    setFormData({
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone || '',
      hotelId: booking.hotelId,
      roomId: booking.roomId,
      checkInDate: booking.checkInDate.split('T')[0],
      checkOutDate: booking.checkOutDate.split('T')[0],
      guests: booking.guests.toString(),
      totalPrice: booking.totalPrice.toString(),
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      specialRequests: booking.specialRequests || ''
    });
    setShowModal(true);
  };

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Unknown Room';
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getAvailableRooms = () => {
    if (!formData.hotelId) return [];
    return rooms.filter(room => room.hotelId === formData.hotelId);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getHotelName(booking.hotelId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getRoomName(booking.roomId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading && bookings.length === 0) {
    return (
      <div className="booking-management">
        <LoadingSpinner message="Loading bookings..." />
      </div>
    );
  }

  return (
    <div className="booking-management">
      <div className="management-header">
        <h2>Booking Management</h2>
        <button className="add-button" onClick={openAddModal}>
          + Add New Booking
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
            placeholder="Search by guest name, email, hotel, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filter">
          <select
            className="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {bookingStatuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bookings-table">
        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <h3>No bookings found</h3>
            <p>Start by adding your first booking or adjust your search filters.</p>
            <button className="add-button" onClick={openAddModal}>
              + Add First Booking
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Hotel & Room</th>
                  <th>Dates</th>
                  <th>Guests</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>
                      <div className="guest-info">
                        <div className="guest-name">{booking.guestName}</div>
                        <div className="guest-email">{booking.guestEmail}</div>
                        {booking.guestPhone && (
                          <div className="guest-phone">{booking.guestPhone}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="booking-location">
                        <div className="hotel-name">🏨 {getHotelName(booking.hotelId)}</div>
                        <div className="room-name">🛏️ {getRoomName(booking.roomId)}</div>
                      </div>
                    </td>
                    <td>
                      <div className="booking-dates">
                        <div className="check-in">📅 {formatDate(booking.checkInDate)}</div>
                        <div className="check-out">📅 {formatDate(booking.checkOutDate)}</div>
                        <div className="nights">({calculateNights(booking.checkInDate, booking.checkOutDate)} nights)</div>
                      </div>
                    </td>
                    <td>
                      <div className="guest-count">👥 {booking.guests}</div>
                    </td>
                    <td>
                      <div className="total-price">${booking.totalPrice}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`payment-badge ${booking.paymentStatus}`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="booking-actions">
                        <button className="edit-button" onClick={() => openEditModal(booking)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => handleDeleteBooking(booking.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="booking-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBooking ? 'Edit Booking' : 'Add New Booking'}</h3>
              <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form className="booking-form" onSubmit={(e) => { e.preventDefault(); handleSaveBooking(); }}>
              <div className="form-section">
                <h4>Guest Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Guest Name</label>
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                      placeholder="Enter guest name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone (Optional)</label>
                  <input
                    type="tel"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>Booking Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hotel</label>
                    <select
                      value={formData.hotelId}
                      onChange={(e) => setFormData({...formData, hotelId: e.target.value, roomId: ''})}
                      required
                    >
                      <option value="">Select a hotel</option>
                      {hotels.map(hotel => (
                        <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Room</label>
                    <select
                      value={formData.roomId}
                      onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                      required
                      disabled={!formData.hotelId}
                    >
                      <option value="">Select a room</option>
                      {getAvailableRooms().map(room => (
                        <option key={room.id} value={room.id}>
                          {room.name} - ${room.pricePerNight}/night
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Check-in Date</label>
                    <input
                      type="date"
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({...formData, checkInDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Check-out Date</label>
                    <input
                      type="date"
                      value={formData.checkOutDate}
                      onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})}
                      required
                      min={formData.checkInDate}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Number of Guests</label>
                    <input
                      type="number"
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: e.target.value})}
                      placeholder="Enter number of guests"
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Price ($)</label>
                    <input
                      type="number"
                      value={formData.totalPrice}
                      onChange={(e) => setFormData({...formData, totalPrice: e.target.value})}
                      placeholder="Enter total price"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Status & Payment</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Booking Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      {bookingStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Payment Status</label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}
                    >
                      {paymentStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Special Requests (Optional)</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  placeholder="Enter any special requests or notes"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={loading || !formData.guestName || !formData.guestEmail || !formData.hotelId || !formData.roomId}
                >
                  {loading ? 'Saving...' : editingBooking ? 'Update Booking' : 'Add Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;