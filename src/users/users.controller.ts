import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata, BadRequestException, Req, UseInterceptors, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { And, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { decryptJwt } from 'functions/decrypt-jwt';
import { Request } from 'express';
import { Role } from 'src/roles/entities/role.entity';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import { ResCode } from 'decarators/response-code.decarator';
import * as bcrypt from "bcrypt"
import { JobAccess } from 'src/jobs/entities/job_access.entity';
import { newDateLocal } from 'functions/dateNow';

@Controller('users')
@UseInterceptors(new ResponseIntercept(new Reflector()))
@UseGuards(JwtAuth)
export class UsersController {
  constructor(private readonly usersService: UsersService,private readonly ds:DataSource) {}

  @Post("")
  @ResCode(200,"Success create a user",["super_admin"])
  async create(@Body() createUserDto: CreateUserDto,@Req() req:Request) {
    const cekRole = await this.ds.getRepository(Role).findBy({
      id:+createUserDto.role_id
    })

    if(cekRole.length <= 0) throw new BadRequestException("Role not found")
    const user = await this.ds.query("SELECT * FROM users WHERE name=? AND roleIdId=? AND deleted_at IS NULL",[createUserDto.name,+createUserDto.role_id])
    // console.log(user)
    if(user.length > 0) throw new BadRequestException("User already exist")
    const access_token = req.headers["authorization"] ?? null
    const salt = bcrypt.genSaltSync(10)
    try {
      const hash = await bcrypt.hash(createUserDto.password, salt)
        const jwts = decryptJwt(access_token)
        createUserDto["password"] = hash
        createUserDto["roleIdId"] = createUserDto["role_id"]
        return await this.usersService.create(createUserDto,jwts.name)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  @Get()
  @ResCode(200,"Success get all users",["super_admin"])
  async findAll() {
    return await this.usersService.findAll();
  }

  @Post('/:value')
  @ResCode(200,"Success get a user",[])
  async findOne(@Body("key") key: string,@Param("value") value:string | number) {
    const users = await this.usersService.findOne(key,value);
    const id = users[0].id
    const access = await this.ds.getRepository(JobAccess).find({where:{userIdId:id},select:["jobIdId"]})
    return {access,users}
  }


  @Patch(':id')
  @ResCode(200,"Success update a user",["super_admin"])
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Req() req:Request) {
    const access_token = req.headers["authorization"] ?? null
    const jwts = decryptJwt(access_token)
    const cekData = await this.ds.getRepository(User).find({
      where:{
        id:+id
      }
    })
    if(cekData.length <= 0) throw new BadRequestException("User not found")

    const cekName = await this.ds.getRepository(User).find({
      where:{
        name:updateUserDto.name
      }
    })
    // if(cekName.length > 1) throw new BadRequestException("User already exist")
    console.log("ok")
    const salt = bcrypt.genSaltSync(10)
    if(updateUserDto.password){ 
      const hash = await bcrypt.hash(updateUserDto.password, salt)  
      updateUserDto["password"] = hash
    }else{
      updateUserDto["password"] = cekName[0].password
    }
    updateUserDto["roleIdId"] = updateUserDto["role_id"]
    updateUserDto["updated_at"] = newDateLocal()
    updateUserDto["updated_by"] = jwts.name
    return await this.usersService.update(+id,updateUserDto)
  } 

  @Delete(':id')
  @ResCode(200,"Success delete a user",["super_admin"])
  async remove(@Param('id') id: string,@Req() req:Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if(!access_token) throw new UnauthorizedException("Forbidden")
    const jwts = decryptJwt(access_token)
    const user = await this.usersService.findOne("id",+id)
    if(user.length <= 0) throw new BadRequestException("User not found")
    await this.usersService.remove(+id,jwts.name);
    return true
  }
}
