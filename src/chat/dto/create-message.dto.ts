import { OmitType } from '@nestjs/mapped-types';
import { Message } from '../entities/message.entity';

export class CreateMessageDto extends OmitType(Message, [
  'messageId',
  'createdAt',
] as const) {}
