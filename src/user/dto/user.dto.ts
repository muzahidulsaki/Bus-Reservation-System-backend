// src/users/user/dto/create-user.dto.ts
import {
  IsEmail,
  Matches,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsNumberString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only alphabets',
  })
  name: string;

  @IsEmail()
  @Matches(/^[\w.-]+@[\w.-]+\.xyz$/, {
    message: 'Email must contain @ and end with .xyz domain',
  })
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @Matches(/^\d{10,17}$/, {
    message: 'NID must be between 10 to 17 digits',
  })
  nid: string;
}
