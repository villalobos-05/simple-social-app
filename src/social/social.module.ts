import { Module } from '@nestjs/common';
import { UsersInfoModule } from './users-info/users-info.module';
import { FollowersModule } from './followers/followers.module';

@Module({
  imports: [UsersInfoModule, FollowersModule],
})
export class SocialModule {}
