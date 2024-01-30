import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, BadRequestException, UseGuards, HttpException, SetMetadata } from '@nestjs/common';
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
@Controller('roles')
@UseGuards(JwtAuth)
export class RolesController {
  constructor(private readonly rolesService: RolesService,private readonly ds:DataSource) {}

  @Post("")
  @SetMetadata(process.env.KEY_METADATA_SUPER_ADMIN,"super_admin")
  async create(@Body() createRoleDto: CreateRoleDto,@Req() req:Request) {
    try {
      const resultName = await this.ds.getRepository(Role).findBy({
        name:createRoleDto.name
      })
  
      const getJwt = req.headers['authorization']
      const jwt = decryptJwt(getJwt)
      if(resultName.length > 0) throw new BadRequestException("Role already exist")
      return await this.rolesService.create(createRoleDto,jwt.name)
    } catch (err) {
      throw new HttpException(err,500)
    }
  }

  @Get()
  @SetMetadata(process.env.KEY_METADATA_SUPER_ADMIN,"super_admin")
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  @SetMetadata(process.env.KEY_METADATA_SUPER_ADMIN,"super_admin")
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne("id",+id);
  }

  @Patch(':id')
  @SetMetadata(process.env.KEY_METADATA_SUPER_ADMIN,"super_admin")
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
    const authorization = req.headers["authorization"] ?? null
      const decrypt = decryptJwt(authorization)
    return this.rolesService.update(+id, updateRoleDto,decrypt.name);
  }

  @Delete(':id')
  @SetMetadata(process.env.KEY_METADATA_SUPER_ADMIN,"super_admin")
  async remove(@Param('id') id: string) {
    return await this.rolesService.remove(+id);
  }
}
