import * as DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { FavoriteActivity } from '../schema/favorite-activity.schema';

@Injectable()
export class FavoriteActivitiesService {
  constructor(
    @InjectModel(FavoriteActivity.name)
    private favoriteActivityModel: Model<FavoriteActivity>,
  ) {}

  private dataloader = new DataLoader(
    async (
      batch: readonly {
        userId: string;
        activityId: string;
      }[],
    ): Promise<boolean[]> => {
      const orCondition = batch.map(({ userId, activityId }) => ({
        user: new Types.ObjectId(userId),
        activity: new Types.ObjectId(activityId),
      }));
      const favoriteActivities = await this.favoriteActivityModel
        .find({
          $or: orCondition,
        })
        .find()
        .exec();
      const checker = favoriteActivities.reduce((acc, { user, activity }) => {
        acc.add(`${activity._id}-${user._id}`);
        return acc;
      }, new Set<string>());
      return batch.map(({ activityId, userId }) =>
        checker.has(`${activityId}-${userId}`),
      );
    },
    { cache: false },
  );

  checkIsActivityFavoriteOfUser(
    userId: string,
    activityId: string,
  ): Promise<boolean> {
    return this.dataloader.load({ userId, activityId });
  }

  setActivityFavoriteToUser(
    userId: string,
    activityId: string,
  ): Promise<FavoriteActivity> {
    return this.favoriteActivityModel.create({
      user: userId,
      activity: activityId,
      position: 1,
    });
  }

  async unsetActivityFavoriteToUser(
    userId: string,
    activityId: string,
  ): Promise<void> {
    await this.favoriteActivityModel.deleteOne({
      user: userId,
      activity: activityId,
    });
  }
}
