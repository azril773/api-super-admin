import { Test, TestingModule } from '@nestjs/testing';
import { AnswerPgService } from './answer_pg.service';

describe('AnswerPgService', () => {
  let service: AnswerPgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswerPgService],
    }).compile();

    service = module.get<AnswerPgService>(AnswerPgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
