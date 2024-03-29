import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityService } from './activity.service';
import { ActivityMapper } from './mapper/activity.mapper';
import { Activity, ActivitySchema } from './schema/activity.schema';
import { ActivityResolver } from './resolver/activity.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
    AuthModule,
  ],
  exports: [ActivityService, ActivityMapper],
  providers: [ActivityService, ActivityMapper, ActivityResolver],
})
export class ActivityModule {}
