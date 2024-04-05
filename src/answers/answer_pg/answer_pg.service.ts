import { Injectable } from '@nestjs/common';
import { CreateAnswerPgDto } from './dto/create-answer_pg.dto';
import { UpdateAnswerPgDto } from './dto/update-answer_pg.dto';

@Injectable()
export class AnswerPgService {
  create(createAnswerPgDto: CreateAnswerPgDto) {
    return 'This action adds a new answerPg';
  }

  findAll() {
    return `This action returns all answerPg`;
  }

  findOne(id: number) {
    return `This action returns a #${id} answerPg`;
  }

  update(id: number, updateAnswerPgDto: UpdateAnswerPgDto) {
    return `This action updates a #${id} answerPg`;
  }

  remove(id: number) {
    return `This action removes a #${id} answerPg`;
  }
}
