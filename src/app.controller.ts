import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
   @Get('photo')
  getphoto(): string {
    return this.appService.getphoto();
  }

  @Get('photo/:id')
  getphotoservice(@Param('id') photoid:number): string {
    return this.appService.getphotoservice(photoid);
  }
  @Post('pic')
  createphoto(): string {
    return this.appService.createphoto();
  }
}
