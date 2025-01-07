import { OmitType } from '@nestjs/mapped-types';
import { Replication } from '../entities/replication.entity';

export class CreateReplicationDto extends OmitType(Replication, [
  'createdAt',
] as const) {}
