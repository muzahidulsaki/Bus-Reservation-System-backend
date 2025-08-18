// src/users/user.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async registerUser(dto: CreateUserDto, nid_image: Express.Multer.File) {
    const existingUser = await this.repo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({
      ...dto,
      phone: Number(dto.phone),
      nid: dto.nid ? Number(dto.nid) : null,
      password: hashedPassword,
      nidImagePath: nid_image.path,
    });
    
    const savedUser = await this.repo.save(user);
    
    // Send welcome email with new beautiful design
    try {
      const emailResult = await this.mailService.sendUserWelcomeEmail({
        email: savedUser.email,
        fullName: savedUser.fullName,
        phone: savedUser.phone ? savedUser.phone.toString() : undefined,
        gender: savedUser.gender,
      });

      console.log('User welcome email result:', emailResult);
    } catch (error) {
      console.error(`❌ Failed to send welcome email to ${savedUser.email}:`, error.message);
    }
    
    return savedUser;
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.repo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid email');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Wrong password');

    return { message: 'Login success', userId: user.id };
  }

  async getUserById(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getAllUsers() {
    return this.repo.find();
  }

async updatePhone(id: number, phone: number) {
  const user = await this.repo.findOne({ where: { id } });
  if (!user) throw new NotFoundException('User not found');

  user.phone = phone;

  const updatedUser = await this.repo.save(user);
  return {
    message: 'Phone number updated successfully',
    user: updatedUser,
  };
}
  async updateUserFull(id: number, dto: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async updateUserPartial(id: number, dto: Partial<User>) {
    return this.updateUserFull(id, dto); // same logic
  }

  async deleteUser(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }

  async findNullFullNames() {
    return this.repo.find({ where: 
      [
        { fullName: IsNull() } ,
        { fullName: '' },
      ],
      });
  }

  // src/users/user/user.service.ts

async updateStatus(id: number, status: 'active' | 'inactive') {
  const user = await this.repo.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (!['active', 'inactive'].includes(status)) {
    throw new BadRequestException('Status must be either active or inactive');
  }

  user.status = status;
  return this.repo.save(user);
}

  // PUT method - Complete user profile update
  async updateUser(id: number, updateDto: any) {
    try {
      // Check if user exists
      const user = await this.repo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if email is being updated and if it already exists
      if (updateDto.email && updateDto.email !== user.email) {
        const existingUser = await this.repo.findOne({ 
          where: { email: updateDto.email } 
        });
        if (existingUser) {
          throw new BadRequestException('Email already exists');
        }
      }

      // Hash password if it's being updated
      if (updateDto.password) {
        updateDto.password = await bcrypt.hash(updateDto.password, 10);
      }

      // Convert phone to number if provided
      if (updateDto.phone) {
        updateDto.phone = Number(updateDto.phone);
      }

      // Convert nid to number if provided
      if (updateDto.nid) {
        updateDto.nid = Number(updateDto.nid);
      }

      // Update user with new data
      Object.assign(user, updateDto);
      const updatedUser = await this.repo.save(user);

      // Remove password from response
      const { password, ...result } = updatedUser;
      
      return {
        message: 'User profile updated successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user profile');
    }
  }


  findAll() {
  // Implementation to return all users
  // Replace with your actual implementation
  return this.repo.find();
}
}
