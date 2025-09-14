import { IsString, IsNotEmpty, IsDateString, IsEmail, IsOptional, IsNumber, IsPhoneNumber } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  fromLocation: string;

  @IsString()
  @IsNotEmpty()
  toLocation: string;

  @IsDateString()
  @IsNotEmpty()
  journeyDate: string;

  @IsString()
  @IsOptional()
  departureTime: string;

  @IsString()
  @IsNotEmpty()
  busType: string;

  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  @IsNumber()
  @IsNotEmpty()
  fare: number;

  @IsString()
  @IsNotEmpty()
  passengerName: string;

  @IsString()
  @IsNotEmpty()
  passengerPhone: string;

  @IsEmail()
  @IsOptional()
  passengerEmail?: string;
}