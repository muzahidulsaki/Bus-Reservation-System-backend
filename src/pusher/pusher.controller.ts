// src/pusher/pusher.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { PusherService } from './pusher.service';

@Controller('pusher')
export class PusherController {
  constructor(private readonly pusherService: PusherService) {}

  // Test endpoint to trigger sample events
  @Post('test')
  async testPusher(@Body() data: { channel: string; event: string; message: string }) {
    try {
      await this.pusherService.trigger(data.channel, data.event, {
        message: data.message,
        timestamp: new Date().toISOString(),
        test: true
      });

      return {
        success: true,
        message: `Event '${data.event}' sent to channel '${data.channel}'`,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send Pusher event',
        error: error.message
      };
    }
  }

  // Test notification
  @Post('test-notification')
  async testNotification() {
    try {
      await this.pusherService.triggerSystemNotification(
        'This is a test notification from Pusher!',
        'info'
      );

      return {
        success: true,
        message: 'Test notification sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send test notification',
        error: error.message
      };
    }
  }

  // Test admin notification
  @Post('test-admin')
  async testAdminNotification() {
    try {
      await this.pusherService.triggerAdminNotification(
        'Test admin notification',
        { testData: 'This is test admin data' }
      );

      return {
        success: true,
        message: 'Admin notification sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send admin notification',
        error: error.message
      };
    }
  }

  // Get Pusher connection info (for frontend)
  @Get('config')
  async getPusherConfig() {
    return {
      success: true,
      config: {
        key: process.env.PUSHER_KEY,
        cluster: process.env.PUSHER_CLUSTER,
        // Don't expose secret keys
      }
    };
  }
}