import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateReplicationDto } from './dto/create-replication.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DeleteReplicationDto } from './dto/delete-replication.dto';

@Injectable()
export class ReplicationsService {
  constructor(private prismaService: PrismaService) {}

  async create(createReplicationDto: CreateReplicationDto) {
    try {
      return await this.prismaService.replications.create({
        data: createReplicationDto,
      });
    } catch (error) {
      this.handlePrismaError(error);
      throw new BadRequestException('Could not create replication');
    }
  }

  async findAll(id: Prisma.ReplicationsWhereInput) {
    return await this.prismaService.replications.findMany({
      where: id,
    });
  }

  async remove(deleteReplicationDto: DeleteReplicationDto) {
    const { userId, publicationId } = deleteReplicationDto;

    try {
      return await this.prismaService.replications.delete({
        where: { publicationId_userId: { userId, publicationId } },
      });
    } catch (error) {
      this.handlePrismaError(error);
      throw new BadRequestException('Could not delete replication');
    }
  }

  handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictException('Replication already exists');
    }

    if (error.code === 'P2003' || error.code === 'P2025') {
      throw new BadRequestException('Publication or user does not exist');
    }

    if (error?.code) {
      throw new InternalServerErrorException({
        message: error.message,
        errorName: error.name,
        prismaCode: error.code,
      });
    }
  }
}
