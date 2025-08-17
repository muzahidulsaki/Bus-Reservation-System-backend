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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  login(@Body() dto: { email: string; password: string }) {
    return this.userService.login(dto);
  }

   @Patch(':id/phone')
  updatePhone(@Param('id', ParseIntPipe) id: number, @Body('phone') phone: number) {
    return this.userService.updatePhone(id, phone);
  }

  @Get('null-names')
  findNullFullNames() {
    return this.userService.findNullFullNames();
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

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
