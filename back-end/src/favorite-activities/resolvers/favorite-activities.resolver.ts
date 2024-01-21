import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ActivityService } from 'src/activity/activity.service';
import { ActivityMapper } from 'src/activity/mapper/activity.mapper';
import { ActivityDto } from 'src/activity/types';
import { AuthGuard } from 'src/auth/auth.guard';
import { FavoriteActivitiesService } from '../services/favorite-activities.service';

@Resolver()
export class FavoriteActivitiesResolver {
  constructor(
    private readonly favoriteActivityService: FavoriteActivitiesService,
    private readonly activityService: ActivityService,
    private readonly activityMapper: ActivityMapper,
  ) {}

  @Mutation(() => ActivityDto)
  @UseGuards(AuthGuard)
  async setFavoriteActivity(
    @Context() context: any,
    @Args('activityId') activityId: string,
  ): Promise<ActivityDto> {
    this.favoriteActivityService.setActivityFavoriteToUser(
      context.user.id,
      activityId,
    );
    const activity = await this.activityService.findOne(activityId);
    return this.activityMapper.convert(activity);
  }

  @Mutation(() => ActivityDto)
  @UseGuards(AuthGuard)
  async unSetFavoriteActivity(
    @Context() context: any,
    @Args('activityId') activityId: string,
  ): Promise<ActivityDto> {
    this.favoriteActivityService.unsetActivityFavoriteToUser(
      context.user.id,
      activityId,
    );
    const activity = await this.activityService.findOne(activityId);
    return this.activityMapper.convert(activity);
  }
}
