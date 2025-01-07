import { PickType } from '@nestjs/mapped-types';
import { Replication } from '../entities/replication.entity';

export class DeleteReplicationDto extends PickType(Replication, [
  'userId',
  'publicationId',
] as const) {}
