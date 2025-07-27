// src/users/bus-owner/dto/create-bus-owner.dto.ts
import {
  IsString,
  Matches,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateBusOwnerDto {
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name must not contain any special characters',
  })
  name: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  password: string;

  @IsNotEmpty()
  @Matches(/^01\d{9}$/, {
    message: 'Phone number must start with 01 and be 11 digits long',
  })
  phone: string;
}
