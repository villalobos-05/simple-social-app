import { PickType } from '@nestjs/mapped-types';
import { Message } from '../entities/message.entity';

export class FindMessageDto extends PickType(Message, [
  'receiverId',
  'senderId',
] as const) {}
