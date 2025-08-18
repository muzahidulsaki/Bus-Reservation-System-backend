import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Like } from 'typeorm';
import { Admin } from './admin.entity';
import { Department } from './entities/department.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FilterAdminDto } from './dto/filter-admin.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
 
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    private readonly mailService: MailService,
  ) {}
 
  async create(dto: CreateAdminDto) {
    // Check if admin already exists
    const existingAdmin = await this.adminRepository.findOne({ 
      where: { email: dto.email } 
    });
    
    if (existingAdmin) {
      throw new BadRequestException('Admin with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Remove department string field if exists, use departmentId instead
    const { department, ...adminData } = dto;
    
    const admin = this.adminRepository.create({
      ...adminData,
      password: hashedPassword,
    });
    
    const savedAdmin = await this.adminRepository.save(admin);

    // Get admin with department relation for email
    const adminWithDepartment = await this.adminRepository.findOne({
      where: { id: savedAdmin.id },
      relations: ['department'],
    });

    // Send welcome email
    try {
      const emailResult = await this.mailService.sendAdminWelcomeEmail({
        email: adminWithDepartment.email,
        fullName: adminWithDepartment.fullName,
        position: adminWithDepartment.position,
        department: adminWithDepartment.department ? {
          name: adminWithDepartment.department.name,
          building: adminWithDepartment.department.building,
        } : undefined,
      });

      console.log('Admin welcome email result:', emailResult);
    } catch (emailError) {
      console.error('Failed to send admin welcome email:', emailError);
      // Don't throw error - admin creation should succeed even if email fails
    }
    
    const { password, ...result } = savedAdmin;
    return { 
      message: 'Admin created successfully and welcome email sent', 
      data: result 
    };
  }
 
  async changeStatus(id: number, newStatus: 'active' | 'inactive') {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      return { message: 'Admin not found' };
    }
 
    admin.status = newStatus;
    await this.adminRepository.save(admin);
    return { message: `Status changed to ${newStatus}`, admin };
  }
 
  async getInactiveUsers() {
    return this.adminRepository.find({ where: { status: 'inactive' } });
  }
 
  async getUsersOlderThan(age: number) {
    return this.adminRepository.find({ where: { age: MoreThan(age) } });
  }

  // Find admin by email for authentication
  async findByEmail(email: string): Promise<Admin | null> {
    try {
      return await this.adminRepository.findOne({
        where: { email },
      });
    } catch (error) {
      throw new BadRequestException('Database error occurred');
    }
  }

  // Find admin by email with department relation for authentication
  async findByEmailWithDepartment(email: string): Promise<Admin | null> {
    try {
      return await this.adminRepository.findOne({
        where: { email },
        relations: ['department'],
      });
    } catch (error) {
      throw new BadRequestException('Database error occurred');
    }
  }

  // GET all admins with pagination and filtering
  async getAllAdmins(filterDto: FilterAdminDto) {
    const { page, limit, status, department, position } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.adminRepository.createQueryBuilder('admin')
      .leftJoinAndSelect('admin.department', 'department');
    
    if (status) {
      queryBuilder.andWhere('admin.status = :status', { status });
    }
    
    if (department) {
      queryBuilder.andWhere('department.name LIKE :department', { 
        department: `%${department}%` 
      });
    }
    
    if (position) {
      queryBuilder.andWhere('admin.position LIKE :position', { 
        position: `%${position}%` 
      });
    }

    const [admins, total] = await queryBuilder
      .select([
        'admin.id', 'admin.fullName', 'admin.email', 'admin.age', 
        'admin.status', 'admin.position', 'admin.departmentId', 'admin.createdAt',
        'department.id', 'department.name', 'department.building', 'department.floor'
      ])
      .skip(skip)
      .take(limit)
      .orderBy('admin.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: admins,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // GET admin by ID
  async getAdminById(id: number) {
    const admin = await this.adminRepository.findOne({ 
      where: { id },
      relations: ['department'],
      select: {
        id: true,
        fullName: true,
        email: true,
        age: true,
        status: true,
        gender: true,
        phone: true,
        position: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
        department: {
          id: true,
          name: true,
          building: true,
          floor: true,
        },
      },
    });
    
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    
    return admin;
  }

  // PUT - Complete update of admin
  async updateAdmin(id: number, updateDto: UpdateAdminDto) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Check email uniqueness if email is being updated
    if (updateDto.email && updateDto.email !== admin.email) {
      const existingAdmin = await this.adminRepository.findOne({ 
        where: { email: updateDto.email } 
      });
      
      if (existingAdmin) {
        throw new BadRequestException('Email already in use');
      }
    }

    Object.assign(admin, updateDto);
    await this.adminRepository.save(admin);
    
    const { password, ...result } = admin;
    return { message: 'Admin updated successfully', data: result };
  }

  // PATCH - Partial update of admin
  async patchAdmin(id: number, updateDto: Partial<UpdateAdminDto>) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Check email uniqueness if email is being updated
    if (updateDto.email && updateDto.email !== admin.email) {
      const existingAdmin = await this.adminRepository.findOne({ 
        where: { email: updateDto.email } 
      });
      
      if (existingAdmin) {
        throw new BadRequestException('Email already in use');
      }
    }

    // Update using Object.assign to avoid TypeORM type issues
    Object.assign(admin, updateDto);
    await this.adminRepository.save(admin);
    
    const updatedAdmin = await this.getAdminById(id);
    
    return { message: 'Admin partially updated', data: updatedAdmin };
  }

  // DELETE admin
  async deleteAdmin(id: number) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    await this.adminRepository.remove(admin);
    return { message: 'Admin deleted successfully' };
  }

  // GET admin statistics
  async getAdminStats() {
    const totalAdmins = await this.adminRepository.count();
    const activeAdmins = await this.adminRepository.count({ 
      where: { status: 'active' } 
    });
    const inactiveAdmins = await this.adminRepository.count({ 
      where: { status: 'inactive' } 
    });

    const departmentStats = await this.adminRepository
      .createQueryBuilder('admin')
      .select('admin.department', 'department')
      .addSelect('COUNT(*)', 'count')
      .where('admin.department IS NOT NULL')
      .groupBy('admin.department')
      .getRawMany();

    return {
      totalAdmins,
      activeAdmins,
      inactiveAdmins,
      departmentStats,
    };
  }

  // GET recent admins
  async getRecentAdmins(days: number = 7) {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    return this.adminRepository.find({
      where: {
        createdAt: MoreThan(dateFrom),
      },
      order: { createdAt: 'DESC' },
      select: ['id', 'fullName', 'email', 'department', 'position', 'createdAt'],
    });
  }
}