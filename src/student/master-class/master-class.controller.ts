import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UnauthorizedException, Req, UseGuards, UseInterceptors, Headers } from '@nestjs/common';
import { MasterClassService } from './master-class.service';
import { CreateMasterClassDto } from './dto/create-master-class.dto';
import { UpdateMasterClassDto } from './dto/update-master-class.dto';
import { DataSource } from 'typeorm';
import { MasterClass } from './entities/master-class.entity';
import { decryptJwt } from 'functions/decrypt-jwt';
import { Request } from 'express';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { AuthorJob } from 'guards/author-job.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import AuthorDec from 'decarators/author.decarator';
import { ResCode } from 'decarators/response-code.decarator';
import { UpdateClassDto } from '../class/dto/update-class.dto';
import { newDateLocal } from 'functions/dateNow';

@Controller('master-class')
@UseGuards(JwtAuth)
@UseGuards(AuthorJob)
@UseInterceptors(new ResponseIntercept(new Reflector()))
export class MasterClassController {
  constructor(private readonly masterClassService: MasterClassService, private readonly ds: DataSource) { }

  private decrypt(jwt: string) {
    const access_token = jwt ?? null
    if (!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    return jwts
  }


  @Post()
  @AuthorDec([105])
  @ResCode(201, "Success create a master class", [])
  async create(@Body() createMasterClassDto: CreateMasterClassDto, @Headers("x-authorization") xAuthorization: string) {
    const jwts = await this.decrypt(xAuthorization)
    const checkPeriode = await this.ds.getRepository(MasterClass).findBy({ name: createMasterClassDto.name })
    if (checkPeriode.length > 0) throw new BadRequestException('zmaster class already exist')
    createMasterClassDto["created_by"] = jwts.name
    createMasterClassDto["updated_by"] = jwts.name
    return this.masterClassService.create(createMasterClassDto);
  }

  @Get()
  @AuthorDec([105])
  @ResCode(200, "Success get a master class", [])
  async findAll(){
    return this.masterClassService.findAll();
  }

  @Get(':id')
  @AuthorDec([105])
  @ResCode(200, "Success get all master class", [])
  async findOne(@Param('id') id: string){
    return this.masterClassService.findOne(+id, "id");
  }

  @Patch(':id')
  @AuthorDec([105])
  @ResCode(200, "Success update a master class", [])
  async update(@Param('id') id: string, @Body() updateMasterClassDto: UpdateMasterClassDto, @Headers("x-authorization") xAuthorization: string) {
    const jwts = await this.decrypt(xAuthorization)
    const check = await this.ds.getRepository(MasterClass).findBy({ id: +id })
    if (check.length <= 0) throw new BadRequestException("data not found")
    const data = await this.ds.query("SELECT * FROM master_class WHERE name=? AND id <> ? AND deleted_at IS NULL", [updateMasterClassDto.name, +id])
    if (data.length > 0) throw new BadRequestException("data already exist")
    updateMasterClassDto["updated_by"] = jwts.name
    updateMasterClassDto["updated_at"] = newDateLocal()
    return await this.masterClassService.update(+id, updateMasterClassDto);
  }

  @Delete(':id')
  @AuthorDec([105])
  @ResCode(200, "Success delete a master class", [])
  async remove(@Param('id') id: string, @Headers("x-authorization") xAuthorization: string) {
    const jwts = await this.decrypt(xAuthorization)
    const data = await this.ds.query("SELECT * FROM master_class WHERE id=? AND deleted_at IS NOT NULL",[+id])
    if(data.length > 0) throw new BadRequestException("data was deleted")
    const check = await this.ds.getRepository(MasterClass).findBy({id:+id})
    if(check.length <= 0) throw new BadRequestException("data not found")
    return this.masterClassService.remove(+id,jwts.name);
  }
}
