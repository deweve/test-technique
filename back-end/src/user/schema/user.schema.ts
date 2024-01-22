import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ default: false })
  isAdmin!: boolean;

  @Prop({ required: true })
  password!: string;

  @Prop()
  token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
