import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto, ProfileResponseDto } from './dto/profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller()
@UseGuards(AuthGuard) // All routes protected
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Route 1: POST /user/:id/profile - Create profile for user
  @Post('user/:id/profile')
  async createProfile(
    @Param('id', ParseIntPipe) userId: number,
    @Body() createProfileDto: CreateProfileDto
  ): Promise<ProfileResponseDto> {
    try {
      return await this.profileService.createProfile(userId, createProfileDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Route 2: GET /user/:id/profile - Get user's profile
  @Get('user/:id/profile')
  async getProfile(
    @Param('id', ParseIntPipe) userId: number
  ): Promise<ProfileResponseDto> {
    try {
      return await this.profileService.getProfileByUserId(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Route 3: PATCH /user/:id/profile - Update user's profile
  @Patch('user/:id/profile')
  async updateProfile(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<ProfileResponseDto> {
    try {
      return await this.profileService.updateProfile(userId, updateProfileDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Route 4: DELETE /user/:id/profile - Delete user's profile
  @Delete('user/:id/profile')
  async deleteProfile(
    @Param('id', ParseIntPipe) userId: number
  ): Promise<{ message: string }> {
    try {
      return await this.profileService.deleteProfile(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Additional route: GET /profiles - Get all profiles (admin purpose)
  @Get('profiles')
  async getAllProfiles(): Promise<ProfileResponseDto[]> {
    try {
      return await this.profileService.getAllProfiles();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch profiles',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
