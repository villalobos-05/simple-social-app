import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUsersInfoDto } from './dto/update-users-info.dto';

@Injectable()
export class UsersInfoService {
  constructor(private prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.users.findMany({
      select: { username: true, userInfo: true },
    });
  }

  findOne(uniqueInput: Prisma.UsersWhereUniqueInput) {
    return this.prismaService.users.findUnique({
      where: uniqueInput,
      select: { username: true, userInfo: true },
    });
  }

  update(id: number, updateUsersInfoDto: UpdateUsersInfoDto) {
    return this.prismaService.users.update({
      where: { id },
      data: {
        userInfo: {
          // If UserInfo exists update, if not create
          upsert: {
            update: updateUsersInfoDto,
            create: { ...updateUsersInfoDto },
          },
        },
      },
      select: { username: true, userInfo: true },
    });
  }
}
