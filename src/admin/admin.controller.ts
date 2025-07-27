// src/users/admin/admin.controller.ts
import { Body, Controller, Post, ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admin')
export class AdminController {
  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  registerAdmin(@Body() dto: CreateAdminDto) {
    return {
      message: 'Admin registered successfully',
      data: dto
    };
  }
}
