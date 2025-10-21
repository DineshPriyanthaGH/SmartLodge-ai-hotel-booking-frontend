import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import './AdminPanel.css';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const savedToken = localStorage.getItem('adminToken');
    const savedAdmin = localStorage.getItem('adminUser');

    if (savedToken && savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setToken(savedToken);
        setAdmin(adminData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved admin data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, adminData) => {
    setToken(token);
    setAdmin(adminData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setToken(null);
    setAdmin(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {!isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <AdminDashboard 
          token={token} 
          admin={admin} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default AdminPanel;