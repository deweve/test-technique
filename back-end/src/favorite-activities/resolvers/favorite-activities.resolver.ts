import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ActivityService } from 'src/activity/activity.service';
import { ActivityMapper } from 'src/activity/mapper/activity.mapper';
import { ActivityDto } from 'src/activity/types';
import { AuthGuard } from 'src/auth/auth.guard';
import { FavoriteActivityMapper } from '../mapper/favoriteActivity.mapper';
import { FavoriteActivitiesService } from '../services/favorite-activities.service';
import { FavoriteActivityDto } from '../types/favoriteActivity.dto';

@Resolver(() => FavoriteActivityDto)
export class FavoriteActivitiesResolver {
  constructor(
    private readonly favoriteActivityService: FavoriteActivitiesService,
    private readonly activityService: ActivityService,
    private readonly activityMapper: ActivityMapper,
    private readonly favoriteActivityMapper: FavoriteActivityMapper,
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

  @Query(() => [FavoriteActivityDto])
  @UseGuards(AuthGuard)
  async getFavoriteActivities(
    @Context() context: any,
  ): Promise<FavoriteActivityDto[]> {
    const favorites = await this.favoriteActivityService.getFavoriteActivities(
      context.user.id,
    );
    return favorites.map(this.favoriteActivityMapper.convert);
  }

  @Mutation(() => [FavoriteActivityDto])
  @UseGuards(AuthGuard)
  async setPositionOfFavoriteActivity(
    @Args('favoriteActivityId') favoriteActivityId: string,
    @Args('position') position: number,
    @Context() context: any,
  ): Promise<FavoriteActivityDto[]> {
    await this.favoriteActivityService.setFavoriteActivityToPosition(
      favoriteActivityId,
      position,
      context.user.id,
    );
    const favoriteActivities =
      await this.favoriteActivityService.getFavoriteActivities(context.user.id);
    return favoriteActivities.map((favoriteActivity) =>
      this.favoriteActivityMapper.convert(favoriteActivity),
    );
  }

  @ResolveField(() => ActivityDto)
  activity(@Parent() favoriteActivity: FavoriteActivityDto) {
    return this.activityService.findOne(favoriteActivity.activityId);
  }
}
