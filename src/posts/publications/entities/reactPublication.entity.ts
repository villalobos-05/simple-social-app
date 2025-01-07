import { IsNumber, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Replication } from 'src/posts/replications/entities/replication.entity';

export class ReactPublication implements Replication {
  @IsOptional()
  @MaxLength(255)
  @MinLength(1)
  text: string | null;

  @IsNumber()
  publicationId: number;

  @IsNumber()
  userId: number;

  createdAt: Date;
}
