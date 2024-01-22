import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ActivityService } from '../activity.service';
import { ActivityMapper } from '../mapper/activity.mapper';
import { ActivityDto, CreateActivityInput } from '../types';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { UserDto } from 'src/user/types/user.dto';

@Resolver('Activity')
export class ActivityResolver {
  constructor(
    private readonly activityService: ActivityService,
    private readonly activityMapper: ActivityMapper,
  ) {}

  @Query(() => [ActivityDto])
  async getActivities(): Promise<ActivityDto[]> {
    const activities = await this.activityService.findAll();
    return activities.map((activity) => this.activityMapper.convert(activity));
  }

  @Query(() => [ActivityDto])
  async getLatestActivities(): Promise<ActivityDto[]> {
    const activities = await this.activityService.findLatest();
    return activities.map((activity) => this.activityMapper.convert(activity));
  }

  @Query(() => [ActivityDto])
  @UseGuards(JwtAuthGuard)
  async getActivitiesByUser(
    @CurrentUser() user: UserDto,
  ): Promise<ActivityDto[]> {
    const activities = await this.activityService.findByUser(user.id);
    return activities.map((activity) => this.activityMapper.convert(activity));
  }

  @Query(() => [String])
  async getCities(): Promise<string[]> {
    const cities = await this.activityService.findCities();
    return cities;
  }

  @Query(() => [ActivityDto])
  async getActivitiesByCity(
    @Args('city') city: string,
    @Args({ name: 'activity', nullable: true }) activity?: string,
    @Args({ name: 'price', nullable: true, type: () => Int }) price?: number,
  ): Promise<ActivityDto[]> {
    const activities = await this.activityService.findByCity(
      city,
      activity,
      price,
    );
    return activities.map((activity) => this.activityMapper.convert(activity));
  }

  @Query(() => ActivityDto)
  async getActivity(@Args('id') id: string): Promise<ActivityDto> {
    const activity = await this.activityService.findOne(id);
    return this.activityMapper.convert(activity);
  }

  @Mutation(() => ActivityDto)
  @UseGuards(JwtAuthGuard)
  async createActivity(
    @CurrentUser() user: UserDto,
    @Args('createActivityInput') createActivityDto: CreateActivityInput,
  ): Promise<ActivityDto> {
    const activity = await this.activityService.create(
      user.id,
      createActivityDto,
    );
    return this.activityMapper.convert(activity);
  }
}
