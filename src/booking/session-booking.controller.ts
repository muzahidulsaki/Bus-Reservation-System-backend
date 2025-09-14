import { Controller, Post, Get, Body, Req, Param, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { User } from '../user/user.entity';

@Controller('booking')
export class SessionBookingController {
  
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  
  @Post('create')
  async createBooking(@Body() createBookingDto: any, @Req() req: Request) {
    // Check if user is logged in
    if (!req.session || !req.session['user']) {
      throw new HttpException('Please login to access this resource', HttpStatus.UNAUTHORIZED);
    }

    try {
      const sessionUser = req.session['user'];
      
      // Find user in database
      const user = await this.userRepository.findOne({ 
        where: { id: sessionUser.id } 
      });
      
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      // Generate unique ticket number
      const ticketNumber = this.generateTicketNumber();
      
      // Create booking entity
      const booking = this.bookingRepository.create({
        bookingReference: ticketNumber,
        numberOfSeats: createBookingDto.seatNumbers.length,
        seatNumbers: createBookingDto.seatNumbers,
        totalFare: createBookingDto.totalPrice,
        status: 'confirmed',
        travelDate: new Date(createBookingDto.date),
        passengerName: createBookingDto.name,
        passengerPhone: createBookingDto.phone,
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        user: user,
      });
      
      // Save to database
      const savedBooking = await this.bookingRepository.save(booking);
      
      console.log('New Booking Created:', savedBooking);
      
      return {
        success: true,
        message: 'Booking created successfully',
        ticketNumber: savedBooking.bookingReference,
        totalPrice: savedBooking.totalFare,
        seatNumbers: savedBooking.seatNumbers,
        booking: {
          id: savedBooking.id,
          passengerName: savedBooking.passengerName,
          departureLocation: createBookingDto.from,
          arrivalLocation: createBookingDto.to,
          travelDate: savedBooking.travelDate,
          departureTime: createBookingDto.time,
          status: savedBooking.status
        }
      };
    } catch (error) {
      console.error('Booking creation error:', error);
      throw new HttpException(
        error.message || 'Failed to create booking',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('my-bookings')
  async getUserBookings(@Req() req: Request) {
    if (!req.session || !req.session['user']) {
      throw new HttpException('Please login to view bookings', HttpStatus.UNAUTHORIZED);
    }

    try {
      const sessionUser = req.session['user'];
      
      // Find user bookings from database
      const bookings = await this.bookingRepository.find({
        where: { userId: sessionUser.id },
        order: { id: 'DESC' }
      });
      
      const formattedBookings = bookings.map(booking => ({
        id: booking.id,
        ticketNumber: booking.bookingReference,
        passengerName: booking.passengerName,
        passengerPhone: booking.passengerPhone,
        travelDate: booking.travelDate,
        seatNumbers: booking.seatNumbers,
        numberOfSeats: booking.numberOfSeats,
        totalFare: booking.totalFare,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        notes: booking.notes
      }));
      
      return {
        success: true,
        bookings: formattedBookings,
        total: bookings.length
      };
    } catch (error) {
      console.error('Get bookings error:', error);
      throw new HttpException(
        error.message || 'Failed to fetch bookings',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ticket/:id')
  async getBookingDetails(@Param('id') id: string, @Req() req: Request) {
    if (!req.session || !req.session['user']) {
      return { success: false, message: 'Please login to view booking details' };
    }

    try {
      // Mock booking details (replace with actual database query)
      const booking = {
        id: parseInt(id),
        fromLocation: 'Dhaka',
        toLocation: 'Chittagong',
        journeyDate: '2025-09-20',
        departureTime: '08:00',
        busType: 'AC',
        seatNumber: 'A1',
        fare: 850,
        passengerName: req.session['user'].fullName,
        passengerPhone: req.session['user'].phone || '01700000000',
        status: 'confirmed',
        ticketNumber: 'VBE123456',
        createdAt: '2025-09-15T01:00:00.000Z'
      };
      
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
      console.log(`Cancelling booking ${id} for user ${req.session['user'].id}`);
      
      return {
        success: true,
        message: 'Booking cancelled successfully',
        bookingId: id
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
      // Mock all bookings (replace with actual database query)
      const allBookings = [
        {
          id: 1,
          fromLocation: 'Dhaka',
          toLocation: 'Chittagong',
          journeyDate: '2025-09-20',
          departureTime: '08:00',
          busType: 'AC',
          seatNumber: 'A1',
          fare: 850,
          passengerName: 'John Doe',
          passengerPhone: '01700000000',
          status: 'confirmed',
          ticketNumber: 'VBE123456',
          createdAt: '2025-09-15T01:00:00.000Z'
        }
      ];
      
      return {
        success: true,
        bookings: allBookings
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch bookings'
      };
    }
  }

  private generateTicketNumber(): string {
    const prefix = 'VBE';
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp.slice(-6)}${random}`;
  }
}