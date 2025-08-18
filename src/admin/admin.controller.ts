import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
  DefaultValuePipe,
  UseGuards,
  Session,
  HttpException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FilterAdminDto } from './dto/filter-admin.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminService } from './admin.service';
import { AdminAuthService } from './auth/admin-auth.service';
import { AdminSessionGuard } from './guards/admin-session.guard';
 
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminAuthService: AdminAuthService,
  ) {}
 
  // ============ AUTH ROUTES (No Session Required) ============

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(
    @Body() loginDto: AdminLoginDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      const admin = await this.adminAuthService.login(loginDto);
      
      // Store admin in session
      session.user = admin;
      
      return {
        message: 'Admin login successful',
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
          department: admin.department,
          position: admin.position,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Admin login failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  @UseGuards(AdminSessionGuard)
  async logout(@Session() session: Record<string, any>) {
    session.destroy((err) => {
      if (err) {
        throw new HttpException(
          'Logout failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    
    return { message: 'Admin logout successful' };
  }

  @Get('profile')
  @UseGuards(AdminSessionGuard)
  async getProfile(@Session() session: Record<string, any>) {
    return {
      message: 'Admin profile retrieved successfully',
      admin: session.user,
    };
  }

  // ============ ADMIN CRUD ROUTES (Session Required) ============

  @Post('register')
  @UseGuards(AdminSessionGuard) // Only logged-in admins can create new admins
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  registerAdmin(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }
 
  @Patch(':id/status')
  @UseGuards(AdminSessionGuard)
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status: 'active' | 'inactive'
  ) {
    return this.adminService.changeStatus(id, status);
  }
 
  @Get('inactive')
  @UseGuards(AdminSessionGuard)
  getInactiveAdmins() {
    return this.adminService.getInactiveUsers();
  }
 
  @Get('older-than/:age')
  @UseGuards(AdminSessionGuard)
  getAdminsOlderThan(@Param('age', ParseIntPipe) age: number) {
    return this.adminService.getUsersOlderThan(age);
  }

  // GET /admin - Get all admins with filtering and pagination
  @Get()
  @UseGuards(AdminSessionGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getAllAdmins(@Query() filterDto: FilterAdminDto) {
    return this.adminService.getAllAdmins(filterDto);
  }

  // GET /admin/stats - Get admin statistics
  @Get('stats')
  @UseGuards(AdminSessionGuard)
  getAdminStats() {
    return this.adminService.getAdminStats();
  }

  // GET /admin/recent - Get recent admins
  @Get('recent')
  @UseGuards(AdminSessionGuard)
  getRecentAdmins(
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number
  ) {
    return this.adminService.getRecentAdmins(days);
  }

  // GET /admin/:id - Get admin by ID
  @Get(':id')
  @UseGuards(AdminSessionGuard)
  getAdminById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getAdminById(id);
  }

  // PUT /admin/:id - Complete update of admin
  @Put(':id')
  @UseGuards(AdminSessionGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAdminDto
  ) {
    return this.adminService.updateAdmin(id, updateDto);
  }

  // PATCH /admin/:id - Partial update of admin
  @Patch(':id')
  @UseGuards(AdminSessionGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  patchAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<UpdateAdminDto>
  ) {
    return this.adminService.patchAdmin(id, updateDto);
  }

  // DELETE /admin/:id - Delete admin
  @Delete(':id')
  @UseGuards(AdminSessionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteAdmin(id);
  }
}