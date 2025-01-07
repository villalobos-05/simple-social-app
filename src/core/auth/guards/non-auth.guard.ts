import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class NonAuthGuard implements CanActivate {
  // This guard prevents authenticated users from accessing non-available routes
  // from loogged in users such as login and register routes
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    if (request.headers?.authorization)
      throw new ForbiddenException('You are already logged in');

    return true;
  }
}
