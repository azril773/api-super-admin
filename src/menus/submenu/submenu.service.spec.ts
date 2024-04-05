import { Test, TestingModule } from '@nestjs/testing';
import { SubmenuService } from './submenu.service';

describe('SubmenuService', () => {
  let service: SubmenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmenuService],
    }).compile();

    service = module.get<SubmenuService>(SubmenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
