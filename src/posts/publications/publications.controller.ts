import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { Public } from 'src/core/auth/decorators/public.decorator';
import { PublicationsInterceptor } from './interceptors/publications.interceptor';
import { Request } from 'src/core/auth/entities/request.entity';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @UseInterceptors(PublicationsInterceptor)
  @Post()
  create(@Body() createPublicationDto: CreatePublicationDto) {
    return this.publicationsService.create(createPublicationDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.publicationsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.publicationsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    return this.publicationsService.remove(id, request.user);
  }

  @Public()
  @Get('user/:id')
  findUserPublications(@Param('id', ParseIntPipe) id: number) {
    return this.publicationsService.findUserPublications(id);
  }

  @Public()
  @Get(':id/replies')
  findAllReplies(@Param('id', ParseIntPipe) id: number) {
    return this.publicationsService.findPublicationReplies(id);
  }

  @Post(':id/like')
  likePublication(
    @Param(':id', ParseIntPipe) id: number,
    @Req() request: Request
  ) {
    return this.publicationsService.likePublication({
      userId: request.user.sub,
      publicationId: id,
    });
  }

  @Delete(':id/like')
  dislikePublication(
    @Param(':id', ParseIntPipe) id: number,
    @Req() request: Request
  ) {
    return this.publicationsService.dislikePublication({
      userId: request.user.sub,
      publicationId: id,
    });
  }

  @Post(':id/replicate')
  replicatePublication(
    @Param(':id', ParseIntPipe) id: number,
    @Req() request: Request
  ) {
    return this.publicationsService.replicatePublication({
      userId: request.user.sub,
      publicationId: id,
      text: request.body?.text,
    });
  }

  @Delete(':id/replicate')
  unreplicatePublication(
    @Param(':id', ParseIntPipe) id: number,
    @Req() request: Request
  ) {
    return this.publicationsService.unreplicatePublication({
      userId: request.user.sub,
      publicationId: id,
    });
  }
}
