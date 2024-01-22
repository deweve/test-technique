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
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';

import { UserDto } from 'src/user/types/user.dto';
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
  @UseGuards(JwtAuthGuard)
  async setFavoriteActivity(
    @CurrentUser() user: UserDto,
    @Args('activityId') activityId: string,
  ): Promise<ActivityDto> {
    this.favoriteActivityService.setActivityFavoriteToUser(user.id, activityId);
    const activity = await this.activityService.findOne(activityId);
    return this.activityMapper.convert(activity);
  }

  @Mutation(() => ActivityDto)
  @UseGuards(JwtAuthGuard)
  async unSetFavoriteActivity(
    @CurrentUser() user: UserDto,
    @Args('activityId') activityId: string,
  ): Promise<ActivityDto> {
    this.favoriteActivityService.unsetActivityFavoriteToUser(
      user.id,
      activityId,
    );
    const activity = await this.activityService.findOne(activityId);
    return this.activityMapper.convert(activity);
  }

  @Query(() => [FavoriteActivityDto])
  @UseGuards(JwtAuthGuard)
  async getFavoriteActivities(
    @CurrentUser() user: UserDto,
  ): Promise<FavoriteActivityDto[]> {
    const favorites = await this.favoriteActivityService.getFavoriteActivities(
      user.id,
    );
    return favorites.map(this.favoriteActivityMapper.convert);
  }

  @Mutation(() => [FavoriteActivityDto])
  @UseGuards(JwtAuthGuard)
  async setPositionOfFavoriteActivity(
    @Args('favoriteActivityId') favoriteActivityId: string,
    @Args('position') position: number,
    @CurrentUser() user: UserDto,
  ): Promise<FavoriteActivityDto[]> {
    await this.favoriteActivityService.setFavoriteActivityToPosition(
      favoriteActivityId,
      position,
      user.id,
    );
    const favoriteActivities =
      await this.favoriteActivityService.getFavoriteActivities(user.id);
    return favoriteActivities.map((favoriteActivity) =>
      this.favoriteActivityMapper.convert(favoriteActivity),
    );
  }

  @ResolveField(() => ActivityDto)
  activity(@Parent() favoriteActivity: FavoriteActivityDto) {
    return this.activityService.findOne(favoriteActivity.activityId);
  }
}
