import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { Admin } from './admin.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      // Check if department already exists
      const existingDepartment = await this.departmentRepository.findOne({
        where: { name: createDepartmentDto.name },
      });

      if (existingDepartment) {
        throw new BadRequestException('Department with this name already exists');
      }

      const department = this.departmentRepository.create(createDepartmentDto);
      const savedDepartment = await this.departmentRepository.save(department);

      return {
        message: 'Department created successfully',
        data: savedDepartment,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const departments = await this.departmentRepository.find({
        relations: ['admins'],
        order: { createdAt: 'DESC' },
      });

      return {
        message: 'Departments retrieved successfully',
        data: departments,
        total: departments.length,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch departments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id },
        relations: ['admins'],
      });

      if (!department) {
        throw new NotFoundException('Department not found');
      }

      return {
        message: 'Department retrieved successfully',
        data: department,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneWithAdmins(id: number) {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id },
        relations: ['admins'],
        select: {
          id: true,
          name: true,
          description: true,
          building: true,
          floor: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          admins: {
            id: true,
            fullName: true,
            email: true,
            position: true,
            status: true,
            age: true,
          },
        },
      });

      if (!department) {
        throw new NotFoundException('Department not found');
      }

      return {
        message: 'Department with admins retrieved successfully',
        data: department,
        adminCount: department.admins.length,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch department with admins',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    try {
      const department = await this.departmentRepository.findOne({ where: { id } });

      if (!department) {
        throw new NotFoundException('Department not found');
      }

      // Check if name already exists (if name is being updated)
      if (updateDepartmentDto.name && updateDepartmentDto.name !== department.name) {
        const existingDepartment = await this.departmentRepository.findOne({
          where: { name: updateDepartmentDto.name },
        });

        if (existingDepartment) {
          throw new BadRequestException('Department with this name already exists');
        }
      }

      await this.departmentRepository.update(id, updateDepartmentDto);
      const updatedDepartment = await this.departmentRepository.findOne({ where: { id } });

      return {
        message: 'Department updated successfully',
        data: updatedDepartment,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id },
        relations: ['admins'],
      });

      if (!department) {
        throw new NotFoundException('Department not found');
      }

      // Check if department has admins
      if (department.admins && department.admins.length > 0) {
        throw new BadRequestException(
          `Cannot delete department. It has ${department.admins.length} admin(s) assigned. Please reassign or remove admins first.`,
        );
      }

      await this.departmentRepository.remove(department);

      return {
        message: 'Department deleted successfully',
        deletedDepartment: {
          id: department.id,
          name: department.name,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDepartmentAdmins(id: number) {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id },
        relations: ['admins'],
        select: {
          id: true,
          name: true,
          admins: {
            id: true,
            fullName: true,
            email: true,
            position: true,
            status: true,
            age: true,
            phone: true,
            createdAt: true,
          },
        },
      });

      if (!department) {
        throw new NotFoundException('Department not found');
      }

      return {
        message: 'Department admins retrieved successfully',
        department: {
          id: department.id,
          name: department.name,
        },
        admins: department.admins,
        totalAdmins: department.admins.length,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch department admins',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getActiveDepartments() {
    try {
      const departments = await this.departmentRepository.find({
        where: { isActive: true },
        order: { name: 'ASC' },
      });

      return {
        message: 'Active departments retrieved successfully',
        data: departments,
        total: departments.length,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch active departments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
