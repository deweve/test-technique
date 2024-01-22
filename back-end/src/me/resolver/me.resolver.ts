import { Context, Query, Resolver } from '@nestjs/graphql';
import { UserMapper } from '../../user/mapper/user.mapper';
import { UserService } from '../../user/user.service';
import { UserDto } from '../../user/types/user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';

@Resolver('Me')
export class MeResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Query(() => UserDto)
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: UserDto): Promise<UserDto> {
    return user;
  }
}
