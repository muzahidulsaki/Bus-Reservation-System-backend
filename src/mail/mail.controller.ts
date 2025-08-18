import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send')
  async sendMail(
    @Query('email') email: string,
    @Query('subject') subject: string,
    @Query('text') text: string,
  ) {
    return this.mailService.sendMail(
      email,
      subject || 'Test Mail',
      text || 'This is a test mail from NestJS'
    );
  }
}
