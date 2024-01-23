import { Test, TestingModule } from '@nestjs/testing';
import { connect, Connection, Model, Schema } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  FavoriteActivity,
  favoriteActivitySchema,
} from '../schema/favorite-activity.schema';
import { FavoriteActivitiesService } from './favorite-activities.service';
import { getModelToken } from '@nestjs/mongoose';

function testMongo(models: { schema: Schema; name: string }[]) {
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  const refModels: {
    ref?: Array<{ useValue: Model<any>; provide: string }> | undefined;
  } = {};

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    refModels.ref = models.map(({ schema, name }) => ({
      useValue: mongoConnection.model(name, schema),
      provide: getModelToken(name),
    }));
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  return refModels;
}

describe('FavoriteActivitiesService', () => {
  let service: FavoriteActivitiesService;

  const refModels = testMongo([
    { schema: favoriteActivitySchema, name: FavoriteActivity.name },
  ]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...refModels!],
      providers: [FavoriteActivitiesService],
    }).compile();

    service = module.get<FavoriteActivitiesService>(FavoriteActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add favorite activity to user', () => {
    const firstFavoriteActivity = service.setActivityFavoriteToUser('a', 'b');
    expect(firstFavoriteActivity).toBeDefined();
  });
});
