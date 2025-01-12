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

  private userSocketMap = new Map<number, string>(); // userId->socketId

  @WebSocketServer()
  private server: Server;

  afterInit(server: Server) {
    server.use(WSAuthMiddleware(this.jwtService));
  }

  handleConnection(client: Socket) {
    this.userSocketMap.set(client['user']['sub'], client.id);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.userSocketMap.delete(client['user']['sub']);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: number; message: string }
  ) {
    this.sendMessageToUser(data?.receiverId, data?.message);
  }

  sendMessageToUser(receiverId: number, message: string) {
    const socketId = this.userSocketMap.get(receiverId);

    if (socketId) {
      this.server.to(socketId).emit('messageToUser', message);
    } else {
      console.log(`User with id ${receiverId} not connected!`);
    }
  }
}
