import React, { useState } from 'react';
import { adminApi } from '../config/api';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Admin login attempt:', { username: credentials.username });
      console.log('🌐 Login URL:', adminApi.login());
      
      const response = await fetch(adminApi.login(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      console.log('📡 Login response status:', response.status);
      const data = await response.json();
      console.log('📋 Login response data:', data);

      if (data.success) {
        console.log('✅ Login successful, storing token...');
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.admin));
        onLogin(data.data.token, data.data.admin);
      } else {
        console.error('❌ Login failed:', data.message);
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('🚨 Login network error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>🏨 SmartLodge Admin</h1>
          <p>Access the administrative panel</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter admin username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading || !credentials.username || !credentials.password}
          >
            {loading ? '🔄 Logging in...' : '🔐 Login'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>SmartLodge Admin Panel v2.0</p>
          <small>Secure access required</small>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;