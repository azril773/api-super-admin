import { Test, TestingModule } from '@nestjs/testing';
import { JobAccessesService } from './job_accesses.service';

describe('JobAccessesService', () => {
  let service: JobAccessesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobAccessesService],
    }).compile();

    service = module.get<JobAccessesService>(JobAccessesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
