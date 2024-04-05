import { Test, TestingModule } from '@nestjs/testing';
import { MasterClassController } from './master-class.controller';
import { MasterClassService } from './master-class.service';

describe('MasterClassController', () => {
  let controller: MasterClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterClassController],
      providers: [MasterClassService],
    }).compile();

    controller = module.get<MasterClassController>(MasterClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
