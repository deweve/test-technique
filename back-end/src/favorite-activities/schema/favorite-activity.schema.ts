import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Activity } from 'src/activity/schema/activity.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class FavoriteActivity extends Document {
  @Prop({ required: true })
  favoritePosition!: number;

  @Prop({
    ref: Activity.name,
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  activity!: Activity;

  @Prop({
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user!: User;
}

export const favoriteActivitySchema =
  SchemaFactory.createForClass(FavoriteActivity);
