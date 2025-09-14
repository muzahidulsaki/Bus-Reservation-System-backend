import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  MaxLength,
  IsString,
} from 'class-validator';

export class AdminRegisterDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name must contain only letters and spaces' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[\w.-]+@.*\.com$/, { message: 'Email must be from .com domain' })
  email: string;

  @IsNotEmpty({ message: 'Counter location is required' })
  @IsString()
  @MinLength(3, { message: 'Counter location must be at least 3 characters' })
  @MaxLength(100, { message: 'Counter location must not exceed 100 characters' })
  counterLocation: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^01[0-9]{9}$/, { message: 'Phone must be a valid Bangladeshi number (01xxxxxxxxx)' })
  phone: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  password: string;
}