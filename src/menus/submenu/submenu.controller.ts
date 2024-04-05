import { Controller, Get, Post, Body, Patch, Param, Delete, BadGatewayException, BadRequestException, Req, UseGuards, UseInterceptors, UnauthorizedException } from '@nestjs/common';
import { SubmenuService } from './submenu.service';
import { CreateSubmenuDto } from './dto/create-submenu.dto';
import { UpdateSubmenuDto } from './dto/update-submenu.dto';
import { Request } from 'express';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import { ResCode } from 'decarators/response-code.decarator';
import { MenusService } from '../menus.service';
import { decryptJwt } from 'functions/decrypt-jwt';
import { DataSource } from 'typeorm';
import { SubMenu } from '../entities/submenu.entity';

@Controller('submenu')
@UseInterceptors(new ResponseIntercept(new Reflector()))
@UseGuards(JwtAuth)
export class SubmenuController {
  constructor(private readonly submenuService: SubmenuService, private readonly menuService: MenusService,private readonly ds:DataSource) { }

  @Post()
  @ResCode(201, "success create submenu", ["super_admin"])
  async create(@Body() createSubmenuDto: CreateSubmenuDto, @Req() req: Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if (!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    const name = await this.submenuService.findOne("name", createSubmenuDto.name)
    // const url = await this.submenuService.findOne("url", createSubmenuDto.url)
    if (name.length > 0) throw new BadRequestException("Name or url already exist")
    const menu = await this.menuService.findOne("id", createSubmenuDto.menu_id)
    if (menu.length <= 0) throw new BadRequestException('Data submenu not found')
    try {
      await this.submenuService.create(createSubmenuDto, jwts.name)
      return true
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Get()
  @ResCode(200, "success get all submenu", ["super_admin"])
  async findAll() {
    return await this.submenuService.findAll();
  }

  @Get(':id')
  @ResCode(200, "success get a submenu", ["super_admin"])
  async findOne(@Param('id') id: string) {
    const data = await this.submenuService.findOne("id", +id);
    if (data.length <= 0) throw new BadRequestException("Data submenu not found")
    return data
  }

  @Patch(':id')
  @ResCode(200, "success get update submenu", ["super_admin"])
  async update(@Param('id') id: string, @Body() updateSubmenuDto: UpdateSubmenuDto, @Req() req: Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if (!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    try {
      const submenu = await this.submenuService.findOne("id", +id)
      if (submenu.length <= 0) throw new BadRequestException("Submenu not found")
      // const menu = await this.menuService.findOne("id", +updateSubmenuDto.menu_id)
      // if (menu.length <= 0) throw new BadRequestException("Data menu not found")
      const name = await this.ds.getRepository(SubMenu).createQueryBuilder("submenu").where("submenu.name=:name",{name:updateSubmenuDto.name}).andWhere("submenu.id!=:submenu_id",{submenu_id:submenu[0].id}).getMany()
      const url = await this.ds.getRepository(SubMenu).createQueryBuilder("submenu").where("submenu.url=:url",{url:updateSubmenuDto.url}).andWhere("submenu.id!=:submenu_id",{submenu_id:submenu[0].id}).getMany()
      if(name.length > 0 || url.length > 0) throw new BadRequestException("Submenu already exist")
      // if(cekUpdate.length > 0){
      //   for (const i of cekUpdate) {
      //     if(i.id != cekJob[0].id){
      //       throw new HttpException("Job already exist",HttpStatus.BAD_REQUEST)
      //     }
      //   }
      // }
      await this.submenuService.update(+id, updateSubmenuDto, jwts.name)
    return true
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Delete(':id')
  @ResCode(200, "success delete a submenu", ["super_admin"])
  async remove(@Param('id') id: string, @Req() req: Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if (!access_token) throw new UnauthorizedException("Forbidden")
    try {
      const jwts = decryptJwt(access_token)
      const submenu = await this.submenuService.findOne("id", +id)
      if (submenu.length <= 0) throw new BadRequestException("Data submenu not found")
      await this.submenuService.remove(+id, jwts.name);
      return true
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
