import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from 'src/user/types/user.dto';
import { UserService } from 'src/user/user.service';
import { UserMapper } from 'src/user/mapper/user.mapper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies['jwt'] ?? null,
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: UserDto): Promise<UserDto> {
    const user = await this.userService.getById(payload.id);

    if (!user)
      throw new UnauthorizedException(
        "User doesn't exist or auth token is expired",
      );
    return this.userMapper.convert(user);
  }
}
