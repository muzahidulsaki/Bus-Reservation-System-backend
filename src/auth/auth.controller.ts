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

  // These routes have been moved to UserController
  // for better organization: /user/login, /user/logout, /user/profile, etc.

  /* Moved to UserController:
  @Post('login')
  async login(...) { ... }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(...) { ... }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(...) { ... }

  @Get('admin-only')
  @UseGuards(AdminGuard)
  async adminOnly(...) { ... }

  @Get('check-session')
  async checkSession(...) { ... }
  */
}
