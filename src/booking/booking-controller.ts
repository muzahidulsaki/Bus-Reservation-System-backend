import { Controller, Post, Get, Body, Req, Param, Patch, UseGuards } from '@nestjs/common';
import { BookingService } from './booking-service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Request } from 'express';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('create')
  async createBooking(@Body() createBookingDto: CreateBookingDto, @Req() req: Request) {
    // Check if user is logged in
    if (!req.session || !req.session['user']) {
      return { success: false, message: 'Please login to make a booking' };
    }

    try {
      const userId = req.session['user'].id;
      const booking = await this.bookingService.createBooking(createBookingDto, userId);
      
      return {
        success: true,
        message: 'Booking created successfully',
        booking: booking,
        ticketNumber: booking.ticketNumber
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create booking'
      };
    }
  }

  @Get('my-bookings')
  async getUserBookings(@Req() req: Request) {
    if (!req.session || !req.session['user']) {
      return { success: false, message: 'Please login to view bookings' };
    }

    try {
      const userId = req.session['user'].id;
      const bookings = await this.bookingService.getUserBookings(userId);
      
      return {
        success: true,
        bookings: bookings
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch bookings'
      };
    }
  }

  @Get('ticket/:id')
  async getBookingDetails(@Param('id') id: string, @Req() req: Request) {
    if (!req.session || !req.session['user']) {
      return { success: false, message: 'Please login to view booking details' };
    }

    try {
      const userId = req.session['user'].id;
      const booking = await this.bookingService.getBookingById(+id, userId);
      
      return {
        success: true,
        booking: booking
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Booking not found'
      };
    }
  }

  @Patch('cancel/:id')
  async cancelBooking(@Param('id') id: string, @Req() req: Request) {
    if (!req.session || !req.session['user']) {
      return { success: false, message: 'Please login to cancel booking' };
    }

    try {
      const userId = req.session['user'].id;
      const booking = await this.bookingService.cancelBooking(+id, userId);
      
      return {
        success: true,
        message: 'Booking cancelled successfully',
        booking: booking
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to cancel booking'
      };
    }
  }

  // Admin endpoint to get all bookings
  @Get('admin/all')
  async getAllBookings(@Req() req: Request) {
    if (!req.session || !req.session['admin']) {
      return { success: false, message: 'Admin access required' };
    }

    try {
      const bookings = await this.bookingService.getAllBookings();
      
      return {
        success: true,
        bookings: bookings
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch bookings'
      };
    }
  }
}