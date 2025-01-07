import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/core/auth/decorators/public.decorator';
import { UsersGuard } from './users.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/core/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(['ADMIN'])
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(['ADMIN'])
  @Get(':id')
  findoneById(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.findOne({ id });
  }

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @UseGuards(UsersGuard)
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update({ id }, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(UsersGuard)
  delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.delete({ id });
  }
}
