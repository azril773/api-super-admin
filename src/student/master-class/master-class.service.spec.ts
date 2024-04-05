import { Test, TestingModule } from '@nestjs/testing';
import { MasterClassService } from './master-class.service';

describe('MasterClassService', () => {
  let service: MasterClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterClassService],
    }).compile();

    service = module.get<MasterClassService>(MasterClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
