import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';

export interface User {
  id: number;
  name: string;
  email: string;
  nid: string;
  nidImagePath?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserService {
  private users: User[] = [];
  private currentId = 1;

  async registerUser(createUserDto: CreateUserDto, nidImage: Express.Multer.File): Promise<User> {
    // Check if email already exists
    const existingUser = this.users.find(user => user.email === createUserDto.email);
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    // Check if NID already exists
    const existingNID = this.users.find(user => user.nid === createUserDto.nid);
    if (existingNID) {
      throw new HttpException('NID number already exists', HttpStatus.CONFLICT);
    }

    const newUser: User = {
      id: this.currentId++,
      name: createUserDto.name,
      email: createUserDto.email,
      nid: createUserDto.nid,
      nidImagePath: nidImage.path, // File path where image is stored
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    
    // Return user without sensitive data if needed
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: number): Promise<User | null> {
    const user = this.users.find(user => user.id === id);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(user => user.email === email);
    return user || null;
  }

  async findByNID(nid: string): Promise<User | null> {
    const user = this.users.find(user => user.nid === nid);
    return user || null;
  }

  async getUserStats(): Promise<{ total: number; recentUsers: number }> {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentUsers = this.users.filter(user => user.createdAt >= oneWeekAgo).length;
    
    return {
      total: this.users.length,
      recentUsers,
    };
  }
}
