// src/users/user/user.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Session,
  HttpStatus,
  HttpException,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/auth.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('user')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

   @Post('register')
  @UseInterceptors(
    FileInterceptor('nid_image', {
      storage: diskStorage({
        destination: './uploads/nid_images',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Only image files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async registerUser(
    @Body() dto: CreateUserDto,
    @UploadedFile() nid_image: Express.Multer.File,
  ) {
    try {
      if (!nid_image) {
        throw new BadRequestException(
          'NID image is required and must be under 2MB',
        );
      }

      // ✅ Process form data properly
      console.log('Registration Data:', dto);
      console.log('Uploaded File:', nid_image);

      const result = await this.userService.registerUser(dto, nid_image);
      
      // ✅ Ensure response is properly structured
      return {
        statusCode: 201,
        message: result.message,
        data: result.data,
        success: true,
      };
      
    } catch (error) {
      console.error('Registration Error:', error);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new HttpException(
        error.message || 'Registration failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      console.log('🔐 Login attempt for email:', loginDto.email);
      
      const user = await this.authService.login(loginDto);
      
      // Store user in session
      session.user = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
      };
      
      console.log('✅ Login successful for:', user.email);
      
      return {
        statusCode: 200,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          status: user.status,
        },
        success: true,
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Login failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Specific routes MUST come before dynamic routes
  @Get('null-names')
  findNullFullNames() {
    return this.userService.findNullFullNames();
  }

  @Get('my-profile')
  @UseGuards(AuthGuard)
  async getProfile(@Session() session: Record<string, any>) {
    return {
      message: 'Profile retrieved successfully',
      user: session.user,
    };
  }

  @Get('admin-only')
  @UseGuards(AdminGuard)
  async adminOnly() {
    return {
      message: 'This is admin-only content!',
      data: 'Secret admin data here...',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('check-session')
  async checkSession(@Session() session: Record<string, any>) {
    if (session.user) {
      return {
        isLoggedIn: true,
        user: session.user,
      };
    }
    return {
      isLoggedIn: false,
      message: 'No active session',
    };
  }

  @Get('dashboard')
  async getUserDashboard(@Session() session: Record<string, any>) {
    if (!session.user) {
      throw new HttpException(
        'Please login to access dashboard',
        HttpStatus.UNAUTHORIZED,
      );
    }
    
    try {
      // Get user details from database
      const user = await this.userService.getUserById(session.user.id);
      
      return {
        message: 'Dashboard data retrieved successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          age: user.age,
          gender: user.gender,
          status: user.status,
        },
        dashboardData: {
          totalBookings: 0, // Can be implemented later
          recentBookings: [], // Can be implemented later
          lastLoginTime: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to load dashboard',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  async logout(@Session() session: Record<string, any>) {
    try {
      const userEmail = session.user?.email;
      
      session.destroy((err) => {
        if (err) {
          console.error('❌ Session destroy error:', err);
        } else {
          console.log('✅ User logged out:', userEmail);
        }
      });
      
      return {
        statusCode: 200,
        message: 'Logout successful',
        success: true,
      };
    } catch (error) {
      throw new HttpException(
        'Logout failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Dynamic routes MUST come after specific routes
   @Patch(':id/phone')
  updatePhone(@Param('id', ParseIntPipe) id: number, @Body('phone') phone: number) {
    return this.userService.updatePhone(id, phone);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'active' | 'inactive',
  ) {
    return this.userService.updateStatus(id, status);
  }

  // PUT route for complete user profile update
  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  // Session-based profile update
  @Put('my-profile/update')
  async updateMyProfile(
    @Req() req: any,
    @Body() updateData: {
      fullName?: string;
      email?: string;
      phone?: string;
      age?: number;
      gender?: string;
    }
  ) {
    try {
      console.log('📝 Profile update request:', updateData);
      console.log('👤 Session user:', req.session.user);
      
      if (!req.session.user) {
        return {
          success: false,
          message: 'Please login to update profile'
        };
      }

      const userId = req.session.user.id;
      
      // Update user profile
      const updatedUser = await this.userService.updateUser(userId, updateData);
      
      // Update session data
      req.session.user = {
        ...req.session.user,
        ...updatedUser
      };
      
      console.log('✅ Profile updated successfully:', updatedUser);
      
      return {
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser
      };
      
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      };
    }
  }
}
