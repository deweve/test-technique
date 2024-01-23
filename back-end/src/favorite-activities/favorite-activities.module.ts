import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityModule } from 'src/activity/activity.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ActivityResolver } from './resolvers/activity.resolver';
import { FavoriteActivitiesResolver } from './resolvers/favorite-activities.resolver';
import {
  FavoriteActivity,
  favoriteActivitySchema,
} from './schema/favorite-activity.schema';
import { FavoriteActivitiesService } from './services/favorite-activities.service';

@Module({
  imports: [
    ActivityModule,
    UserModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: FavoriteActivity.name,
        schema: favoriteActivitySchema,
      },
    ]),
  ],
  providers: [
    FavoriteActivitiesService,
    FavoriteActivitiesResolver,
    ActivityResolver,
  ],
})
export class FavoriteActivitiesModule {}
