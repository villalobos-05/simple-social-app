import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { ReplicationsService } from './replications.service';
import { CreateReplicationDto } from './dto/create-replication.dto';
import { DeleteReplicationDto } from './dto/delete-replication.dto';
import { Public } from 'src/core/auth/decorators/public.decorator';
import { PublicationsInterceptor } from '../publications/interceptors/publications.interceptor';

@Controller('replications')
export class ReplicationsController {
  constructor(private readonly replicationsService: ReplicationsService) {}

  @Post()
  @UseInterceptors(PublicationsInterceptor)
  create(@Body() createReplicationDto: CreateReplicationDto) {
    return this.replicationsService.create(createReplicationDto);
  }

  @Delete()
  @UseInterceptors(PublicationsInterceptor)
  remove(@Body() deleteReplicationDto: DeleteReplicationDto) {
    return this.replicationsService.remove(deleteReplicationDto);
  }

  @Public()
  @Get('user/:id')
  findAllFromUser(@Param('id', ParseIntPipe) id: number) {
    return this.replicationsService.findAll({ userId: id });
  }
}
