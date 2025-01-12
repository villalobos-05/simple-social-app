import { OmitType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';

export class SendMessageDto extends OmitType(CreateMessageDto, [
  'senderId',
] as const) {}
