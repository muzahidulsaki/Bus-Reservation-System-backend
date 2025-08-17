import { 
  IsString, 
  IsNumber, 
  IsArray, 
  IsEnum, 
  IsDateString,
  IsOptional,
  IsNotEmpty,
  Length,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
  Matches
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'Number of seats is required' })
  @IsNumber({}, { message: 'Number of seats must be a number' })
  @Min(1, { message: 'Must book at least 1 seat' })
  @Max(10, { message: 'Cannot book more than 10 seats at once' })
  numberOfSeats: number;

  @IsOptional()
  @IsArray({ message: 'Seat numbers must be an array' })
  @ArrayMinSize(1, { message: 'At least one seat number is required' })
  @ArrayMaxSize(10, { message: 'Cannot select more than 10 seats' })
  @Type(() => Number)
  seatNumbers?: number[];

  @IsNotEmpty({ message: 'Total fare is required' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Total fare must be a valid number' })
  @Min(0.01, { message: 'Total fare must be greater than 0' })
  totalFare: number;

  @IsNotEmpty({ message: 'Travel date is required' })
  @IsDateString({}, { message: 'Travel date must be a valid date' })
  travelDate: string;

  @IsNotEmpty({ message: 'Passenger name is required' })
  @IsString({ message: 'Passenger name must be a string' })
  @Length(2, 100, { message: 'Passenger name must be between 2 and 100 characters' })
  @Matches(/^[A-Za-z\s.]+$/, { message: 'Passenger name should only contain alphabets, spaces and dots' })
  @Transform(({ value }) => value?.trim())
  passengerName: string;

  @IsNotEmpty({ message: 'Passenger phone is required' })
  @IsString({ message: 'Passenger phone must be a string' })
  @Matches(/^(\+88)?01[3-9]\d{8}$/, { 
    message: 'Passenger phone must be a valid Bangladesh mobile number' 
  })
  passengerPhone: string;

  @IsOptional()
  @IsEnum(['cash', 'card', 'mobile_banking'], {
    message: 'Payment method must be one of: cash, card, mobile_banking'
  })
  paymentMethod?: string;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'refunded'], {
    message: 'Payment status must be one of: pending, paid, refunded'
  })
  paymentStatus?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @Length(5, 500, { message: 'Notes must be between 5 and 500 characters' })
  @Transform(({ value }) => value?.trim())
  notes?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Bus ID must be a number' })
  busId?: number;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsNumber({}, { message: 'Number of seats must be a number' })
  @Min(1, { message: 'Must book at least 1 seat' })
  @Max(10, { message: 'Cannot book more than 10 seats at once' })
  numberOfSeats?: number;

  @IsOptional()
  @IsArray({ message: 'Seat numbers must be an array' })
  @ArrayMinSize(1, { message: 'At least one seat number is required' })
  @ArrayMaxSize(10, { message: 'Cannot select more than 10 seats' })
  @Type(() => Number)
  seatNumbers?: number[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Total fare must be a valid number' })
  @Min(0.01, { message: 'Total fare must be greater than 0' })
  totalFare?: number;

  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'cancelled', 'completed'], {
    message: 'Status must be one of: pending, confirmed, cancelled, completed'
  })
  status?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Travel date must be a valid date' })
  travelDate?: string;

  @IsOptional()
  @IsString({ message: 'Passenger name must be a string' })
  @Length(2, 100, { message: 'Passenger name must be between 2 and 100 characters' })
  @Matches(/^[A-Za-z\s.]+$/, { message: 'Passenger name should only contain alphabets, spaces and dots' })
  @Transform(({ value }) => value?.trim())
  passengerName?: string;

  @IsOptional()
  @IsString({ message: 'Passenger phone must be a string' })
  @Matches(/^(\+88)?01[3-9]\d{8}$/, { 
    message: 'Passenger phone must be a valid Bangladesh mobile number' 
  })
  passengerPhone?: string;

  @IsOptional()
  @IsEnum(['cash', 'card', 'mobile_banking'], {
    message: 'Payment method must be one of: cash, card, mobile_banking'
  })
  paymentMethod?: string;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'refunded'], {
    message: 'Payment status must be one of: pending, paid, refunded'
  })
  paymentStatus?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @Length(5, 500, { message: 'Notes must be between 5 and 500 characters' })
  @Transform(({ value }) => value?.trim())
  notes?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Bus ID must be a number' })
  busId?: number;
}

export class BookingResponseDto {
  id: number;
  bookingReference: string;
  numberOfSeats: number;
  seatNumbers?: number[];
  totalFare: number;
  status: string;
  travelDate: Date;
  passengerName: string;
  passengerPhone: string;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  userId: number;
  busId?: number;
  createdAt: Date;
  updatedAt: Date;
}
