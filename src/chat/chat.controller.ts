import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'src/core/auth/entities/request.entity';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':id')
  async getConversation(
    @Req() request: Request,
    @Param('id', ParseIntPipe) receiverId: number
  ) {
    return await this.chatService.findConversation(request.user.sub, receiverId);
  }
}
