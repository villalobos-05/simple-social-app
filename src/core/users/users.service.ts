import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Users } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Users[]> {
    return this.prismaService.users.findMany();
  }

  async findOne(
    userWhereUniqueInput: Prisma.UsersWhereUniqueInput
  ): Promise<Users | undefined> {
    const user = await this.prismaService.users.findUnique({
      where: userWhereUniqueInput,
    });

    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    try {
      return await this.prismaService.users.create({
        data: {
          ...createUserDto,
          password: await hash(createUserDto.password, 10),
          userInfo: { create: {} }, // Create UserInfo table with null values
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
      throw new BadRequestException('Could not create user');
    }
  }

  async update(
    userWhereUniqueInput: Prisma.UsersWhereUniqueInput,
    updateUserDto: UpdateUserDto
  ): Promise<Users> {
    try {
      const user = await this.prismaService.users.update({
        where: userWhereUniqueInput,
        data: updateUserDto,
      });

      if (!user) throw new NotFoundException(`User not found`);

      return user;
    } catch (error) {
      this.handlePrismaError(error);
      throw new HttpException('Could not update user', HttpStatus.BAD_REQUEST);
    }
  }

  async delete(
    userWhereUniqueInput: Prisma.UsersWhereUniqueInput
  ): Promise<Users> {
    try {
      const user = await this.prismaService.users.delete({
        where: userWhereUniqueInput,
      });

      if (!user) throw new NotFoundException(`User not found`);

      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('Could not delete user', HttpStatus.BAD_REQUEST);
    }
  }

  handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = error.meta?.target as string[];

      if (target.includes('email')) {
        throw new ConflictException('Email already exists');
      }

      if (target.includes('username')) {
        throw new ConflictException('Username already exists');
      }
    }
  }
}
