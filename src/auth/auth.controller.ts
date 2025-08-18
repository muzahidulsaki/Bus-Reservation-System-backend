import {
  Controller,
  Post,
  Body,
  Session,
  HttpStatus,
  HttpException,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SessionUser } from './dto/auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Get('profile')
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
}
