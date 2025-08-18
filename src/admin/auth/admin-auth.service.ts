import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from '../admin.service';
import * as bcrypt from 'bcrypt';
import { AdminLoginDto } from '../dto/admin-login.dto';

export interface AdminSessionUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
  department?: {
    id: number;
    name: string;
    building?: string;
    floor?: string;
  };
  position?: string;
}

@Injectable()
export class AdminAuthService {
  constructor(private readonly adminService: AdminService) {}

  async login(loginDto: AdminLoginDto): Promise<AdminSessionUser> {
    const { email, password } = loginDto;
    
    // Find admin by email with department relation
    const admin = await this.adminService.findByEmailWithDepartment(email);
    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if admin is active
    if (admin.status !== 'active') {
      throw new UnauthorizedException('Admin account is inactive');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    
    // Return admin session data
    return {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: 'admin',
      department: admin.department ? {
        id: admin.department.id,
        name: admin.department.name,
        building: admin.department.building,
        floor: admin.department.floor,
      } : undefined,
      position: admin.position,
    };
  }
}
