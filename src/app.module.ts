import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { SocialModule } from './social/social.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    CoreModule,
    PostsModule,
    SocialModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
  ],
  controllers: [],
})
export class AppModule {}
