import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto, BookingResponseDto } from './dto/booking.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller()
@UseGuards(AuthGuard) // All routes protected
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Route 1: POST /user/:id/booking - Create booking for user
  @Post('user/:id/booking')
  async createBooking(
    @Param('id', ParseIntPipe) userId: number,
    @Body() createBookingDto: CreateBookingDto
  ): Promise<BookingResponseDto> {
    try {
      return await this.bookingService.createBooking(userId, createBookingDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create booking',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Route 2: GET /user/:id/booking - Get all bookings for user
  @Get('user/:id/booking')
  async getUserBookings(
    @Param('id', ParseIntPipe) userId: number
  ): Promise<BookingResponseDto[]> {
    try {
      return await this.bookingService.getBookingsByUserId(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch user bookings',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Route 3: PATCH /booking/:id - Update specific booking
  @Patch('booking/:id')
  async updateBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto
  ): Promise<BookingResponseDto> {
    try {
      return await this.bookingService.updateBooking(id, updateBookingDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update booking',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Route 4: DELETE /booking/:id - Delete specific booking
  @Delete('booking/:id')
  async deleteBooking(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ message: string }> {
    try {
      return await this.bookingService.deleteBooking(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete booking',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Additional route: GET /booking/:id - Get specific booking details
  @Get('booking/:id')
  async getBooking(
    @Param('id', ParseIntPipe) id: number
  ): Promise<BookingResponseDto> {
    try {
      return await this.bookingService.getBookingById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch booking',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Additional route: GET /bookings - Get all bookings (admin purpose)
  @Get('bookings')
  async getAllBookings(
    @Query('status') status?: string
  ): Promise<BookingResponseDto[]> {
    try {
      if (status) {
        return await this.bookingService.getBookingsByStatus(status);
      }
      return await this.bookingService.getAllBookings();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch bookings',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
