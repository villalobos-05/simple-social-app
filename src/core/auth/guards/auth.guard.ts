import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { extractTokenFromHeader } from '../utils/extractToken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector // a reflector is a utility that can be used to retrieve metadata from a class
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // This is how we can use the Public decorator to allow access to a route without a token
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      // these parameters are used to identify the metadata
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest() as Request;
    const token = extractTokenFromHeader(request.headers?.authorization);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      request['user'] = payload; // so we can access the user in the controller
    } catch {
      throw new UnauthorizedException('User not authenticated');
    }

    return true;
  }
}
