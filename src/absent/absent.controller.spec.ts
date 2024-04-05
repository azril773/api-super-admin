import { Test, TestingModule } from '@nestjs/testing';
import { AbsentController } from './absent.controller';
import { AbsentService } from './absent.service';

describe('AbsentController', () => {
  let controller: AbsentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbsentController],
      providers: [AbsentService],
    }).compile();

    controller = module.get<AbsentController>(AbsentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
