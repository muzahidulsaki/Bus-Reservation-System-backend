import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { AdminSessionGuard } from './guards/admin-session.guard';

@Controller('admin/departments')
@UseGuards(AdminSessionGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  // Route 1: POST /admin/departments - Create department
  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    try {
      return await this.departmentService.create(createDepartmentDto);
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

  // Route 2: GET /admin/departments - Get all departments
  @Get()
  async findAll() {
    try {
      return await this.departmentService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch departments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Route 3: GET /admin/departments/active - Get active departments
  @Get('active')
  async getActiveDepartments() {
    try {
      return await this.departmentService.getActiveDepartments();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch active departments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Route 4: GET /admin/departments/:id - Get department with admins
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.departmentService.findOneWithAdmins(id);
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

  // Route 5: PATCH /admin/departments/:id - Update department
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    try {
      return await this.departmentService.update(id, updateDepartmentDto);
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

  // Route 6: DELETE /admin/departments/:id - Delete department
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.departmentService.remove(id);
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

  // Route 7: GET /admin/departments/:id/admins - Get department admins
  @Get(':id/admins')
  async getDepartmentAdmins(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.departmentService.getDepartmentAdmins(id);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch department admins',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
