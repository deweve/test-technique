import { UseGuards } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ActivityDto } from 'src/activity/types';
import { AuthGuard } from 'src/auth/auth.guard';
import { FavoriteActivitiesService } from '../services/favorite-activities.service';

@Resolver(() => ActivityDto)
export class ActivityResolver {
  constructor(
    private readonly favoriteActivitiesService: FavoriteActivitiesService,
  ) {}

  @ResolveField('isFavorite', () => Boolean)
  @UseGuards(AuthGuard)
  async isFavorite(
    @Parent() activity: ActivityDto,
    @Context() context: any,
  ): Promise<boolean> {
    return this.favoriteActivitiesService.checkIsActivityFavoriteOfUser(
      context.user.id,
      activity.id,
    );
  }
}
