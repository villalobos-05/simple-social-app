import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
} from '@nestjs/common';
import { UsersInfoService } from './users-info.service';
import { Public } from 'src/core/auth/decorators/public.decorator';
import { Request } from 'src/core/auth/entities/request.entity';
import { UpdateUsersInfoDto } from './dto/update-users-info.dto';

@Controller('users-info')
export class UsersInfoController {
  constructor(private readonly usersInfoService: UsersInfoService) {}

  @Public()
  @Get()
  findAll() {
    return this.usersInfoService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersInfoService.findOne({ id });
  }

  @Patch()
  update(
    @Req() request: Request,
    @Body() updateUserInfoDto: UpdateUsersInfoDto
  ) {
    return this.usersInfoService.update(request.user.sub, updateUserInfoDto);
  }
}
