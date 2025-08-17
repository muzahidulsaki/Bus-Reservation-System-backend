import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { User } from '../user/user.entity';
import { Bus } from '../bus/bus.entity';
import { CreateBookingDto, UpdateBookingDto, BookingResponseDto } from './dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
  ) {}

  async createBooking(userId: number, createBookingDto: CreateBookingDto): Promise<BookingResponseDto> {
    try {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Check if bus exists (if busId provided)
      if (createBookingDto.busId) {
        const bus = await this.busRepository.findOne({ where: { id: createBookingDto.busId } });
        if (!bus) {
          throw new HttpException('Bus not found', HttpStatus.NOT_FOUND);
        }

        // Check seat availability
        if (bus.availableSeats < createBookingDto.numberOfSeats) {
          throw new HttpException(
            `Only ${bus.availableSeats} seats available`,
            HttpStatus.BAD_REQUEST
          );
        }
      }

      // Generate unique booking reference
      const bookingReference = this.generateBookingReference();

      // Set default values
      const bookingData = {
        ...createBookingDto,
        bookingReference,
        userId,
        travelDate: new Date(createBookingDto.travelDate),
        paymentMethod: createBookingDto.paymentMethod || 'cash',
        paymentStatus: createBookingDto.paymentStatus || 'pending',
      };

      const booking = this.bookingRepository.create(bookingData);
      const savedBooking = await this.bookingRepository.save(booking);

      // Update bus available seats if busId provided
      if (createBookingDto.busId) {
        await this.busRepository.decrement(
          { id: createBookingDto.busId },
          'availableSeats',
          createBookingDto.numberOfSeats
        );
      }

      return this.mapToResponseDto(savedBooking);
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

  async getBookingsByUserId(userId: number): Promise<BookingResponseDto[]> {
    try {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const bookings = await this.bookingRepository.find({
        where: { userId },
        relations: ['user', 'bus'],
        order: { createdAt: 'DESC' }
      });

      return bookings.map(booking => this.mapToResponseDto(booking));
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

  async getBookingById(id: number): Promise<BookingResponseDto> {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { id },
        relations: ['user', 'bus']
      });

      if (!booking) {
        throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
      }

      return this.mapToResponseDto(booking);
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

  async updateBooking(id: number, updateBookingDto: UpdateBookingDto): Promise<BookingResponseDto> {
    try {
      const booking = await this.bookingRepository.findOne({ where: { id } });
      if (!booking) {
        throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
      }

      // Check if trying to change seat count and bus exists
      if (updateBookingDto.numberOfSeats && booking.busId) {
        const bus = await this.busRepository.findOne({ where: { id: booking.busId } });
        if (bus) {
          const seatDifference = updateBookingDto.numberOfSeats - booking.numberOfSeats;
          if (seatDifference > 0 && bus.availableSeats < seatDifference) {
            throw new HttpException(
              `Only ${bus.availableSeats} additional seats available`,
              HttpStatus.BAD_REQUEST
            );
          }
        }
      }

      const updateData = {
        ...updateBookingDto,
        travelDate: updateBookingDto.travelDate ? new Date(updateBookingDto.travelDate) : booking.travelDate,
      };

      await this.bookingRepository.update(id, updateData);

      // Update bus seats if numberOfSeats changed
      if (updateBookingDto.numberOfSeats && booking.busId) {
        const seatDifference = updateBookingDto.numberOfSeats - booking.numberOfSeats;
        if (seatDifference !== 0) {
          await this.busRepository.decrement(
            { id: booking.busId },
            'availableSeats',
            seatDifference
          );
        }
      }

      const updatedBooking = await this.bookingRepository.findOne({ where: { id } });
      return this.mapToResponseDto(updatedBooking);
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

  async deleteBooking(id: number): Promise<{ message: string }> {
    try {
      const booking = await this.bookingRepository.findOne({ where: { id } });
      if (!booking) {
        throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
      }

      // Return seats to bus if exists
      if (booking.busId) {
        await this.busRepository.increment(
          { id: booking.busId },
          'availableSeats',
          booking.numberOfSeats
        );
      }

      await this.bookingRepository.delete(id);

      return { message: 'Booking deleted successfully' };
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

  // Utility methods
  async getAllBookings(): Promise<BookingResponseDto[]> {
    try {
      const bookings = await this.bookingRepository.find({
        relations: ['user', 'bus'],
        order: { createdAt: 'DESC' }
      });

      return bookings.map(booking => this.mapToResponseDto(booking));
    } catch (error) {
      throw new HttpException(
        'Failed to fetch all bookings',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBookingsByStatus(status: string): Promise<BookingResponseDto[]> {
    try {
      const bookings = await this.bookingRepository.find({
        where: { status },
        relations: ['user', 'bus'],
        order: { createdAt: 'DESC' }
      });

      return bookings.map(booking => this.mapToResponseDto(booking));
    } catch (error) {
      throw new HttpException(
        'Failed to fetch bookings by status',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private generateBookingReference(): string {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BK${timestamp.slice(-6)}${randomNum}`;
  }

  private mapToResponseDto(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      bookingReference: booking.bookingReference,
      numberOfSeats: booking.numberOfSeats,
      seatNumbers: booking.seatNumbers,
      totalFare: parseFloat(booking.totalFare.toString()),
      status: booking.status,
      travelDate: booking.travelDate,
      passengerName: booking.passengerName,
      passengerPhone: booking.passengerPhone,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      notes: booking.notes,
      userId: booking.userId,
      busId: booking.busId,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }
}
