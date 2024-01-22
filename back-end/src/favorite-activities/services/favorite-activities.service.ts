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

  async setActivityFavoriteToUser(
    userId: string,
    activityId: string,
  ): Promise<FavoriteActivity> {
    const lastFavoriteActivity = await this.favoriteActivityModel
      .findOne({ user: userId })
      .sort({ favoritePosition: 'desc' })
      .exec();
    const position = (lastFavoriteActivity?.favoritePosition || 0) + 1;
    return this.favoriteActivityModel
      .findOneAndUpdate(
        {
          user: userId,
          activity: activityId,
        },
        { favoritePosition: position },
        { new: true, upsert: true },
      )
      .exec();
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

  async getFavoriteActivities(userId: string): Promise<FavoriteActivity[]> {
    return this.favoriteActivityModel
      .find({ user: userId })
      .sort({ favoritePosition: 'asc' })
      .exec();
  }

  async setFavoriteActivityToPosition(
    favoriteActivityId: string,
    position: number,
    userId: string,
  ): Promise<void> {
    const favoriteActivityToReplacePosition = await this.favoriteActivityModel
      .findOne({
        favoritePosition: position,
        user: userId,
      })
      .exec();
    const favoritePosition = await this.favoriteActivityModel
      .findOne({
        user: userId,
        _id: favoriteActivityId,
      })
      .exec();
    if (favoriteActivityToReplacePosition && favoritePosition) {
      await this.favoriteActivityModel
        .updateOne(
          { _id: favoriteActivityToReplacePosition._id },
          { favoritePosition: favoritePosition.favoritePosition },
        )
        .exec();
    }
    if (favoritePosition) {
      await this.favoriteActivityModel
        .updateOne(
          {
            _id: favoritePosition._id,
          },
          { favoritePosition: position },
        )
        .exec();
    }
  }
}
