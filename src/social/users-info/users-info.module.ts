import { Module } from '@nestjs/common';
import { UsersInfoService } from './users-info.service';
import { UsersInfoController } from './users-info.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersInfoController],
  providers: [UsersInfoService],
})
export class UsersInfoModule {}
