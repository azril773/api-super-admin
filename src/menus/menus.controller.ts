import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Req, UseGuards, UseInterceptors, UnauthorizedException } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { DataSource, In } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Request } from 'express';
import { decryptJwt } from 'functions/decrypt-jwt';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import { ResCode } from 'decarators/response-code.decarator';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { User } from 'src/users/entities/user.entity';
import { JobAccess } from 'src/jobs/entities/job_access.entity';
import { JobActivity } from 'src/jobs/entities/job_activity.entity';

@Controller('menus')
@UseGuards(JwtAuth)
@UseInterceptors(new ResponseIntercept(new Reflector()))
export class MenusController {
  constructor(private readonly menusService: MenusService,private readonly ds:DataSource) {}

  @Post()
  @ResCode(201,"Success create menu",['super_admin'])
  async create(@Body() createMenuDto: CreateMenuDto,@Req() req:Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if(!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    const cekName = await this.ds.getRepository(Menu).find({
      where:{
        name:createMenuDto.name
      }
    })
    if(cekName.length > 0) throw new BadRequestException("Menu already exist")
    const cekSlash = createMenuDto.url.split("")
    cekSlash[cekSlash.length - 1] == "/" ?  cekSlash.pop() : cekSlash
    const cekUrl = await this.ds.getRepository(Menu).find({
      where:{
        url:cekSlash.join("")
      }
    })
    if(cekUrl.length > 0) throw new BadRequestException("Url already exist")
    createMenuDto["url"] = cekSlash.join("")
    await this.menusService.create(createMenuDto,jwts.name)
    return true
  }

  @Get()
  @ResCode(200,"Success get all menu",['super_admin'])
  async findAll() {
    return await this.menusService.findAll();
  }

  @Post("/menu_user")
  @ResCode(200,"Success get menu user",[])
  async findMenuUser(@Req() req:Request) {
    const authorization = req.headers["x-authorization"]

    const jwts = decryptJwt(authorization)
    const name = jwts.name
    // const user = await this.ds.getRepository(User).find({where:{name},select:["id"]})
    // const id = user.map(e => e.id)
    // const jobaccess = await this.ds.getRepository(JobAccess).find({where:{user_id:In(id)},select:["job_id"]})
    // const job_id = jobaccess.map(e => e.job_id)
    // const jobactivites = await this.ds.getRepository(JobActivity).find({where:{job_id:In(job_id)},select:["submenu_id"]})
    // const submenu_id = jobactivites.map(e => e.submenu_id)
    // const submenu = await this.ds.getRepository()
    const data = await this.ds.query("SELECT users.name as name_user, users.picture as picture_user, users.created_by as created_by_user, users.updated_by as updated_by_user, menus.name as name_menu,menus.id as id_menu,submenus.name as name_submenus,submenus.id as id_submenu,submenus.url as url_submenu, submenus.menuIdId as menuId_submenu,menus.name as name_menus, menus.url as url_menu FROM users JOIN job_accesses ON job_accesses.userIdId=users.id JOIN job_activities ON job_activities.jobIdId=job_accesses.jobIdId JOIN submenus ON submenus.id=job_activities.submenuIdId JOIN menus ON submenus.menuIdId=menus.id WHERE users.name=?",[name])
    const idSubmenu = data.map(e => [e.name_menus,e.url_menu])  
    const set= new Set(idSubmenu)
    const arr = new Array(set)
    let obj = []
    set.forEach(e =>{
     obj.push({menu_name:e[0],url:e[1],submenu:[]})
    })
    for (const i of obj) {
      const submenus = data.filter(e => e.name_menus == i.menu_name)
      submenus.forEach(e => {
        i["submenu"].push({name:e.name_submenus,url:e.url_submenu})
      });
    }
    const newData = Array.from(new Set(obj.map(e => e.menu_name))).map(e => {
      return obj.find(i => i.menu_name == e)
    })
    return newData
  }
  
  @Get(':id')
  @ResCode(200,"Success get a menu",['super_admin'])
  async findOne(@Param('id') id: string) {
    return await this.menusService.findOne("id",+id);
  }
  
  @Patch(':id')
  @ResCode(200,"Success update a menu",['super_admin'])
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto,@Req() req:Request) {
    const cekMenu = await this.ds.getRepository(Menu).find({
      where:{
        id:+id
      }
    })

    if(cekMenu.length <= 0) throw new BadRequestException("Menu not found")
    const cekName = await this.ds.getRepository(Menu).find({
      where:{
        name:updateMenuDto.name
      },
      withDeleted:false
    })
    const cekUrl = await this.ds.getRepository(Menu).find({
      where:{
        url:updateMenuDto.url
      },
      withDeleted:false
    })
    let cekDelete = [...cekName,...cekUrl]
    if(cekDelete.length > 0){
      for (const i of cekDelete) {
        if(i.id != cekMenu[0].id){
          throw new BadRequestException("Menu already exist")
          
        }
      }
    }
    const access_token = req.headers["x-authorization"] ?? null
    const decrypt = decryptJwt(access_token)
    // updateMenuDto['icon'] = `${process.env.URL_ROOT}/${}`
    await this.menusService.update(+id, updateMenuDto,decrypt.name);
    return true
  }
  
  @Delete(':id')
  @ResCode(200,"Success delete a menu",['super_admin'])
  async remove(@Param('id') id: string,@Req() req:Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if(!access_token) throw new UnauthorizedException("Forbidden")
    const jwts = decryptJwt(access_token)
    const data = await this.menusService.findOne("id",id)
    if(data.length <= 0) throw new BadRequestException("Menu not found")
    const split = data[0].icon.split('/')
    const name = split[split.length - 1]
    if(existsSync(join(__dirname,"/../../../public",name))){
      unlinkSync(join(__dirname,"/../../../public",name))
    }
    await this.menusService.remove(+id,jwts.name);
    return true 
  }
}
