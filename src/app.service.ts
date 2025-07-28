import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getphoto(): string {
    return 'All Photos';
  }
   getphotoservice(photoid:number): string {
    return 'Get the photo of id' + photoid;
  }
  createphoto(): string {
    return 'Create Photo';
  }
}
