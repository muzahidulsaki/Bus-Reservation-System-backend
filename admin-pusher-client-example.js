// Admin Pusher Client Integration Example for Bus Reservation System
// This file shows how to integrate Pusher in admin frontend (React/Next.js)

import Pusher from 'pusher-js';

class AdminPusherClient {
  constructor(adminId) {
    this.adminId = adminId;
    this.pusher = null;
    this.channels = {};
    this.initializePusher();
  }

  async initializePusher() {
    try {
      // Get Pusher config from backend
      const response = await fetch('/pusher/config');
      const config = await response.json();

      this.pusher = new Pusher(config.key, {
        cluster: config.cluster,
        encrypted: true,
        authEndpoint: '/pusher/auth', // For private channels if needed
      });

      // Subscribe to admin-specific channels
      this.subscribeToAdminChannels();
      
      console.log('✅ Admin Pusher client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Admin Pusher:', error);
    }
  }

  subscribeToAdminChannels() {
    // 1. Admin notifications channel (all admins)
    this.channels.adminNotifications = this.pusher.subscribe('admin-notifications');
    this.channels.adminNotifications.bind('notification', (data) => {
      this.handleAdminNotification(data);
    });

    // 2. Personal admin dashboard channel
    this.channels.personalDashboard = this.pusher.subscribe(`admin-dashboard-${this.adminId}`);
    this.channels.personalDashboard.bind('dashboard-update', (data) => {
      this.handleDashboardUpdate(data);
    });

    // 3. System notifications channel
    this.channels.system = this.pusher.subscribe('system');
    this.channels.system.bind('notification', (data) => {
      this.handleSystemNotification(data);
    });

    // 4. All admin dashboards channel (for broadcast updates)
    this.channels.allDashboards = this.pusher.subscribe('admin-dashboards');
    this.channels.allDashboards.bind('stats-update', (data) => {
      this.handleStatsUpdate(data);
    });

    // 5. User activity monitoring
    this.channels.users = this.pusher.subscribe('users');
    this.channels.users.bind('user-registered', (data) => {
      this.handleNewUserRegistration(data);
    });

    // 6. Booking activity monitoring
    this.channels.bookings = this.pusher.subscribe('bookings');
    this.channels.bookings.bind('booking-created', (data) => {
      this.handleNewBooking(data);
    });
    this.channels.bookings.bind('booking-cancelled', (data) => {
      this.handleBookingCancellation(data);
    });
  }

  // Event Handlers
  handleAdminNotification(data) {
    console.log('🔔 Admin notification:', data);
    
    // Display notification in admin UI
    this.showNotification({
      title: 'Admin Notification',
      message: data.message,
      type: 'info',
      data: data.data,
      timestamp: data.timestamp,
    });

    // Update notification counter
    this.updateNotificationCounter();
  }

  handleDashboardUpdate(data) {
    console.log('📊 Dashboard update:', data);
    
    // Update dashboard stats in real-time
    this.updateDashboardStats(data.data);
  }

  handleSystemNotification(data) {
    console.log('🚨 System notification:', data);
    
    const notificationType = data.type === 'error' ? 'error' : 
                           data.type === 'warning' ? 'warning' : 'info';
    
    this.showNotification({
      title: 'System Alert',
      message: data.message,
      type: notificationType,
      timestamp: data.timestamp,
    });
  }

  handleStatsUpdate(data) {
    console.log('📈 Stats update:', data);
    
    // Update global dashboard statistics
    this.updateDashboardStats(data.data);
  }

  handleNewUserRegistration(data) {
    console.log('👤 New user registered:', data);
    
    // Show real-time user registration notification
    this.showNotification({
      title: 'New User Registration',
      message: `${data.user.fullName} has registered`,
      type: 'success',
      timestamp: data.timestamp,
      action: {
        label: 'View User',
        onClick: () => this.navigateToUser(data.user.id)
      }
    });

    // Update user count in dashboard
    this.incrementUserCount();
  }

  handleNewBooking(data) {
    console.log('🎫 New booking:', data);
    
    this.showNotification({
      title: 'New Booking',
      message: `${data.booking.userName} made a booking`,
      type: 'info',
      timestamp: data.timestamp,
      action: {
        label: 'View Booking',
        onClick: () => this.navigateToBooking(data.booking.id)
      }
    });

    // Update booking count
    this.incrementBookingCount();
  }

  handleBookingCancellation(data) {
    console.log('❌ Booking cancelled:', data);
    
    this.showNotification({
      title: 'Booking Cancelled',
      message: `Booking by ${data.booking.userName} was cancelled`,
      type: 'warning',
      timestamp: data.timestamp,
    });
  }

  // Admin Action Methods
  async broadcastToAllAdmins(message, data = {}) {
    try {
      const response = await fetch('/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, data }),
      });

      if (response.ok) {
        console.log('✅ Broadcast sent successfully');
        return await response.json();
      }
    } catch (error) {
      console.error('❌ Failed to send broadcast:', error);
    }
  }

  async testAdminPusher() {
    try {
      const response = await fetch('/admin/test-admin-pusher', {
        method: 'POST',
      });

      if (response.ok) {
        console.log('✅ Admin Pusher test completed');
        return await response.json();
      }
    } catch (error) {
      console.error('❌ Admin Pusher test failed:', error);
    }
  }

  async refreshDashboard() {
    try {
      const response = await fetch('/admin/refresh-dashboard', {
        method: 'POST',
      });

      if (response.ok) {
        console.log('✅ Dashboard refresh broadcasted');
        return await response.json();
      }
    } catch (error) {
      console.error('❌ Dashboard refresh failed:', error);
    }
  }

  async notifyUser(userId, message, data = {}) {
    try {
      const response = await fetch(`/admin/user/${userId}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, data }),
      });

      if (response.ok) {
        console.log(`✅ Notification sent to user ${userId}`);
        return await response.json();
      }
    } catch (error) {
      console.error(`❌ Failed to notify user ${userId}:`, error);
    }
  }

  // UI Helper Methods (implement according to your frontend framework)
  showNotification(notification) {
    // Implement your notification UI logic here
    // Example for React with a toast library:
    /*
    toast({
      title: notification.title,
      description: notification.message,
      status: notification.type,
      duration: 5000,
      isClosable: true,
    });
    */
    console.log('📣 Notification:', notification);
  }

  updateDashboardStats(stats) {
    // Update your dashboard UI with new stats
    console.log('📊 Updating dashboard stats:', stats);
    
    // Example: Update React state
    // setDashboardStats(stats);
  }

  updateNotificationCounter() {
    // Increment notification counter in UI
    console.log('🔔 Updating notification counter');
  }

  incrementUserCount() {
    // Increment user count in dashboard
    console.log('👤 Incrementing user count');
  }

  incrementBookingCount() {
    // Increment booking count in dashboard
    console.log('🎫 Incrementing booking count');
  }

  navigateToUser(userId) {
    // Navigate to user details page
    console.log(`👤 Navigating to user ${userId}`);
    // Example: router.push(`/admin/users/${userId}`);
  }

  navigateToBooking(bookingId) {
    // Navigate to booking details page
    console.log(`🎫 Navigating to booking ${bookingId}`);
    // Example: router.push(`/admin/bookings/${bookingId}`);
  }

  // Cleanup
  disconnect() {
    if (this.pusher) {
      this.pusher.disconnect();
      console.log('📡 Admin Pusher client disconnected');
    }
  }
}

// Usage Example in React Component:
/*
import { useEffect, useState } from 'react';

function AdminDashboard() {
  const [pusherClient, setPusherClient] = useState(null);
  const adminId = getCurrentAdminId(); // Get from auth context

  useEffect(() => {
    const client = new AdminPusherClient(adminId);
    setPusherClient(client);

    return () => {
      client.disconnect();
    };
  }, [adminId]);

  const handleBroadcast = async () => {
    if (pusherClient) {
      await pusherClient.broadcastToAllAdmins(
        'Important announcement for all admins',
        { priority: 'high', category: 'system' }
      );
    }
  };

  const handleTestPusher = async () => {
    if (pusherClient) {
      await pusherClient.testAdminPusher();
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleBroadcast}>Broadcast to All Admins</button>
      <button onClick={handleTestPusher}>Test Pusher</button>
      <button onClick={() => pusherClient?.refreshDashboard()}>
        Refresh Dashboard
      </button>
    </div>
  );
}
*/

export default AdminPusherClient;