// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsEnum,
  Matches,
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only alphabets',
  })
  fullName: string;

  @IsEmail({}, { message: 'Must be a valid email' })
  @Matches(/^[\w.%+-]+@[A-Za-z0-9.-]+\.com$/, {
    message: 'Email must end with .com domain',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  password: string;

  @IsNotEmpty()
  @Matches(/^(male|female)$/, {
    message: 'Gender must be either male or female',
  })
  gender: string;

 @IsNotEmpty()
@IsNumberString()
@Matches(/^01[0-9]{9}$/)
phone: string;

 @IsNotEmpty()
@IsNumberString()
@Matches(/^\d{10,17}$/, {
  message: 'NID must be between 10 to 17 digits',
})
nid: string;

  @IsNotEmpty()
@IsNumberString()
age: string;

  @IsEnum(['user', 'admin', 'bus_owner'])
  @IsOptional() // optional since you already have default in entity
  role?: 'user' | 'admin' | 'bus_owner';
}

// DTO for updating user profile (PUT method)
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email' })
  @Matches(/^[\w.%+-]+@[A-Za-z0-9.-]+\.com$/, {
    message: 'Email must end with .com domain',
  })
  email?: string;

  @IsOptional()
  @MinLength(6)
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  password?: string;

  @IsOptional()
  @Matches(/^(male|female)$/, {
    message: 'Gender must be either male or female',
  })
  gender?: string;

  @IsOptional()
  @Matches(/^01[0-9]{9}$/, {
    message: 'Phone number must be a valid Bangladeshi number',
  })
  phone?: string;

  @IsOptional()
  @IsNumberString()
  @Matches(/^\d{10,17}$/, {
    message: 'NID must be between 10 to 17 digits',
  })
  nid?: string;

  // // Add role field (Missing!)
  // @IsOptional()
  // @IsEnum(['user', 'admin', 'bus_owner'])
  // role?: 'user' | 'admin' | 'bus_owner';

  // // Add nid_image field (Missing!)
  // @IsOptional()
  // nid_image?: any; // For file uploads

  @IsOptional()
  @Matches(/^(active|inactive)$/, {
    message: 'Status must be either active or inactive',
  })
  status?: 'active' | 'inactive';
}
