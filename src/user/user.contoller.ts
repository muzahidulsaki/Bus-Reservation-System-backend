// src/users/user/user.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  Body,
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
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
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
      throw new BadRequestException('NID image is required and must be under 2MB');
    }

    return this.userService.registerUser(dto, nid_image);
  }
}
