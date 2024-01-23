import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Mongoose } from 'mongoose';

import { Activity } from 'src/activity/schema/activity.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class FavoriteActivity extends Document {
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

  @Prop({ required: true })
  position!: number;
}

export const favoriteActivitySchema =
  SchemaFactory.createForClass(FavoriteActivity);
