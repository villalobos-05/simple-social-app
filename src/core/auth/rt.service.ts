import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RtService {
  constructor(private prismaService: PrismaService) {}

  async createRt(userId: number, rt: string): Promise<Users> {
    return this.prismaService.users.update({
      where: { id: userId },
      data: { refreshToken: rt },
    });
  }

  async updateRt(userId: number, rt: string): Promise<Users> {
    return this.prismaService.users.update({
      where: { id: userId },
      data: { refreshToken: rt },
    });
  }

  async revokeRt(userId: number): Promise<Users> {
    return this.prismaService.users.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async validateRt(userId: number, rt: string): Promise<boolean> {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });
    return user.refreshToken === rt;
  }
}
