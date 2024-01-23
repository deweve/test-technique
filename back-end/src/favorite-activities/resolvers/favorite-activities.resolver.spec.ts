import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteActivitiesResolver } from './favorite-activities.resolver';

describe('FavoriteActivitiesResolver', () => {
  let resolver: FavoriteActivitiesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteActivitiesResolver],
    }).compile();

    resolver = module.get<FavoriteActivitiesResolver>(
      FavoriteActivitiesResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
