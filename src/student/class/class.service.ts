import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { DataSource } from 'typeorm';
import { Class } from './entities/class.entity';

@Injectable()
export class ClassService {
  constructor(private readonly ds:DataSource){}
  async create(createClassDto: CreateClassDto) {
    return await this.ds.getRepository(Class).save(createClassDto)
  }

  async findAll() {
    return await this.ds.getRepository(Class).find({
      order:{
        class:"ASC"
      }
    })
  }

  async findOne(id: number,key:string) {
    let obj = {}
    obj[key] = id
    return await this.ds.getRepository(Class).find({
      where:obj,
      order:{
        class:"ASC"
      }
    })
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    return await this.ds.getRepository(Class).update({id:+id},updateClassDto)
  }

  async remove(id: number,name:string) {
    await this.ds.getRepository(Class).update({id:+id},{updated_by:name})
    return await this.ds.getRepository(Class).softDelete({id:+id})
  }
}
