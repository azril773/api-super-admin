import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, Req, BadRequestException, UseGuards, UseInterceptors, Headers, Header } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { DataSource } from 'typeorm';
import { decryptJwt } from 'functions/decrypt-jwt';
import { Request } from 'express';
import { Class } from './entities/class.entity';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { AuthorJob } from 'guards/author-job.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import AuthorDec from 'decarators/author.decarator';
import { ResCode } from 'decarators/response-code.decarator';
import { newDateLocal } from 'functions/dateNow';

@Controller('class')
@UseGuards(JwtAuth)
@UseGuards(AuthorJob)
@UseInterceptors(new ResponseIntercept(new Reflector()))
export class ClassController {
  constructor(private readonly classService: ClassService, private readonly ds: DataSource) { }


  private decrypt(jwt: string) {
    const access_token = jwt ?? null
    if (!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    return jwts
  }


  @Post()
  @AuthorDec([105])
  @ResCode(201, "Success create a class", [])
  async create(@Body() createClassDto: CreateClassDto, @Headers("x-authorization") xAuthorization: string) {
    const jwts = this.decrypt(xAuthorization)
    const checkPeriode = await this.ds.getRepository(Class).findBy({ class: createClassDto.class })
    if (checkPeriode.length > 0) throw new BadRequestException('Class already exist')
    createClassDto["created_by"] = jwts.name
    createClassDto["updated_by"] = jwts.name
    return this.classService.create(createClassDto);
  }

  @Get()
  @AuthorDec([105])
  @ResCode(200, "Success get a class", [])
  async findAll(){
    return await this.classService.findAll();
  }

  @Get(':id')
  @AuthorDec([105])
  @ResCode(200, "Success get all class", [])
  async findOne(@Param('id') id: string){
    return this.classService.findOne(+id, "id");
  }

  @Patch(':id')
  @AuthorDec([105])
  @ResCode(200, "Success update a class", [])
  async update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto, @Headers("x-authorization") xAuthorization: string) {
    const jwts = await this.decrypt(xAuthorization)
    const data = await this.ds.getRepository(Class).findBy({ id: +id })
    if (data.length <= 0) throw new BadRequestException("data not found")
    const check = await this.ds.query("SELECT * FROM classes WHERE class=? AND id <> ? AND deleted_at IS NULL", [updateClassDto.class, +id])
  console.log(check,"kon3")
    if (check.length > 0) throw new BadRequestException("data already exist")
    updateClassDto["updated_by"] = jwts.name
    updateClassDto["updated_at"] =  newDateLocal()
    return await this.classService.update(+id, updateClassDto);
  }

  @Delete(':id')
  @AuthorDec([105])
  @ResCode(200, "Success delete a class", [])
  async remove(@Param('id') id: string, @Headers("x-authorization") xAuthorization: string) {
    const jwts = await this.decrypt(xAuthorization)
    const data = await this.ds.query("SELECT * FROM classes WHERE id=? AND deleted_at IS NOT NULL",[+id])
    if(data.length >0) throw new BadRequestException("data was deleted")
    const check = await this.ds.getRepository(Class).findBy({id:+id})
    if(check.length <= 0) throw new BadRequestException("data not found")
    return this.classService.remove(+id,jwts.name);
  }
}
