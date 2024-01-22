import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FavoriteActivityDto {
  @Field()
  id!: string;

  @Field()
  favoritePosition!: number;

  @Field()
  activityId!: string;
}
