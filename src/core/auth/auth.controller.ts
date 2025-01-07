import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Public } from './decorators/public.decorator';
import { RtInterceptor } from './interceptors/rt.interceptor';
import { RefreshDto } from './dto/refresh.dto';
import { NonAuthGuard } from './guards/non-auth.guard';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(NonAuthGuard)
  @Post('login')
  create(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async remove(@Request() req: LogoutDto) {
    return this.authService.signOut(req.user.sub);
  }

  @HttpCode(HttpStatus.OK)
  @Public() // Bypass AuthGuard because the access token is or could be expired
  @UseInterceptors(RtInterceptor)
  @Post('refresh')
  async refresh(@Request() req: RefreshDto) {
    return this.authService.extendSession(
      req.user.sub,
      req.headers['x-refresh-token']
    );
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
