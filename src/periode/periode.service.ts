import { Injectable } from '@nestjs/common';
import { CreatePeriodeDto } from './dto/create-periode.dto';
import { UpdatePeriodeDto } from './dto/update-periode.dto';
import { DataSource } from 'typeorm';
import { Periode } from './entities/periode.entity';

@Injectable()
export class PeriodeService {
  constructor(private readonly ds:DataSource){}
  async create(createPeriodeDto: CreatePeriodeDto) {
    return await this.ds.getRepository(Periode).save(createPeriodeDto)
  }

  async findAll() {
    return await this.ds.getRepository(Periode).find({
      order:{
        periode:"ASC"
      }
    })
  }

  async findOne(id: number,key:string) { 
    let obj = {}
    obj[key] = +id
    return await this.ds.getRepository(Periode).find({
      where:obj,
      order:{
        periode:"ASC"
      }
    })
  }

  async update(id: number, updatePeriodeDto: UpdatePeriodeDto) {
    return await this.ds.getRepository(Periode).update({id:+id},updatePeriodeDto)
  }

  async remove(id: number,name:string) {
    await this.ds.getRepository(Periode).update({id:+id},{updated_by:name})
    return await this.ds.getRepository(Periode).softDelete({id:+id})
  }
}
