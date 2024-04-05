import { Injectable } from '@nestjs/common';
import { CreateSubmenuDto } from './dto/create-submenu.dto';
import { UpdateSubmenuDto } from './dto/update-submenu.dto';
import { DataSource } from 'typeorm';
import { SubMenu } from '../entities/submenu.entity';
import { newDateLocal } from 'functions/dateNow';

@Injectable()
export class SubmenuService {
  constructor(private readonly ds:DataSource){}
  async create(createSubmenuDto: CreateSubmenuDto,name:string) {
    createSubmenuDto["created_by"] = name
    createSubmenuDto["updated_by"] = name
    createSubmenuDto["menuIdId"] = createSubmenuDto.menu_id
    return await this.ds.getRepository(SubMenu).save(createSubmenuDto)
  }

  async findAll() {
    return await this.ds.getRepository(SubMenu).query("SELECT menus.name as menu_name,menus.url as menu_url,menus.type as menu_type,submenus.menuIdId as menuIdId, submenus.name,submenus.url,submenus.id FROM submenus JOIN menus ON menus.id=submenus.menuIdId WHERE submenus.deleted_at IS NULL");
  }

  async findOne(key:string,value: number | string) {
    let obj = {}
    obj[key] = value
    return await this.ds.getRepository(SubMenu).query(`SELECT * FROM submenus WHERE ${key}='${value}' AND deleted_at IS NULL`)
  }

  async update(id: number, updateSubmenuDto: UpdateSubmenuDto,name:string) {
    const repo = this.ds.getRepository(SubMenu)
    const data = await repo.findBy({id:+id})
    data[0].name = updateSubmenuDto.name
    data[0].url = updateSubmenuDto.url
    data[0].menuIdId = updateSubmenuDto.menu_id
    // data[0].menu_id = updateSubmenuDto.menu_id
    data[0].updated_at = newDateLocal()
    data[0].updated_by = name
    console.log('oskdoksodks',"update")
    return await repo.save(data,{})
  }

  async remove(id: number,name:string) {
    const repo = this.ds.getRepository(SubMenu)
    await repo.update({
      id:+id
    },{
      updated_by:name,
    })
    return await repo.softDelete({
      id:+id
    })
  }
}
