import { UserInfo as PrismaUserInfo } from '@prisma/client';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserInfo implements PrismaUserInfo {
  userId: number;
  createdAt: Date;
  updatedAt: Date;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  @MinLength(1)
  bio: string;

  @IsOptional()
  @IsString()
  @MaxLength(18)
  @MinLength(1)
  displayName: string;

  @IsOptional()
  @IsUrl()
  profilePictureUrl: string;

  @IsOptional()
  @IsUrl()
  bannerUrl: string;
}
