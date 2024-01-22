import { Injectable } from '@nestjs/common';

import { Mapper } from 'src/utils/mapper';
import { FavoriteActivity } from '../schema/favorite-activity.schema';
import { FavoriteActivityDto } from '../types/favoriteActivity.dto';

@Injectable()
export class FavoriteActivityMapper
  implements Mapper<FavoriteActivity, FavoriteActivityDto>
{
  convert(favoriteActivity: FavoriteActivity): FavoriteActivityDto {
    return {
      id: favoriteActivity._id,
      favoritePosition: favoriteActivity.favoritePosition,
      activityId: favoriteActivity.activity._id,
    };
  }
}
