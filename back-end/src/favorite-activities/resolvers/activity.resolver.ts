import { UseGuards } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ActivityDto } from 'src/activity/types';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { UserDto } from 'src/user/types/user.dto';
import { FavoriteActivitiesService } from '../services/favorite-activities.service';

@Resolver(() => ActivityDto)
export class ActivityResolver {
  constructor(
    private readonly favoriteActivitiesService: FavoriteActivitiesService,
  ) {}

  @ResolveField('isFavorite', () => Boolean, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async isFavorite(
    @Parent() activity: ActivityDto,
    @CurrentUser() user: UserDto,
  ): Promise<boolean | null> {
    if (user) {
      return this.favoriteActivitiesService.checkIsActivityFavoriteOfUser(
        user.id,
        activity.id,
      );
    }
    return null;
  }
}
