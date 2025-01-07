import { Followers } from '@prisma/client';

export class Follower implements Followers {
  followingId: number;
  followedById: number;
}
