import { PickType } from '@nestjs/mapped-types';
import { ReactPublication } from '../entities/reactPublication.entity';

export class LikePublicationDto extends PickType(ReactPublication, [
  'publicationId',
  'userId',
]) {}

export class ReplicateDto extends PickType(ReactPublication, [
  'userId',
  'publicationId',
  'text',
]) {}

export class UnReplicateDto extends PickType(ReplicateDto, [
  'userId',
  'publicationId',
]) {}
