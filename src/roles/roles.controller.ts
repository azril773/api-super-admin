import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, BadRequestException, UseGuards, HttpException, SetMetadata, UseInterceptors } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DataSource } from 'typeorm';
import * as crypto from "crypto-js"
import { Request } from 'express';
import * as jwt from "jsonwebtoken"
import { decryptJwt } from 'functions/decrypt-jwt';
import { Role } from './entities/role.entity';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import { ResCode } from 'decarators/response-code.decarator';
@Controller('roles')
@UseInterceptors(new ResponseIntercept(new Reflector()))
@UseGuards(JwtAuth)
export class RolesController {
  constructor(private readonly rolesService: RolesService,private readonly ds:DataSource) {}

  @Post("")
  @ResCode(201,"Success create a user",["super_admin"])
  async create(@Body() createRoleDto: CreateRoleDto,@Req() req:Request) {
    try {
      const resultName = await this.ds.getRepository(Role).findBy({
        name:createRoleDto.name
      })
  
      const access_token = req.headers['authorization']
      const jwt = decryptJwt(access_token)
      if(resultName.length > 0) throw new BadRequestException("Role already exist")
      return await this.rolesService.create(createRoleDto,jwt.name)
    } catch (err) {
      throw new HttpException(err,500)
    }
  }

  @Get()
  @ResCode(200,"Success get all user",["super_admin"])
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  @ResCode(200,"Success get a user",["super_admin"])
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne("id",+id);
  }

  @Patch(':id')
  @ResCode(200,"Success update a user",["super_admin"])
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto,@Req() req:Request) {
    const roleCheck = await this.ds.getRepository(Role).findBy({id:+id})
    const cekRole = await this.ds.getRepository(Role).find({
      where:{
        name:roleCheck[0].name
      },
      withDeleted:false
    })

    if(cekRole.length > 0){
      for (const i of cekRole) {
        if(i.id != roleCheck[0].id){
          throw new BadRequestException("Role already exist")
        }
      }
    }
    if(roleCheck.length <= 0) throw new BadRequestException("Role not found")
    const access_token = req.headers["authorization"] ?? null
      const decrypt = decryptJwt(access_token)
    return this.rolesService.update(+id, updateRoleDto,decrypt.name);
  }

  @Delete(':id')
  @ResCode(200,"Success delete a user",["super_admin"])
  async remove(@Param('id') id: string,@Req() req:Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if(!access_token) throw new UnauthorizedException("Forbidden")
    const jwts = decryptJwt(access_token)
    const role = await this.rolesService.findOne("id",+id)
    if(role.length <= 0) throw new BadRequestException("Role not found")
    return await this.rolesService.remove(+id,jwts.name);
  }
}
