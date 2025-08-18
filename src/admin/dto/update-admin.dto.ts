import { IsString, IsEmail, IsOptional, IsEnum, IsNumber, Min, Max, MinLength, Matches, IsInt, MaxLength, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateAdminDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  fullName?: string;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(65)
  age?: number;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsEmail()
  @Matches(/^[\w.-]+@.*\.com$/, { message: 'Email must be from .com domain' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  password?: string;

  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: 'male' | 'female';

  @IsOptional()
  @IsNumberString()
  @Matches(/^01[0-9]{9}$/, { message: 'Phone must be a valid Bangladeshi number (01xxxxxxxxx)' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  departmentId?: number;
}
