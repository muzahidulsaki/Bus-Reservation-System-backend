import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './/admin/admin.controller';
import { UserModule } from './user/user.module';
import { BusOwnerModule } from './bus_owner/bus_owner.module';
import { BusModule } from './bus/bus.module';
import { ProfileModule } from './profile/profile.module';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule, 
    BusOwnerModule, 
    BusModule,
    ProfileModule,
    BookingModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    })
  ],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}
