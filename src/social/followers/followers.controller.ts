import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { FollowersService } from './followers.service';
import { Request } from 'src/core/auth/entities/request.entity';
import { Public } from 'src/core/auth/decorators/public.decorator';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post('follow/:id')
  create(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    return this.followersService.follow({
      followedById: request.user.sub,
      followingId: id,
    });
  }

  @Delete('follow/:id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    return this.followersService.unfollow({
      followedById: request.user.sub,
      followingId: id,
    });
  }

  @Public()
  @Get('user-followers/:id')
  getFollowers(@Param('id', ParseIntPipe) id: number) {
    return this.followersService.getFollowers(id);
  }

  @Public()
  @Get('following-users/:id')
  getFollowing(@Param('id', ParseIntPipe) id: number) {
    return this.followersService.getFollowing(id);
  }
}
