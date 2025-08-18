import {
  IsEmail,
  Matches,
  IsNotEmpty,
  MinLength,
  IsIn,
  IsNumberString,
  IsInt,
  MaxLength,
  Min,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
 
export class CreateAdminDto {
  @IsInt()
  @Min(1)
  id: number;
 
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;
 
  @IsInt()
  @Min(0)
  age: number;
 
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';
 
 @IsEmail()
@Matches(/^[\w.-]+@.*\.com$/, { message: 'Email must be from .com domain' })
email: string;
 
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  password: string;
 
  @IsIn(['male', 'female'])
gender: 'male' | 'female';
 
  @IsNotEmpty()
  @IsNumberString()
  phone: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  department?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  position?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  departmentId?: number;
}