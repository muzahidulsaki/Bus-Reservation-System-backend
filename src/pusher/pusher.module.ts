// src/pusher/pusher.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PusherService } from './pusher.service';
import { PusherController } from './pusher.controller';

@Module({
  imports: [ConfigModule],
  controllers: [PusherController],
  providers: [PusherService],
  exports: [PusherService],
})
export class PusherModule {}