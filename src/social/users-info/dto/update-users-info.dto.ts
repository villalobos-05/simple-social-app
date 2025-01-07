import { OmitType } from '@nestjs/mapped-types';
import { UserInfo } from '../entities/users-info.entity';

export class UpdateUsersInfoDto extends OmitType(UserInfo, [
  'userId',
  'createdAt',
  'updatedAt',
]) {}
