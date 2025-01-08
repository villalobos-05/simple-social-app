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
import { RequestToBodyInterceptor } from 'src/common/interceptors/request-to-body.interceptor';

@Controller('replications')
export class ReplicationsController {
  constructor(private readonly replicationsService: ReplicationsService) {}

  @Post()
  @UseInterceptors(new RequestToBodyInterceptor('user.sub', 'userId'))
  create(@Body() createReplicationDto: CreateReplicationDto) {
    return this.replicationsService.create(createReplicationDto);
  }

  @Delete()
  @UseInterceptors(new RequestToBodyInterceptor('user.sub', 'userId'))
  remove(@Body() deleteReplicationDto: DeleteReplicationDto) {
    return this.replicationsService.remove(deleteReplicationDto);
  }

  @Public()
  @Get('user/:id')
  findAllFromUser(@Param('id', ParseIntPipe) id: number) {
    return this.replicationsService.findAll({ userId: id });
  }
}
