// src/users/bus-owner/bus-owner.module.ts
import { Module } from '@nestjs/common';
import { BusOwnerController } from './bus_owner.controller';
import { BusOwnerService } from './bus_owner.service';

@Module({
  controllers: [BusOwnerController],
  providers: [BusOwnerService],
})
export class BusOwnerModule {}
