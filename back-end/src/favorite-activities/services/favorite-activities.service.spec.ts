import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteActivitiesService } from './favorite-activities.service';

describe('FavoriteActivitiesService', () => {
  let service: FavoriteActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteActivitiesService],
    }).compile();

    service = module.get<FavoriteActivitiesService>(FavoriteActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
