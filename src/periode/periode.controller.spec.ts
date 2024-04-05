import { Test, TestingModule } from '@nestjs/testing';
import { PeriodeController } from './periode.controller';
import { PeriodeService } from './periode.service';

describe('PeriodeController', () => {
  let controller: PeriodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeriodeController],
      providers: [PeriodeService],
    }).compile();

    controller = module.get<PeriodeController>(PeriodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
