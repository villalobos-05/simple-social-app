import { Module } from '@nestjs/common';
import { PublicationsModule } from './publications/publications.module';
import { ReplicationsModule } from './replications/replications.module';

@Module({
  imports: [PublicationsModule, ReplicationsModule],
})
export class PostsModule {}
