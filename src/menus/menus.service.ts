import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { DataSource } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { decryptJwt } from 'functions/decrypt-jwt';
import { newDateLocal } from 'functions/dateNow';

@Injectable()
export class MenusService {
  constructor(private readonly ds:DataSource){}
  async create(createMenuDto: CreateMenuDto,name:string) {
    createMenuDto["created_by"] = name
    createMenuDto["updated_by"] = name
    return await this.ds.getRepository(Menu).save(createMenuDto)
  }

  async findAll() {
    return await this.ds.getRepository(Menu).find();
  }

  async findOne(key:string,value:string | number) {
    let obj = {}
    obj[key] = value
    return await this.ds.getRepository(Menu).find({
      where:obj
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto,name) {
    const repo = this.ds.getRepository(Menu)
    const data = await repo.find({where:{id:+id}})
    if(data.length <= 0) throw new BadRequestException("Menu not found")
    data[0]["name"] = updateMenuDto["name"]
    data[0]["url"] = updateMenuDto["url"]
    data[0]["icon"] = updateMenuDto["icon"] ? updateMenuDto["icon"] : data[0].icon
    data[0]["type"] = updateMenuDto["type"]
    data[0]["updated_by"] = name
    data[0]["updated_at"] = newDateLocal()
    return await repo.save(data,{})
  }

  async remove(id: number,name:string) {
    const repo = this.ds.getRepository(Menu)
    await repo.update({
      id:+id
    },{
      updated_by:name
    })
    return await repo.softDelete({
      id:+id
    })
  }
}
