import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsDateString,
  Length,
  Matches 
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProfileDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @Length(2, 100, { message: 'First name must be between 2 and 100 characters' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'First name should only contain alphabets and spaces' })
  @Transform(({ value }) => value?.trim())
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @Length(2, 100, { message: 'Last name must be between 2 and 100 characters' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'Last name should only contain alphabets and spaces' })
  @Transform(({ value }) => value?.trim())
  lastName?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'], { message: 'Gender must be male, female, or other' })
  gender?: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @Length(10, 500, { message: 'Bio must be between 10 and 500 characters' })
  @Transform(({ value }) => value?.trim())
  bio?: string;

  @IsOptional()
  @IsString({ message: 'Profile picture must be a string' })
  profilePicture?: string;

  @IsOptional()
  @IsString({ message: 'Occupation must be a string' })
  @Length(2, 100, { message: 'Occupation must be between 2 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  occupation?: string;

  @IsOptional()
  @IsString({ message: 'Emergency contact must be a string' })
  @Length(2, 100, { message: 'Emergency contact must be between 2 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  emergencyContact?: string;

  @IsOptional()
  @IsString({ message: 'Emergency phone must be a string' })
  @Matches(/^(\+88)?01[3-9]\d{8}$/, { 
    message: 'Emergency phone must be a valid Bangladesh mobile number' 
  })
  emergencyPhone?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @Length(5, 255, { message: 'Address must be between 5 and 255 characters' })
  @Transform(({ value }) => value?.trim())
  address?: string;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @Length(2, 100, { message: 'City must be between 2 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  city?: string;

  @IsOptional()
  @IsString({ message: 'Zip code must be a string' })
  @Matches(/^\d{4}$/, { message: 'Zip code must be 4 digits' })
  zipCode?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @Length(2, 100, { message: 'First name must be between 2 and 100 characters' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'First name should only contain alphabets and spaces' })
  @Transform(({ value }) => value?.trim())
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @Length(2, 100, { message: 'Last name must be between 2 and 100 characters' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'Last name should only contain alphabets and spaces' })
  @Transform(({ value }) => value?.trim())
  lastName?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'], { message: 'Gender must be male, female, or other' })
  gender?: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @Length(10, 500, { message: 'Bio must be between 10 and 500 characters' })
  @Transform(({ value }) => value?.trim())
  bio?: string;

  @IsOptional()
  @IsString({ message: 'Profile picture must be a string' })
  profilePicture?: string;

  @IsOptional()
  @IsString({ message: 'Occupation must be a string' })
  @Length(2, 100, { message: 'Occupation must be between 2 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  occupation?: string;

  @IsOptional()
  @IsString({ message: 'Emergency contact must be a string' })
  @Length(2, 100, { message: 'Emergency contact must be between 2 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  emergencyContact?: string;

  @IsOptional()
  @IsString({ message: 'Emergency phone must be a string' })
  @Matches(/^(\+88)?01[3-9]\d{8}$/, { 
    message: 'Emergency phone must be a valid Bangladesh mobile number' 
  })
  emergencyPhone?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @Length(5, 255, { message: 'Address must be between 5 and 255 characters' })
  @Transform(({ value }) => value?.trim())
  address?: string;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @Length(2, 100, { message: 'City must be between 2 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  city?: string;

  @IsOptional()
  @IsString({ message: 'Zip code must be a string' })
  @Matches(/^\d{4}$/, { message: 'Zip code must be 4 digits' })
  zipCode?: string;
}

export class ProfileResponseDto {
  id: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: string;
  bio?: string;
  profilePicture?: string;
  occupation?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
