import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ token, onLogout }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('https://smart-lodge-ai-hotel-booking-backen-dusky.vercel.app/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
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

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner">🔄</div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <div className="error-message">
            ⚠️ {error}
          </div>
          <button onClick={fetchDashboardStats} className="retry-button">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <h1>🏨 SmartLodge Admin</h1>
          <span className="admin-badge">Administrator</span>
        </div>
        <div className="header-right">
          <span className="last-updated">
            Last updated: {new Date(stats?.lastUpdated).toLocaleString()}
          </span>
          <button onClick={handleLogout} className="logout-button">
            🚪 Logout
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <button className="nav-item active">📊 Dashboard</button>
        <button className="nav-item">🏨 Hotels</button>
        <button className="nav-item">🛏️ Rooms</button>
        <button className="nav-item">📅 Bookings</button>
      </nav>

      <main className="admin-main">
        <div className="stats-grid">
          <div className="stat-card hotels">
            <div className="stat-icon">🏨</div>
            <div className="stat-content">
              <h3>Hotels</h3>
              <div className="stat-number">{stats?.summary.hotels.total}</div>
              <div className="stat-details">
                <span className="stat-detail good">✅ {stats?.summary.hotels.active} Active</span>
                <span className="stat-detail neutral">⏸️ {stats?.summary.hotels.inactive} Inactive</span>
              </div>
            </div>
          </div>

          <div className="stat-card rooms">
            <div className="stat-icon">🛏️</div>
            <div className="stat-content">
              <h3>Rooms</h3>
              <div className="stat-number">{stats?.summary.rooms.total}</div>
              <div className="stat-details">
                <span className="stat-detail good">✅ {stats?.summary.rooms.available} Available</span>
                <span className="stat-detail warning">🔒 {stats?.summary.rooms.occupied} Occupied</span>
              </div>
            </div>
          </div>

          <div className="stat-card bookings">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Bookings</h3>
              <div className="stat-number">{stats?.summary.bookings.total}</div>
              <div className="stat-details">
                <span className="stat-detail good">✅ {stats?.summary.bookings.confirmed} Confirmed</span>
                <span className="stat-detail info">🆕 {stats?.summary.bookings.recent} This week</span>
              </div>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Revenue</h3>
              <div className="stat-number">${stats?.summary.revenue.total?.toLocaleString()}</div>
              <div className="stat-details">
                <span className="stat-detail good">✅ Paid</span>
                <span className="stat-detail warning">⏳ ${stats?.summary.revenue.pending?.toLocaleString()} Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-card">
            <h3>📈 Monthly Revenue Trend</h3>
            <div className="revenue-chart">
              {stats?.analytics.monthlyRevenue?.map((month, index) => (
                <div key={index} className="month-bar">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${(month.revenue / Math.max(...stats.analytics.monthlyRevenue.map(m => m.revenue))) * 100}%` 
                    }}
                  ></div>
                  <span className="month-label">{month.month}</span>
                  <span className="month-value">${month.revenue?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>🏆 Top Performing Hotels</h3>
            <div className="top-hotels">
              {stats?.analytics.topHotels?.map((item, index) => (
                <div key={index} className="hotel-item">
                  <div className="hotel-rank">#{index + 1}</div>
                  <div className="hotel-info">
                    <div className="hotel-name">{item.hotel?.name}</div>
                    <div className="hotel-location">{item.hotel?.location?.city}, {item.hotel?.location?.state}</div>
                  </div>
                  <div className="hotel-stats">
                    <div className="booking-count">📅 {item.bookings} bookings</div>
                    <div className="revenue-amount">💰 ${item.revenue?.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;