import { UserMessages } from '@prisma/client';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class Message implements UserMessages {
  messageId: number;

  @IsNumber()
  senderId: number;

  @IsNumber()
  receiverId: number;

  @IsString()
  @MaxLength(300)
  @MinLength(1)
  content: string;

  createdAt: Date;
}
