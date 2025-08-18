import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // First check if user is logged in
    if (!request.session || !request.session.user) {
      throw new UnauthorizedException('Please login first');
    }
    
    // Check if user is admin
    if (request.session.user.role !== 'admin') {
      throw new ForbiddenException('Only admins can access this resource');
    }
    
    request.user = request.session.user;
    return true;
  }
}
