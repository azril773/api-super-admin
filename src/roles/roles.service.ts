import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DataSource } from 'typeorm';
import { Role } from './entities/role.entity';
import { randomBytes } from "crypto"
import { RandomKode } from 'functions/generate-code';
import { newDateLocal } from '../../functions/dateNow';

@Injectable()
export class RolesService {
  constructor(private readonly ds:DataSource){}
  
  create(createRoleDto: CreateRoleDto,name:any) {
    createRoleDto["code"] = RandomKode(4)
    createRoleDto["created_by"] = name
    createRoleDto["updated_by"] = name
    return this.ds.getRepository(Role).save(createRoleDto)
  }

  async findAll() {
    return await this.ds.getRepository(Role).find()
  }

  async findOne(key:string,value: number | string) {
    let obj = {}
    obj[key] = value
    return await this.ds.getRepository(Role).findBy(obj)
  }

  async update(id: number, updateRoleDto: UpdateRoleDto,name) {
    const repo = this.ds.getRepository(Role)
    const data = await repo.findBy({id:+id})
    data[0].name = updateRoleDto.name.trim()
    data[0].description = updateRoleDto.description.trim()
    data[0].dashboard_url = updateRoleDto.dashboard_url.trim()
    data[0].updated_by = name
    data[0]["updated_at"] = newDateLocal()
    return await repo.save(data)
  }

  async remove(id: number) {
    return await this.ds.getRepository(Role).delete({id:+id}) 
  }
}
