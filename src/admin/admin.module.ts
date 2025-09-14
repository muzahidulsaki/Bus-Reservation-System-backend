import { AdminController } from './admin.controller';
import { DepartmentController } from './department.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { DepartmentService } from './department.service';
import { AdminAuthService } from './auth/admin-auth.service';
import { AdminSessionGuard } from './guards/admin-session.guard';
import { Admin } from './admin.entity';
import { Department } from './entities/department.entity';
import { User } from '../user/user.entity';
import { MailModule } from '../mail/mail.module';
import { PusherModule } from '../pusher/pusher.module';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Department, User]),
    MailModule,
    PusherModule,
  ],
  controllers: [AdminController, DepartmentController],
  providers: [AdminService, DepartmentService, AdminAuthService, AdminSessionGuard],
  exports: [AdminService, DepartmentService, AdminAuthService, AdminSessionGuard],
})
export class AdminModule {}