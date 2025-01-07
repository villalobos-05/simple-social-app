import { PickType } from '@nestjs/mapped-types';
import { User } from 'src/core/users/entities/user.entity';

export class SignInDto extends PickType(User, [
  'username',
  'password',
] as const) {}
