import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityModule } from './activity/activity.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { FavoriteActivitiesModule } from './favorite-activities/favorite-activities.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      fieldResolverEnhancers: ['guards'],
      buildSchemaOptions: { numberScalarMode: 'integer' },
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        return { uri: process.env.MONGO_URI };
      },
    }),
    AuthModule,
    UserModule,
    MeModule,
    ActivityModule,
    SeedModule,
    FavoriteActivitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
