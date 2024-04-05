import { Test, TestingModule } from '@nestjs/testing';
import { PeriodeService } from './periode.service';

describe('PeriodeService', () => {
  let service: PeriodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeriodeService],
    }).compile();

    service = module.get<PeriodeService>(PeriodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
