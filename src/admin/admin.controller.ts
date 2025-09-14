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
import { AdminRegisterDto } from './dto/admin-register.dto';
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
      console.log('🔐 Admin login attempt:', loginDto.email);
      
      const admin = await this.adminAuthService.login(loginDto);
      
      // Store admin in session
      session.user = admin;
      
      console.log('✅ Admin login successful:', admin.fullName);
      
      return {
        message: 'Admin login successful',
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          position: admin.position,
          department: admin.department,
        },
      };
    } catch (error) {
      console.error('❌ Admin login error:', error.message);
      
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Admin login failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() registerDto: AdminRegisterDto) {
    try {
      console.log('🚀 Admin registration attempt:', registerDto.email);
      
      const admin = await this.adminService.registerAdmin(registerDto);
      
      console.log('✅ Admin registration successful:', admin.fullName);
      
      return {
        message: 'Admin registration successful',
        data: {
          id: admin.id,
          name: admin.fullName,
          email: admin.email,
          phone: admin.phone,
          position: admin.position,
        },
      };
    } catch (error) {
      console.error('❌ Admin registration error:', error.message);
      
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Admin registration failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  async logout(@Session() session: Record<string, any>) {
    try {
      const adminEmail = session.user?.email;
      
      session.destroy((err) => {
        if (err) {
          console.error('❌ Admin session destroy error:', err);
        } else {
          console.log('✅ Admin logged out:', adminEmail);
        }
      });
      
      return {
        statusCode: 200,
        message: 'Admin logout successful',
        success: true,
      };
    } catch (error) {
      throw new HttpException(
        'Admin logout failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('check-session')
  async checkSession(@Session() session: Record<string, any>) {
    if (session.user) {
      return {
        isLoggedIn: true,
        admin: session.user,
      };
    }
    return {
      isLoggedIn: false,
      message: 'No active admin session',
    };
  }

  @Get('dashboard')
  async getAdminDashboard(@Session() session: Record<string, any>) {
    if (!session.user) {
      throw new HttpException(
        'Please login to access admin dashboard',
        HttpStatus.UNAUTHORIZED,
      );
    }
    
    try {
      // Get admin details and statistics
      const adminStats = await this.adminService.getAdminDashboardStats();
      
      return {
        message: 'Admin dashboard data retrieved successfully',
        admin: session.user,
        dashboardData: {
          totalUsers: adminStats.totalUsers,
          totalAdmins: adminStats.totalAdmins,
          recentUsers: adminStats.recentUsers,
          systemStats: adminStats.systemStats,
          lastLoginTime: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to load admin dashboard',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('users')
  async getAllUsers(@Session() session: Record<string, any>) {
    if (!session.user) {
      throw new HttpException(
        'Please login to access user data',
        HttpStatus.UNAUTHORIZED,
      );
    }
    
    try {
      const users = await this.adminService.getAllUsersForAdmin();
      
      return {
        message: 'Users retrieved successfully',
        users,
        total: users.length,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id', ParseIntPipe) userId: number,
    @Body('status') status: 'active' | 'inactive',
    @Session() session: Record<string, any>,
  ) {
    if (!session.user) {
      throw new HttpException(
        'Please login to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    
    try {
      const result = await this.adminService.updateUserStatus(userId, status);
      
      console.log(`✅ Admin ${session.user.email} updated user ${userId} status to ${status}`);
      
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update user status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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