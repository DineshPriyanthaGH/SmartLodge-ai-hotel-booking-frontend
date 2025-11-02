import React, { useState } from 'react';
import { Lock, User, Hotel, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { adminApi } from '../config/api';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card text-card-foreground rounded-xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-foreground/20 p-3 rounded-full">
                <Hotel className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">SmartLodge Admin</h1>
            <p className="text-primary-foreground/80">Access the administrative panel</p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Enter admin username"
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter admin password"
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading || !credentials.username || !credentials.password}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Login
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-muted/30 px-6 py-4 text-center border-t border-border">
            <p className="text-sm text-muted-foreground">SmartLodge Admin Panel v2.0</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Secure access required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;