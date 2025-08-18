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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
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
  registerUser(
    @Body() dto: CreateUserDto,
    @UploadedFile() nid_image: Express.Multer.File,
  ) {
    if (!nid_image) {
      throw new BadRequestException(
        'NID image is required and must be under 2MB',
      );
    }

    return this.userService.registerUser(dto, nid_image);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      const user = await this.authService.login(loginDto);
      
      // Store user in session
      session.user = user;
      
      return {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      };
    } catch (error) {
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
        loggedIn: true,
        user: session.user,
      };
    }
    return {
      loggedIn: false,
      message: 'No active session',
    };
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

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Session() session: Record<string, any>) {
    return new Promise((resolve, reject) => {
      session.destroy((err) => {
        if (err) {
          reject(new HttpException(
            'Logout failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ));
        } else {
          resolve({ message: 'Logout successful' });
        }
      });
    });
  }
}
