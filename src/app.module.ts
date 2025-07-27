import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './/admin/admin.controller';
import { UserModule } from './user/user.module';
import { BusOwnerModule } from './bus_owner/bus_owner.module';
import { dataSourceOptions } from 'db/data-source';


@Module({
  imports: [UserModule, BusOwnerModule],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}
