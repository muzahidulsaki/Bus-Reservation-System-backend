import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsIn, 
  Min, 
  Max, 
  IsNotEmpty,
  Length,
  IsPhoneNumber,
  IsPositive,
  Matches
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBusDto {
  @IsNotEmpty({ message: 'Bus number is required' })
  @IsString({ message: 'Bus number must be a string' })
  @Length(3, 20, { message: 'Bus number must be between 3 and 20 characters' })
  @Transform(({ value }) => value?.trim().toUpperCase())
  busNumber: string;

  @IsNotEmpty({ message: 'Bus name is required' })
  @IsString({ message: 'Bus name must be a string' })
  @Length(3, 100, { message: 'Bus name must be between 3 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  busName: string;

  @IsNotEmpty({ message: 'Bus type is required' })
  @IsIn(['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper', 'Deluxe'], {
    message: 'Bus type must be one of: AC, Non-AC, Sleeper, Semi-Sleeper, Deluxe'
  })
  busType: string;

  @IsNotEmpty({ message: 'Total seats is required' })
  @IsNumber({}, { message: 'Total seats must be a number' })
  @Min(10, { message: 'Bus must have at least 10 seats' })
  @Max(60, { message: 'Bus cannot have more than 60 seats' })
  totalSeats: number;

  @IsOptional()
  @IsNumber({}, { message: 'Available seats must be a number' })
  @Min(0, { message: 'Available seats cannot be negative' })
  availableSeats?: number;

  @IsNotEmpty({ message: 'Route is required' })
  @IsString({ message: 'Route must be a string' })
  @Length(5, 100, { message: 'Route must be between 5 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  route: string;

  @IsNotEmpty({ message: 'Fare per seat is required' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Fare must be a valid number with max 2 decimal places' })
  @IsPositive({ message: 'Fare per seat must be positive' })
  farePerSeat: number;

  @IsOptional()
  @IsString({ message: 'Driver name must be a string' })
  @Matches(/^[A-Za-z\s.]+$/, { message: 'Driver name should only contain alphabets, spaces and dots' })
  @Length(2, 50, { message: 'Driver name must be between 2 and 50 characters' })
  @Transform(({ value }) => value?.trim())
  driverName?: string;

  @IsOptional()
  @IsString({ message: 'Driver phone must be a string' })
  @Matches(/^(\+88)?01[3-9]\d{8}$/, { 
    message: 'Driver phone must be a valid Bangladesh mobile number' 
  })
  driverPhone?: string;

  @IsOptional()
  @IsIn(['active', 'inactive', 'maintenance'], {
    message: 'Status must be one of: active, inactive, maintenance'
  })
  status?: string;
}

export class UpdateBusDto {
  @IsOptional()
  @IsString({ message: 'Bus number must be a string' })
  @Length(3, 20, { message: 'Bus number must be between 3 and 20 characters' })
  @Transform(({ value }) => value?.trim().toUpperCase())
  busNumber?: string;

  @IsOptional()
  @IsString({ message: 'Bus name must be a string' })
  @Length(3, 100, { message: 'Bus name must be between 3 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  busName?: string;

  @IsOptional()
  @IsIn(['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper', 'Deluxe'], {
    message: 'Bus type must be one of: AC, Non-AC, Sleeper, Semi-Sleeper, Deluxe'
  })
  busType?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Total seats must be a number' })
  @Min(10, { message: 'Bus must have at least 10 seats' })
  @Max(60, { message: 'Bus cannot have more than 60 seats' })
  totalSeats?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Available seats must be a number' })
  @Min(0, { message: 'Available seats cannot be negative' })
  availableSeats?: number;

  @IsOptional()
  @IsString({ message: 'Route must be a string' })
  @Length(5, 100, { message: 'Route must be between 5 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  route?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Fare must be a valid number with max 2 decimal places' })
  @IsPositive({ message: 'Fare per seat must be positive' })
  farePerSeat?: number;

  @IsOptional()
  @IsString({ message: 'Driver name must be a string' })
  @Matches(/^[A-Za-z\s.]+$/, { message: 'Driver name should only contain alphabets, spaces and dots' })
  @Length(2, 50, { message: 'Driver name must be between 2 and 50 characters' })
  @Transform(({ value }) => value?.trim())
  driverName?: string;

  @IsOptional()
  @IsString({ message: 'Driver phone must be a string' })
  @Matches(/^(\+88)?01[3-9]\d{8}$/, { 
    message: 'Driver phone must be a valid Bangladesh mobile number' 
  })
  driverPhone?: string;

  @IsOptional()
  @IsIn(['active', 'inactive', 'maintenance'], {
    message: 'Status must be one of: active, inactive, maintenance'
  })
  status?: string;
}

export class BusResponseDto {
  id: number;
  busNumber: string;
  busName: string;
  busType: string;
  totalSeats: number;
  availableSeats: number;
  route: string;
  farePerSeat: number;
  driverName: string;
  driverPhone: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
