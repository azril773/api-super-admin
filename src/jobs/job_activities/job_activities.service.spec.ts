import { Test, TestingModule } from '@nestjs/testing';
import { JobActivitiesService } from './job_activities.service';

describe('JobActivitiesService', () => {
  let service: JobActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobActivitiesService],
    }).compile();

    service = module.get<JobActivitiesService>(JobActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
