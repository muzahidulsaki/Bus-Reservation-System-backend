import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './/admin/admin.controller';
import { dataSourceOptions } from 'db/data-source';


@Module({
  imports: [],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}
