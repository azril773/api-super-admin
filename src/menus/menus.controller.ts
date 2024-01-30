import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { DataSource } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Request } from 'express';
import { decryptJwt } from 'functions/decrypt-jwt';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import { ResCode } from 'decarators/response-code.decarator';

@Controller('menus')
@UseGuards(JwtAuth)
@UseInterceptors(new ResponseIntercept(new Reflector()))
export class MenusController {
  constructor(private readonly menusService: MenusService,private readonly ds:DataSource) {}

  @Post()
  @ResCode(201,"Success create menu",'super_admin')
  async create(@Body() createMenuDto: CreateMenuDto,@Req() req:Request) {
    const cekName = await this.ds.getRepository(Menu).find({
      where:{
        name:createMenuDto.name
      }
    })
    if(cekName.length > 0) throw new BadRequestException("Menu already exist")
    const cekSlash = createMenuDto.url.split("")
    cekSlash[cekSlash.length - 1] == "/" ?  cekSlash.pop() : cekSlash
    // console.log(cekSlash.join(""))
    const cekUrl = await this.ds.getRepository(Menu).find({
      where:{
        url:cekSlash.join("")
      }
    })
    if(cekUrl.length > 0) throw new BadRequestException("Url already exist")
    createMenuDto["url"] = cekSlash.join("")
    const authorization = req.headers["authorization"] ?? null
    const jwts = decryptJwt(authorization)
    await this.menusService.create(createMenuDto,jwts.name)
    return true
  }

  @Get()
  @ResCode(201,"Success get all menu",'super_admin')
  async findAll() {
    return await this.menusService.findAll();
  }
  
  @Get(':id')
  @ResCode(201,"Success get a menu",'super_admin')
  async findOne(@Param('id') id: string) {
    return await this.menusService.findOne("id",+id);
  }
  
  @Patch(':id')
  @ResCode(201,"Success update a menu",'super_admin')
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
    console.log(cekDelete)
    if(cekDelete.length > 0){
      for (const i of cekDelete) {
        if(i.id != cekMenu[0].id){
          throw new BadRequestException("Menu already exist")
          
        }
      }
    }
    const authorization = req.headers["authorization"] ?? null
    const decrypt = decryptJwt(authorization)

    await this.menusService.update(+id, updateMenuDto,decrypt.name);
    return true
  }
  
  @Delete(':id')
  @ResCode(201,"Success delete a menu",'super_admin')
  async remove(@Param('id') id: string) {
    await this.menusService.remove(+id);
    return true 
  }
}
