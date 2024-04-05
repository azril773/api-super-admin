import { Test, TestingModule } from '@nestjs/testing';
import { AnswerPgController } from './answer_pg.controller';
import { AnswerPgService } from './answer_pg.service';

describe('AnswerPgController', () => {
  let controller: AnswerPgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerPgController],
      providers: [AnswerPgService],
    }).compile();

    controller = module.get<AnswerPgController>(AnswerPgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
