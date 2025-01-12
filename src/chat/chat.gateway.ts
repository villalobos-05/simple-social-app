import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
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
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { WsBadRequestFilter } from 'src/common/filters/ws-bad-request-exception.filter';

@UseGuards(WsAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true }))
@UseFilters(WsBadRequestFilter)
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private jwtService: JwtService,
    private chatService: ChatService
  ) {}

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
  async handleEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() sendMessageDto: SendMessageDto
  ) {
    await this.sendMessageToUser({
      senderId: client['user']['sub'],
      ...sendMessageDto,
    });
  }

  async sendMessageToUser(createMessageDto: CreateMessageDto) {
    await this.chatService.createMessage(createMessageDto);

    const socketId = this.userSocketMap.get(createMessageDto.receiverId);

    if (socketId) {
      this.server.to(socketId).emit('messageToUser', createMessageDto.content);
    } else {
      console.log(`User with id ${createMessageDto.receiverId} not connected!`);
    }
  }
}
