import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { JwtPayload } from '../entities/payload.entity';

export interface AuthSocket extends Socket {
  user: JwtPayload;
}

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => void;

export const WSAuthMiddleware = (jwtService: JwtService): SocketMiddleware => {
  return async (socket: AuthSocket, next) => {
    const token = extractTokenFromHeader(
      socket?.handshake.headers?.authorization
    );

    if (!token) {
      next({
        name: 'Unauthorizaed',
        message: 'Unauthorizaed',
      });
    }

    try {
      const jwtPayload: JwtPayload = await jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      socket.user = jwtPayload;
      next();
    } catch {
      next({
        name: 'Unauthorizaed',
        message: 'Unauthorizaed',
      });
    }
  };
};

function extractTokenFromHeader(authHeader: string) {
  const [type, token] = authHeader?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
