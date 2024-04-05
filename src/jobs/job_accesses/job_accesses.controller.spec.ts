import { Test, TestingModule } from '@nestjs/testing';
import { JobAccessesController } from './job_accesses.controller';
import { JobAccessesService } from './job_accesses.service';

describe('JobAccessesController', () => {
  let controller: JobAccessesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobAccessesController],
      providers: [JobAccessesService],
    }).compile();

    controller = module.get<JobAccessesController>(JobAccessesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
