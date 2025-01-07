import { Publications } from '@prisma/client';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class Publication implements Publications {
  id: number;

  @IsNumber()
  userId: number;

  @IsString()
  @MaxLength(255)
  @MinLength(1)
  message: string;

  createdAt: Date;
  updatedAt: Date;

  @IsOptional()
  @IsNumber()
  parentPublicationId: number | null;
}
