import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { User } from '../user/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto, userId: number): Promise<Booking> {
    // Find the user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if seat is already booked for the same journey
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        fromLocation: createBookingDto.fromLocation,
        toLocation: createBookingDto.toLocation,
        journeyDate: new Date(createBookingDto.journeyDate),
        seatNumber: createBookingDto.seatNumber,
        status: 'confirmed'
      }
    });

    if (existingBooking) {
      throw new BadRequestException('This seat is already booked for the selected journey');
    }

    // Generate unique ticket number
    const ticketNumber = this.generateTicketNumber();

    // Create new booking
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      journeyDate: new Date(createBookingDto.journeyDate),
      user,
      ticketNumber,
      status: 'confirmed'
    });

    return this.bookingRepository.save(booking);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  async getBookingById(id: number, userId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user']
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async cancelBooking(id: number, userId: number): Promise<Booking> {
    const booking = await this.getBookingById(id, userId);
    
    if (booking.status === 'cancelled') {
      throw new BadRequestException('Booking is already cancelled');
    }

    booking.status = 'cancelled';
    return this.bookingRepository.save(booking);
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  private generateTicketNumber(): string {
    const prefix = 'VBE';
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp.slice(-6)}${random}`;
  }
}