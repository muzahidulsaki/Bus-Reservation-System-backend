// src/users/bus-owner/bus-owner.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class BusOwnerService {
  register(data: any, document: Express.Multer.File) {
    return {
      message: 'Bus Owner registered successfully',
      owner: data,
      pdf_path: document.path,
    };
  }
}
