import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Follower as FollowersDto } from './entities/follower.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class FollowersService {
  constructor(private prismaService: PrismaService) {}

  async follow(followDto: FollowersDto) {
    try {
      return await this.prismaService.followers.create({
        data: followDto,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async unfollow(unfollowDto: FollowersDto) {
    try {
      return await this.prismaService.followers.delete({
        where: { followingId_followedById: unfollowDto },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getFollowers(userId: number) {
    const followers = await this.prismaService.followers.findMany({
      where: { followingId: userId },
      select: {
        followedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return followers.map((follower) => follower.followedBy);
  }

  async getFollowing(userId: number) {
    const followers = await this.prismaService.followers.findMany({
      where: { followedById: userId },
      select: {
        following: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return followers.map((follower) => follower.following);
  }

  handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictException('Already following');
    }

    if (error.code === 'P2003' || error.code === 'P2025') {
      throw new BadRequestException(
        'User following or followed does not exist'
      );
    }

    if (error?.code) {
      throw new InternalServerErrorException({
        message: error.message,
        errorName: error.name,
        prismaCode: error.code,
      });
    }

    throw new BadRequestException('Could not follow or unfollow user');
  }
}
