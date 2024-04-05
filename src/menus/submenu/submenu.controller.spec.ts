import { Test, TestingModule } from '@nestjs/testing';
import { SubmenuController } from './submenu.controller';
import { SubmenuService } from './submenu.service';

describe('SubmenuController', () => {
  let controller: SubmenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmenuController],
      providers: [SubmenuService],
    }).compile();

    controller = module.get<SubmenuController>(SubmenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
