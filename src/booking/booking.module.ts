import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { SessionBookingController } from './session-booking.controller';
import { Booking } from './booking.entity';
import { User } from '../user/user.entity';
import { Bus } from '../bus/bus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Bus])],
  controllers: [BookingController, SessionBookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
