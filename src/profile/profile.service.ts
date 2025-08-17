import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from '../user/user.entity';
import { CreateProfileDto, UpdateProfileDto, ProfileResponseDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createProfile(userId: number, createProfileDto: CreateProfileDto): Promise<ProfileResponseDto> {
    try {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Check if profile already exists for this user
      const existingProfile = await this.profileRepository.findOne({ where: { userId } });
      if (existingProfile) {
        throw new HttpException('Profile already exists for this user', HttpStatus.CONFLICT);
      }

      const profile = this.profileRepository.create({
        ...createProfileDto,
        userId,
        dateOfBirth: createProfileDto.dateOfBirth ? new Date(createProfileDto.dateOfBirth) : null,
      });

      const savedProfile = await this.profileRepository.save(profile);
      return this.mapToResponseDto(savedProfile);
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

  async getProfileByUserId(userId: number): Promise<ProfileResponseDto> {
    try {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const profile = await this.profileRepository.findOne({ 
        where: { userId },
        relations: ['user']
      });

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      return this.mapToResponseDto(profile);
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

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<ProfileResponseDto> {
    try {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      // Update profile
      const updateData = {
        ...updateProfileDto,
        dateOfBirth: updateProfileDto.dateOfBirth ? new Date(updateProfileDto.dateOfBirth) : profile.dateOfBirth,
      };

      await this.profileRepository.update(profile.id, updateData);
      const updatedProfile = await this.profileRepository.findOne({ where: { id: profile.id } });

      return this.mapToResponseDto(updatedProfile);
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

  async deleteProfile(userId: number): Promise<{ message: string }> {
    try {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      await this.profileRepository.delete(profile.id);

      return { message: 'Profile deleted successfully' };
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

  // Utility methods
  async getAllProfiles(): Promise<ProfileResponseDto[]> {
    try {
      const profiles = await this.profileRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });

      return profiles.map(profile => this.mapToResponseDto(profile));
    } catch (error) {
      throw new HttpException(
        'Failed to fetch profiles',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getProfilesByCity(city: string): Promise<ProfileResponseDto[]> {
    try {
      const profiles = await this.profileRepository.find({
        where: { city },
        relations: ['user'],
        order: { createdAt: 'DESC' }
      });

      return profiles.map(profile => this.mapToResponseDto(profile));
    } catch (error) {
      throw new HttpException(
        'Failed to fetch profiles by city',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private mapToResponseDto(profile: Profile): ProfileResponseDto {
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      bio: profile.bio,
      profilePicture: profile.profilePicture,
      occupation: profile.occupation,
      emergencyContact: profile.emergencyContact,
      emergencyPhone: profile.emergencyPhone,
      address: profile.address,
      city: profile.city,
      zipCode: profile.zipCode,
      userId: profile.userId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
