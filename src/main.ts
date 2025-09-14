import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ CORS Configuration
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000', 'http://localhost:5000'], // Add your frontend ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  });
  
  // Session Configuration
  app.use(
    session({
      secret: 'bus-reservation-secret-key-2024', // Change this in production
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax', // Important for cross-origin requests
      },
    }),
  );
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  
  await app.listen(8080);
  console.log('🚌 Bus Reservation System running on http://localhost:8080');
}
bootstrap();
