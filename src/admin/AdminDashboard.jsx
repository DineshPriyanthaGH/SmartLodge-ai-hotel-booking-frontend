import React, { useState, useEffect } from 'react';
import HotelManagement from './HotelManagement';
import RoomManagement from './RoomManagement';
import BookingManagement from './BookingManagement';
import LoadingSpinner from './components/LoadingSpinner';
import { adminApi } from '../config/api';
import { cleanAdminApi } from '../config/api-clean';
import './AdminDashboard.css';

const AdminDashboard = ({ token, onLogout }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    if (activeSection === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeSection]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(adminApi.dashboard(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setStats(data);
      } else {
        setError(data.message || 'Failed to load dashboard');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    onLogout();
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'hotels':
        return <HotelManagement token={token} />;
      case 'rooms':
        return <RoomManagement token={token} />;
      case 'bookings':
        return <BookingManagement token={token} />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => {
    if (loading) {
      return <LoadingSpinner message="Loading dashboard..." />;
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-message">
            {error}
          </div>
          <button onClick={fetchDashboardStats} className="retry-button">
            Retry
          </button>
        </div>
      );
    }

    return (
      <main className="admin-main">
        <div className="stats-grid">
          <div className="stat-card hotels">
            <div className="stat-icon">HTL</div>
            <div className="stat-content">
              <h3>Hotels</h3>
              <div className="stat-number">{stats?.hotels || 0}</div>
              <div className="stat-details">
                <span className="stat-detail good">Active Properties</span>
                <span className="stat-detail neutral">Manage Hotels</span>
              </div>
            </div>
          </div>

          <div className="stat-card rooms">
            <div className="stat-icon">RM</div>
            <div className="stat-content">
              <h3>Rooms</h3>
              <div className="stat-number">{stats?.rooms || 0}</div>
              <div className="stat-details">
                <span className="stat-detail good">Available Rooms</span>
                <span className="stat-detail warning">Booked Rooms</span>
              </div>
            </div>
          </div>

          <div className="stat-card bookings">
            <div className="stat-icon">BK</div>
            <div className="stat-content">
              <h3>Bookings</h3>
              <div className="stat-number">{stats?.bookings || 0}</div>
              <div className="stat-details">
                <span className="stat-detail good">Confirmed</span>
                <span className="stat-detail info">Recent</span>
              </div>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">$</div>
            <div className="stat-content">
              <h3>Revenue</h3>
              <div className="stat-number">${stats?.revenue?.toLocaleString() || '0'}</div>
              <div className="stat-details">
                <span className="stat-detail good">Total Revenue</span>
                <span className="stat-detail warning">Monthly Target</span>
              </div>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-card">
            <h3>System Overview</h3>
            <div className="overview-stats">
              <div className="overview-item">
                <span className="overview-label">Total Hotels:</span>
                <span className="overview-value">{stats?.hotels || 0}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Total Rooms:</span>
                <span className="overview-value">{stats?.rooms || 0}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Total Bookings:</span>
                <span className="overview-value">{stats?.bookings || 0}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Total Revenue:</span>
                <span className="overview-value">${stats?.revenue?.toLocaleString() || '0'}</span>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button 
                className="quick-action-btn"
                onClick={() => setActiveSection('hotels')}
              >
                Manage Hotels
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => setActiveSection('rooms')}
              >
                Manage Rooms
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => setActiveSection('bookings')}
              >
                Manage Bookings
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <h1>SmartLodge Admin</h1>
          <span className="admin-badge">Administrator</span>
        </div>
        <div className="header-right">
          <span className="last-updated">
            Last updated: {new Date().toLocaleString()}
          </span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <button 
          className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveSection('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-item ${activeSection === 'hotels' ? 'active' : ''}`}
          onClick={() => setActiveSection('hotels')}
        >
          Hotels
        </button>
        <button 
          className={`nav-item ${activeSection === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveSection('rooms')}
        >
          Rooms
        </button>
        <button 
          className={`nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveSection('bookings')}
        >
          Bookings
        </button>
      </nav>

      {renderActiveSection()}
    </div>
  );
};

export default AdminDashboard;