// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  Matches,
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  // @Matches(/^[A-Za-z\s]+$/, {
  //   message: 'Name must contain only alphabets',
  // })
  fullName: string;

  @IsEmail({}, { message: 'Must be a valid email' })
  @Matches(/^[\w.%+-]+@[A-Za-z0-9.-]+\.xyz$/, {
    message: 'Email must end with .xyz domain',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  password: string;

  @IsOptional()
  @Matches(/^(male|female)$/, {
    message: 'Gender must be either male or female',
  })
  gender?: string;

  @IsNotEmpty()
  @Matches(/^01[0-9]{9}$/, {
    message: 'Phone number must be a valid Bangladeshi number',
  })
  phone: string;

  @IsOptional()
  @IsNumberString()
  @Matches(/^\d{10,17}$/, {
    message: 'NID must be between 10 to 17 digits',
  })
  nid?: string;
}
