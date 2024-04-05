import { Injectable } from '@nestjs/common';
import { CreateAbsentDto } from './dto/create-absent.dto';
import { UpdateAbsentDto } from './dto/update-absent.dto';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Absent } from './entities/absent.entity';

@Injectable()
export class AbsentService {
  constructor(private readonly ds:DataSource){}
  private i = 0
  @Cron("* * * * *")
  create(createAbsentDto: CreateAbsentDto) {
    this.ds.getRepository(Absent).save({
      // user_id:1,
      userIdId:1,
      keterangan:'lorem',
      status:"hadir"
    })
  }

  findAll() {
    return `This action returns all absent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} absent`;
  }

  update(id: number, updateAbsentDto: UpdateAbsentDto) {
    return `This action updates a #${id} absent`;
  }

  remove(id: number) {
    return `This action removes a #${id} absent`;
  }
}
