import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/core/auth/guards/ws-auth.guard';
import { WSAuthMiddleware } from 'src/core/auth/middleware/ws-auth.middleware';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  private server: Server;

  afterInit(server: Server) {
    server.use(WSAuthMiddleware(this.jwtService));
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleEvent(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    client.broadcast.emit('messageServer', data);
  }
}
