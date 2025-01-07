import { Module } from '@nestjs/common';
import { ReplicationsService } from './replications.service';
import { ReplicationsController } from './replications.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PublicationsModule } from '../publications/publications.module';

@Module({
  imports: [PrismaModule, PublicationsModule],
  controllers: [ReplicationsController],
  providers: [ReplicationsService],
  exports: [ReplicationsService],
})
export class ReplicationsModule {}
