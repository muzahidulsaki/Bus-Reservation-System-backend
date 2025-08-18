import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Check if user is logged in (session exists)
    if (request.session && request.session.user) {
      // Add user info to request object for later use
      request.user = request.session.user;
      return true;
    }
    
    throw new UnauthorizedException('Please login to access this resource');
  }
}
