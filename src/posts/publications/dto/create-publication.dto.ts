import { OmitType } from '@nestjs/mapped-types';
import { Publication } from '../entities/publication.entity';

export class CreatePublicationDto extends OmitType(Publication, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
