import { IsEmail, Matches, IsNotEmpty, MinLength, IsIn, IsNumberString } from 'class-validator';

export class CreateAdminDto {
  @IsEmail()
  @Matches(/^[\w.-]+@aiub\.edu$/, { message: 'Email must be from aiub.edu domain' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  password: string;

  @IsIn(['male', 'female'])
  gender: string;

  @IsNotEmpty()
  @IsNumberString()
  phone: string;
}
