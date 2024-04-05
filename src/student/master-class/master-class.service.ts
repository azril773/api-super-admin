import { Injectable } from '@nestjs/common';
import { CreateMasterClassDto } from './dto/create-master-class.dto';
import { UpdateMasterClassDto } from './dto/update-master-class.dto';
import { DataSource } from 'typeorm';
import { MasterClass } from './entities/master-class.entity';
import { UpdateClassDto } from '../class/dto/update-class.dto';

@Injectable()
export class MasterClassService {
  constructor(private readonly ds:DataSource){}

  async create(createMasterClassDto: CreateMasterClassDto) {
    return await this.ds.getRepository(MasterClass).save(createMasterClassDto)
  }

  async findAll() {
    return await this.ds.getRepository(MasterClass).find({
      order:{
        name:"ASC"
      }
    })
  }

  async findOne(id: number,key:string) {
    let obj = {}
    obj[key] = +id
    return this.ds.getRepository(MasterClass).find({
      where:obj,
      order:{
        name:"ASC"
      }
    })
  }

  async   update(id: number, updateMasterClassDto: UpdateMasterClassDto) {
    console.log(updateMasterClassDto)
    return await this.ds.getRepository(MasterClass).update({id:+id},updateMasterClassDto)
  }

  async remove(id: number,name:string) {
    await this.ds.getRepository(MasterClass).update({id:+id},{updated_by:name})
    return await this.ds.getRepository(MasterClass).softDelete({id:+id})
  }
}
