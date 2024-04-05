import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, Req, BadRequestException, Headers, UseGuards, UseInterceptors } from '@nestjs/common';
import { PeriodeService } from './periode.service';
import { CreatePeriodeDto } from './dto/create-periode.dto';
import { UpdatePeriodeDto } from './dto/update-periode.dto';
import { decryptJwt } from 'functions/decrypt-jwt';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { Periode } from './entities/periode.entity';
import { newDateLocal } from 'functions/dateNow';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { AuthorJob } from 'guards/author-job.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import AuthorDec from 'decarators/author.decarator';
import { ResCode } from 'decarators/response-code.decarator';

@Controller('periode')
@UseGuards(JwtAuth)
@UseGuards(AuthorJob)
@UseInterceptors(new ResponseIntercept(new Reflector()))
export class PeriodeController {
  constructor(private readonly periodeService: PeriodeService, private readonly ds: DataSource) { }

  private decrypt(jwt: string) {
    const access_token = jwt ?? null
    if (!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    return jwts
  }

  @Post()
  @AuthorDec([105])
  @ResCode(201, "Success create a periode", [])
  async create(@Body() createPeriodeDto: CreatePeriodeDto, @Headers("x-authorization") xAuthorization:string) {
    const jwts = this.decrypt(xAuthorization)
    const { periode } = createPeriodeDto
    const checkPeriode = await this.ds.getRepository(Periode).findBy({ periode })
    if (checkPeriode.length > 0) throw new BadRequestException('Periode already exist')
    createPeriodeDto["created_by"] = jwts.name
    createPeriodeDto["updated_by"] = jwts.name
    return await this.periodeService.create(createPeriodeDto);
  }

  @Get()
  @AuthorDec([105])
  @ResCode(200, "Success get all periode", [])
  async findAll() {
    return await this.periodeService.findAll();
  }

  @Get(':id')
  @AuthorDec([105])
  @ResCode(200, "Success get a periode", [])
  async findOne(@Param('id') id: string) {
    return await this.periodeService.findOne(+id, "id");
  }

  @Patch(':id')
  @AuthorDec([105])
  @ResCode(200, "Success update a periode", [])
  async update(@Param('id') id: string, @Body() updatePeriodeDto: UpdatePeriodeDto,@Headers("x-authorization") xAuthorization:string) {
    this.decrypt(xAuthorization)
    const check = await this.periodeService.findOne(+id,'id')
    if(check.length <= 0) throw new BadRequestException('data not found')

    const data = await this.ds.query("SELECT * FROM periodes WHERE periode=? AND id <> ? AND deleted_at IS NULL", [updatePeriodeDto.periode, id])
    if (data.length > 0) throw new BadRequestException("data already exist")
    updatePeriodeDto["updated_at"] = newDateLocal()
    updatePeriodeDto["updated_by"] = newDateLocal()
    return await this.periodeService.update(+id, updatePeriodeDto);
  }

  @Delete(':id')
  @AuthorDec([105])
  @ResCode(200, "Success delete a periode", [])
  async remove(@Param('id') id: string, @Headers("x-authorization") xAuthorization:string) {
    const jwts = await this.decrypt(xAuthorization)
    const data = await this.ds.query("SELECT * FROM periodes WHERE id=? AND deleted_at IS NOT NULL",[+id])
    if(data.length > 0) throw new BadRequestException("data was deleted")
    const check = await this.ds.getRepository(Periode).findBy({id:+id})
    if(check.length <= 0) throw new BadRequestException("data not found")
    return await this.periodeService.remove(+id,jwts.name);
  }
}
