import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RtInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Add jwt token payload to the request object, no matter if expired or not
    const request = context.switchToHttp().getRequest() as Request;
    try {
      request['user'] = this.jwtService.decode(
        request.headers.authorization.split(' ')[1]
      );
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }

    return next.handle();
  }
}
