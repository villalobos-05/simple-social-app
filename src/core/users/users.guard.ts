import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'src/core/auth/entities/request.entity';

@Injectable()
export class UsersGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // This guard assures only the user can manipulate his own data (unless it is an Admin)
    const request = context.switchToHttp().getRequest() as Request;

    if (request.user.role === 'ADMIN') return true;

    const loggedUserId = request?.user?.sub; // This is the user id from the JWT token
    const requestedUserId = request.params?.id;

    if (!loggedUserId || loggedUserId !== Number(requestedUserId)) {
      throw new UnauthorizedException('Cannot delete user');
    }

    return true;
  }
}
