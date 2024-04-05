import { Test, TestingModule } from '@nestjs/testing';
import { JobActivitiesController } from './job_activities.controller';
import { JobActivitiesService } from './job_activities.service';

describe('JobActivitiesController', () => {
  let controller: JobActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobActivitiesController],
      providers: [JobActivitiesService],
    }).compile();

    controller = module.get<JobActivitiesController>(JobActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
