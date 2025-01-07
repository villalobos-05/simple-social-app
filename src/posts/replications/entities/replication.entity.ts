import { Replications } from '@prisma/client';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class Replication implements Replications {
  @IsNumber()
  publicationId: number;

  @IsNumber()
  userId: number;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  text: string;

  createdAt: Date;
}
