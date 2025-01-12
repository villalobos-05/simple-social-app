import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [PrismaModule],
})
export class ChatModule {}
