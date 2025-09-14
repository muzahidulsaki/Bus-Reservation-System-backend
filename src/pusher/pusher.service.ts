// src/pusher/pusher.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Pusher from 'pusher';

@Injectable()
export class PusherService {
  private readonly logger = new Logger(PusherService.name);
  private pusher: Pusher;

  constructor(private configService: ConfigService) {
    this.pusher = new Pusher({
      appId: this.configService.get<string>('PUSHER_APP_ID'),
      key: this.configService.get<string>('PUSHER_KEY'),
      secret: this.configService.get<string>('PUSHER_SECRET'),
      cluster: this.configService.get<string>('PUSHER_CLUSTER'),
      useTLS: true,
    });

    this.logger.log('🚀 Pusher service initialized');
  }

  // Generic method to trigger any event
  async trigger(channel: string, event: string, data: any): Promise<void> {
    try {
      await this.pusher.trigger(channel, event, data);
      this.logger.log(`📡 Event triggered: ${event} on channel: ${channel}`);
    } catch (error) {
      this.logger.error(`❌ Failed to trigger event: ${event}`, error);
      throw error;
    }
  }

  // Booking related events
  async triggerBookingCreated(bookingData: any): Promise<void> {
    await this.trigger('bookings', 'booking-created', {
      message: 'New booking created',
      booking: bookingData,
      timestamp: new Date().toISOString(),
    });
  }

  async triggerBookingUpdated(bookingData: any): Promise<void> {
    await this.trigger('bookings', 'booking-updated', {
      message: 'Booking updated',
      booking: bookingData,
      timestamp: new Date().toISOString(),
    });
  }

  async triggerBookingCancelled(bookingData: any): Promise<void> {
    await this.trigger('bookings', 'booking-cancelled', {
      message: 'Booking cancelled',
      booking: bookingData,
      timestamp: new Date().toISOString(),
    });
  }

  // User related events
  async triggerUserRegistered(userData: any): Promise<void> {
    await this.trigger('users', 'user-registered', {
      message: 'New user registered',
      user: userData,
      timestamp: new Date().toISOString(),
    });
  }

  async triggerUserProfileUpdated(userData: any): Promise<void> {
    await this.trigger(`user-${userData.id}`, 'profile-updated', {
      message: 'Profile updated successfully',
      user: userData,
      timestamp: new Date().toISOString(),
    });
  }

  // Admin related events
  async triggerAdminNotification(message: string, data?: any): Promise<void> {
    await this.trigger('admin-notifications', 'notification', {
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // System events
  async triggerSystemNotification(message: string, type: 'info' | 'warning' | 'error' = 'info'): Promise<void> {
    await this.trigger('system', 'notification', {
      message,
      type,
      timestamp: new Date().toISOString(),
    });
  }

  // Bus related events
  async triggerBusStatusChanged(busData: any): Promise<void> {
    await this.trigger('buses', 'status-changed', {
      message: 'Bus status updated',
      bus: busData,
      timestamp: new Date().toISOString(),
    });
  }

  // Real-time dashboard updates
  async triggerDashboardUpdate(dashboardData: any): Promise<void> {
    await this.trigger('dashboard', 'update', {
      message: 'Dashboard data updated',
      data: dashboardData,
      timestamp: new Date().toISOString(),
    });
  }

  // Private user notifications
  async triggerUserNotification(userId: number, message: string, data?: any): Promise<void> {
    await this.trigger(`user-${userId}`, 'notification', {
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Batch notifications
  async triggerMultipleUsers(userIds: number[], event: string, data: any): Promise<void> {
    const promises = userIds.map(userId =>
      this.trigger(`user-${userId}`, event, data)
    );
    
    await Promise.all(promises);
    this.logger.log(`📡 Batch event sent to ${userIds.length} users`);
  }
}