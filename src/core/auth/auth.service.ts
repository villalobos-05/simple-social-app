import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from 'src/core/users/users.service';
import { RtService } from './rt.service';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from './entities/payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rtService: RtService
  ) {}

  async signIn(
    username: string,
    pass: string
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne({ username });

    if (!(await compare(pass, user?.password))) {
      throw new UnauthorizedException();
    }

    this.rtService.createRt(user.id, uuidv4());

    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      username: user.username,
      sub: user.id,
      role: (user.role = 'USER'),
    };

    return { access_token: await this.generateJwtToken(payload) };
  }

  async signOut(userId: number): Promise<void> {
    this.rtService.revokeRt(userId);
  }

  async extendSession(
    userId: number,
    rt: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    // Validate the refresh token
    const isValid = await this.rtService.validateRt(userId, rt);

    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    // Get user attributes and Generate new tokens
    const { username, role } = await this.usersService.findOne({ id: userId });

    const accessToken = await this.generateJwtToken({
      username,
      sub: userId,
      role,
    });

    const refreshToken = uuidv4();

    // Update the refresh token
    this.rtService.updateRt(userId, refreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async generateJwtToken(
    payload: Omit<JwtPayload, 'iat' | 'exp'>
  ): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
