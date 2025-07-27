// src/users/bus-owner/bus-owner.controller.ts
import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { CreateBusOwnerDto } from './dto/bus_owner.dto';
import { BusOwnerService } from './bus_owner.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('bus-owner')
export class BusOwnerController {
  constructor(private readonly busOwnerService: BusOwnerService) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          cb(new BadRequestException('Only PDF files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  register(
    @Body() dto: CreateBusOwnerDto,
    @UploadedFile() document: Express.Multer.File,
  ) {
    if (!document) {
      throw new BadRequestException('PDF document is required');
    }

    return this.busOwnerService.register(dto, document);
  }
}
