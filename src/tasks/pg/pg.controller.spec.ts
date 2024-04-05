import { Test, TestingModule } from '@nestjs/testing';
import { PgController } from './pg.controller';
import { PgService } from './pg.service';

describe('PgController', () => {
  let controller: PgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PgController],
      providers: [PgService],
    }).compile();

    controller = module.get<PgController>(PgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
