import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Hotel, 
  Bed, 
  Calendar, 
  DollarSign, 
  Users, 
  LogOut, 
  RefreshCw,
  Activity,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import HotelManagement from './HotelManagement';
import RoomManagement from './RoomManagement';
import BookingManagement from './BookingManagement';
import { adminApi } from '../config/api';
import { cleanAdminApi } from '../config/api-clean';
import api from '../services/api';

const { hotelAPI, bookingAPI } = api;

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
      setError('');

      // Fetch real data from database via public API
      const [hotelsResponse, bookingsResponse] = await Promise.allSettled([
        hotelAPI.getAllHotels(),
        // For now, we'll simulate bookings data until we have a proper bookings endpoint
        Promise.resolve({ success: true, data: { bookings: [] } })
      ]);

      const hotels = hotelsResponse.status === 'fulfilled' && hotelsResponse.value?.success 
        ? hotelsResponse.value.data?.hotels || []
        : [];

      const bookings = bookingsResponse.status === 'fulfilled' && bookingsResponse.value?.success
        ? bookingsResponse.value.data?.bookings || []
        : [];

      // Calculate statistics
      const totalRevenue = bookings.reduce((sum, booking) => {
        return sum + (booking.totalAmount || 0);
      }, 0);

      const totalRooms = hotels.reduce((sum, hotel) => {
        return sum + (hotel.roomTypes?.length || 3); // Estimate 3 rooms per hotel if not specified
      }, 0);

      const dashboardStats = {
        hotels: hotels.length,
        rooms: totalRooms,
        bookings: bookings.length,
        revenue: totalRevenue,
        recentActivity: bookings.slice(-5).reverse(), // Last 5 bookings
        occupancyRate: bookings.length > 0 ? Math.round((bookings.length / totalRooms) * 100) : 0,
        lastUpdated: new Date().toISOString()
      };

      setStats(dashboardStats);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data. Please try again.');
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
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-lg mb-4">
              {error}
            </div>
            <Button onClick={fetchDashboardStats} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Hotels Card */}
          <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hotels</p>
                <p className="text-3xl font-bold">{stats?.hotels || 0}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Hotel className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">Active Properties</span>
            </div>
          </div>

          {/* Rooms Card */}
          <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
                <p className="text-3xl font-bold">{stats?.rooms || 0}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Bed className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{stats?.occupancyRate || 0}% Occupancy</span>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-3xl font-bold">{stats?.bookings || 0}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Confirmed Bookings</span>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">${stats?.revenue?.toLocaleString() || '0'}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Earnings</span>
            </div>
          </div>
        </div>

        {/* System Overview & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Overview */}
          <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">System Overview</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Total Hotels</span>
                <span className="font-semibold">{stats?.hotels || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Total Rooms</span>
                <span className="font-semibold">{stats?.rooms || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Active Bookings</span>
                <span className="font-semibold">{stats?.bookings || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Occupancy Rate</span>
                <span className="font-semibold text-primary">{stats?.occupancyRate || 0}%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveSection('hotels')}
              >
                <Hotel className="mr-2 h-4 w-4" />
                Manage Hotels
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveSection('rooms')}
              >
                <Bed className="mr-2 h-4 w-4" />
                Manage Rooms
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveSection('bookings')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Manage Bookings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={fetchDashboardStats}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card text-card-foreground border-b border-border shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Hotel className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SmartLodge Admin</h1>
                <span className="text-sm text-muted-foreground">Administrator Panel</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex gap-2">
            <Button 
              variant={activeSection === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('dashboard')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={activeSection === 'hotels' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('hotels')}
              className="flex items-center gap-2"
            >
              <Hotel className="h-4 w-4" />
              Hotels
            </Button>
            <Button 
              variant={activeSection === 'rooms' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('rooms')}
              className="flex items-center gap-2"
            >
              <Bed className="h-4 w-4" />
              Rooms
            </Button>
            <Button 
              variant={activeSection === 'bookings' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('bookings')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Bookings
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1">
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;