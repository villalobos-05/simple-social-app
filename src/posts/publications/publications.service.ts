import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from 'src/core/auth/entities/payload.entity';
import {
  LikePublicationDto,
  ReplicateDto,
  UnReplicateDto,
} from './dto/react-publication.dto';

@Injectable()
export class PublicationsService {
  constructor(private prismaService: PrismaService) {}

  async create(createPublicationDto: CreatePublicationDto) {
    if (createPublicationDto?.parentPublicationId) {
      await this.findOne(createPublicationDto.parentPublicationId);
    }

    return await this.prismaService.publications.create({
      data: createPublicationDto,
    });
  }

  async findAll() {
    return await this.prismaService.publications.findMany();
  }

  async findOne(id: number) {
    const publication = await this.prismaService.publications.findUnique({
      where: { id },
    });

    if (!publication) throw new NotFoundException('Publication not found');

    return publication;
  }

  async remove(id: number, user: JwtPayload) {
    const publication = await this.findOne(user.sub);

    if (user.role === 'ADMIN' || publication.userId !== user.sub) {
      throw new ForbiddenException('Not allowed to delete publication');
    }

    return await this.prismaService.publications.delete({
      where: { id },
    });
  }

  async findUserPublications(userId: number) {
    return await this.prismaService.publications.findMany({
      where: { userId },
    });
  }

  async findPublicationReplies(id: number) {
    return await this.prismaService.publications.findMany({
      where: { parentPublicationId: id },
    });
  }

  async likePublication(reactPublicationDto: LikePublicationDto) {
    return await this.prismaService.publicationLikes.create({
      data: reactPublicationDto,
    });
  }

  async dislikePublication(reactPublicationDto: LikePublicationDto) {
    return await this.prismaService.publicationLikes.delete({
      where: { publicationId_userId: reactPublicationDto },
    });
  }

  async replicatePublication(reactPublicationDto: ReplicateDto) {
    return await this.prismaService.replications.create({
      data: reactPublicationDto,
    });
  }

  async unreplicatePublication(reactPublicationDto: UnReplicateDto) {
    const { userId, publicationId } = reactPublicationDto;

    return await this.prismaService.replications.delete({
      where: {
        publicationId_userId: { userId, publicationId },
      },
    });
  }
}
