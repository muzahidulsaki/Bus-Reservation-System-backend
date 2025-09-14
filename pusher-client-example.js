// Frontend Pusher Integration Example
// You can add this to your React/Next.js components

import Pusher from 'pusher-js';

// Initialize Pusher client
const pusher = new Pusher('your_pusher_key', {
  cluster: 'mt1',
  encrypted: true
});

// Example: Listen to booking events
const bookingChannel = pusher.subscribe('bookings');

bookingChannel.bind('booking-created', function(data) {
  console.log('🎫 New booking created:', data);
  // Show notification to user
  showNotification('New booking created!', 'success');
});

bookingChannel.bind('booking-updated', function(data) {
  console.log('📋 Booking updated:', data);
  showNotification('Booking updated!', 'info');
});

bookingChannel.bind('booking-cancelled', function(data) {
  console.log('❌ Booking cancelled:', data);
  showNotification('Booking cancelled!', 'warning');
});

// Example: Listen to user-specific notifications
function subscribeToUserNotifications(userId) {
  const userChannel = pusher.subscribe(`user-${userId}`);
  
  userChannel.bind('notification', function(data) {
    console.log('📢 User notification:', data);
    showNotification(data.message, 'info');
  });
  
  userChannel.bind('profile-updated', function(data) {
    console.log('👤 Profile updated:', data);
    showNotification('Profile updated successfully!', 'success');
    // Update UI with new profile data
    updateProfileUI(data.user);
  });
}

// Example: Listen to admin notifications
const adminChannel = pusher.subscribe('admin-notifications');

adminChannel.bind('notification', function(data) {
  console.log('👨‍💼 Admin notification:', data);
  showAdminNotification(data.message, data.data);
});

// Example: Listen to system notifications
const systemChannel = pusher.subscribe('system');

systemChannel.bind('notification', function(data) {
  console.log('🔔 System notification:', data);
  showSystemNotification(data.message, data.type);
});

// Utility functions
function showNotification(message, type = 'info') {
  // Implement your notification UI here
  // Could use toast, modal, or any notification library
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // Example with a simple alert (replace with your preferred notification)
  if (type === 'success') {
    alert(`✅ ${message}`);
  } else if (type === 'warning') {
    alert(`⚠️ ${message}`);
  } else if (type === 'error') {
    alert(`❌ ${message}`);
  } else {
    alert(`ℹ️ ${message}`);
  }
}

function showAdminNotification(message, data) {
  console.log('Admin notification:', message, data);
  // Implement admin-specific notification UI
}

function showSystemNotification(message, type) {
  console.log('System notification:', message, type);
  // Implement system notification UI
}

function updateProfileUI(userData) {
  console.log('Updating profile UI with:', userData);
  // Update the profile UI with new data
}

// Example usage in React component:
/*
import { useEffect, useState } from 'react';

function Dashboard({ userId }) {
  useEffect(() => {
    // Subscribe to user notifications when component mounts
    subscribeToUserNotifications(userId);
    
    // Cleanup: Unsubscribe when component unmounts
    return () => {
      pusher.unsubscribe(`user-${userId}`);
    };
  }, [userId]);

  return (
    <div>
      {/* Your dashboard content */}
    </div>
  );
}
*/

export { pusher, subscribeToUserNotifications };