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
    // Check if user already exists
    const existingUser = await this.repo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Create user object with proper data types
    const user = this.repo.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
      phone: Number(dto.phone), // Convert string to number
      gender: dto.gender,
      nid: Number(dto.nid), // Convert string to number
      age: Number(dto.age), // Convert string to number
      nidImagePath: nid_image.path,
      role: 'user', // Default role
      status: 'active', // Default status
    });
    
    const savedUser = await this.repo.save(user);
    
    // Send welcome email (don't let email errors fail registration)
    let emailSent = false;
    try {
      await this.mailService.sendUserWelcomeEmail({
        email: savedUser.email,
        fullName: savedUser.fullName,
        phone: savedUser.phone ? savedUser.phone.toString() : undefined,
        gender: savedUser.gender,
      });
      console.log(`✅ Welcome email sent to ${savedUser.email}`);
      emailSent = true;
    } catch (error) {
      console.error(`❌ Failed to send welcome email to ${savedUser.email}:`, error.message);
      // Don't throw error - let registration continue
      emailSent = false;
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = savedUser;
    return {
      message: emailSent 
        ? 'User registration successful and welcome email sent'
        : 'User registration successful (email sending failed)',
      data: userWithoutPassword,
    };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.repo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid email or password');

    // Return complete user object for session
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
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
  async updateUser(id: number, updateData: any): Promise<User> {
    try {
      console.log('🔄 Updating user:', id, updateData);
      
      // Find user first
      const user = await this.repo.findOne({ where: { id } });
      
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      // Create properly typed update object
      const typedUpdateData: Partial<User> = {};
      
      if (updateData.fullName) typedUpdateData.fullName = updateData.fullName;
      if (updateData.email) typedUpdateData.email = updateData.email;
      if (updateData.gender) typedUpdateData.gender = updateData.gender;
      
      // Convert phone to number if provided
      if (updateData.phone) {
        typedUpdateData.phone = typeof updateData.phone === 'string' 
          ? Number(updateData.phone) 
          : updateData.phone;
      }
      
      // Convert age to number if provided
      if (updateData.age) {
        typedUpdateData.age = typeof updateData.age === 'string' 
          ? Number(updateData.age) 
          : updateData.age;
      }
      
      // Update user data
      Object.assign(user, typedUpdateData);
      
      // Save updated user
      const savedUser = await this.repo.save(user);
      
      console.log('✅ User updated successfully:', savedUser);
      
      return savedUser;
      
    } catch (error) {
      console.error('❌ Update user error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }


  findAll() {
  // Implementation to return all users
  // Replace with your actual implementation
  return this.repo.find();
}
}
