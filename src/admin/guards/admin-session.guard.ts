import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminSessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Check if user is logged in
    if (!request.session || !request.session.user) {
      throw new UnauthorizedException('Please login to access admin resources');
    }
    
    // Check if user is admin
    if (request.session.user.role !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }
    
    // Add admin info to request object
    request.admin = request.session.user;
    return true;
  }
}
