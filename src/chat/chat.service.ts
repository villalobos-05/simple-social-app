import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { FindMessageDto } from './dto/find-message.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    try {
      await this.prismaService.userMessages.create({
        data: createMessageDto,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findMessages(findMessageDto: FindMessageDto) {
    await this.prismaService.userMessages.findMany({
      where: findMessageDto,
    });
  }

  async findConversation(userId1: number, userId2: number) {
    const messagesUser1 = await this.findMessages({
      senderId: userId1,
      receiverId: userId2,
    });

    const messagesUser2 = await this.findMessages({
      senderId: userId2,
      receiverId: userId1,
    });

    console.log(messagesUser1, messagesUser2);
  }

  handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2003' || error.code === 'P2025') {
      throw new BadRequestException('User or message not found!');
    }

    if (error?.code) {
      throw new InternalServerErrorException({
        message: error.message,
        errorName: error.name,
        prismaCode: error.code,
      });
    }
  }
}
