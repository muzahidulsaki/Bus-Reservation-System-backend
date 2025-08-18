import { IsNotEmpty, IsOptional, IsBoolean, IsString, MaxLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @MaxLength(50)
  building: string;

  @IsOptional()
  @MaxLength(20)
  floor?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @MaxLength(50)
  building?: string;

  @IsOptional()
  @MaxLength(20)
  floor?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
