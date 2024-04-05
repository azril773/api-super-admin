import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { DataSource } from 'typeorm';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswersService {
  constructor(private readonly ds:DataSource){}
  async create(createAnswerDto: CreateAnswerDto) {
    return await this.ds.getRepository(Answer).save(createAnswerDto)
  }

  async findAll() {
    return await this.ds.getRepository(Answer).find()
  }

  async findOne(key:string,value: number | string) {
    let obj = {}
    obj[key] = value
    return await this.ds.getRepository(Answer).findBy(obj)
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return await this.ds.getRepository(Answer).update({id},{answer:updateAnswerDto.answer})
  }

  async remove(id: number,name:string) {
    const repo = this.ds.getRepository(Answer)
    await repo.update({id},{updated_by:name})
    return await repo.softDelete({id})
  }
}
