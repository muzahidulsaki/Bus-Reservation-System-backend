import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Length(6, 50, { message: 'Password must be between 6 and 50 characters' })
  password: string;
}

export interface SessionUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
}
