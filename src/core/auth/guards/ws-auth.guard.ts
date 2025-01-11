import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient() as Socket;

    const token = this.extractTokenFromHeader(
      client.handshake.headers['authorization']
    );

    if (!token) throw new WsException('Unauthorized');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      client['user'] = payload;
    } catch {
      throw new WsException('User not authenticated');
    }

    return true;
  }

  extractTokenFromHeader(authHeader: string) {
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
