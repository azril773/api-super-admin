import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UnauthorizedException, UseGuards, UseInterceptors, Req, BadRequestException, Headers } from '@nestjs/common';
import { PgService } from './pg.service';
import { CreatePgDto } from './dto/create-pg.dto';
import { UpdatePgDto } from './dto/update-pg.dto';
import { Db, ObjectId } from 'mongodb';
import { Request } from 'express';
import { decryptJwt } from 'functions/decrypt-jwt';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { AuthorJob } from 'guards/author-job.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { RandomKode } from 'functions/generate-code';
import { newDateLocal } from 'functions/dateNow';
import AuthorDec from 'decarators/author.decarator';
import { ResCode } from 'decarators/response-code.decarator';
import { Mapel } from 'src/mapel/entity/mapel.entity';
import { StudentClass } from 'src/student/student-class/entities/student-class.entity';

@Controller('pg')
@UseInterceptors(new ResponseIntercept(new Reflector()))
@UseGuards(JwtAuth)
@UseGuards(AuthorJob)
export class PgController {
  constructor(private readonly ds: DataSource, private readonly pgService: PgService, @Inject("Database") private readonly db: Db) { }

  private decryptStr(jwt: string) {
    const access_token = jwt ?? null
    if (!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    return jwts
}

  // decrypt & cek user
  private async decrypt(req: Request) {
    const access_token = req.headers["x-authorization"] ?? null
    if (!access_token) throw new UnauthorizedException("Access denied")
    const jwts = decryptJwt(access_token)
    try {
      const user = await this.ds.getRepository(User).find({
        where: {
          name: jwts.name
        }
      })
      if (user.length <= 0) throw new BadRequestException("User not found")
      return jwts
    } catch (error) {
      throw new Error(error)
    }
  }

  async isUniqueCombination(title:string,studentClassId: number, mapelId: number, taskId?: number) {
    const existingTask = await this.db.collection("pg").findOne({
      title,
        student_class:studentClassId,
        mapel:mapelId,
        deleted_at:null
    });

    return !existingTask
  }

  @Post()
  @AuthorDec([105])
  @ResCode(201, "Success create a pg", [])
  async create(@Body() createPgDto: CreatePgDto, @Req() req: Request) {
    const exist = await this.isUniqueCombination(createPgDto.title,createPgDto.student_class,createPgDto.mapel)
    const data = await this.db.collection("pg").find({ title: createPgDto.title }).toArray()
    if(!exist) throw new BadRequestException("data already exist")
    if (data.length > 0) throw new BadRequestException("Task already exist")
    const mapel = await this.ds.getRepository(Mapel).findBy({id:+createPgDto.mapel})
    if(mapel.length <= 0) throw new BadRequestException("mapel not found")
    const studentClass = await this.ds.getRepository(StudentClass).findBy({id:+createPgDto.student_class})
    if(studentClass.length <= 0) throw new BadRequestException("student class not found")
    const jwts = await this.decrypt(req)
    
    const kode = RandomKode(6)
    createPgDto["type"] = 'pg'
    createPgDto["kode"] = kode
    createPgDto["created_by"] = jwts.name
    createPgDto["updated_by"] = jwts.name
    createPgDto["updated_by"] = jwts.name
    createPgDto["created_at"] = newDateLocal()
    createPgDto["updated_at"] = newDateLocal()
    createPgDto["deleted_at"] = null
    return this.pgService.create(createPgDto);
  }

  @Get()
  @AuthorDec([105])
  @ResCode(201, "Success get all pg", [])
  async findAll(@Headers("x-authorization") xAuthorization:string) {
    const jwts = this.decryptStr(xAuthorization)
    return await this.pgService.findAll(jwts.name);
  }
  
  @Get("/get/student")
  @AuthorDec([105])
  @ResCode(201, "Success get all pg", [])
  async findAllStudent(@Headers("x-authorization") xAuthorization:string) {
    const jwts = this.decryptStr(xAuthorization)

    const classs = await this.ds.query("SELECT * FROM users JOIN students ON users.id=students.userIdId JOIN student_class ON students.studentClassIdId=student_class.id JOIN classes ON classes.id=student_class.classIdId WHERE users.deleted_at IS NULL AND users.name=?",[jwts.name])
    console.log(classs)
    
    return await this.pgService.findAll(jwts.name);
  }
  
  @Get(':kode')
  @AuthorDec([105])
  @ResCode(201, "Success get a pg", [])
  async findOne(@Param('kode') kode: string,@Headers("x-authorization") xAuthorization:string) {
    const jwts = this.decryptStr(xAuthorization)
    return await this.pgService.findOne(kode,jwts.name);
  }
  
  @Patch(':kode')
  @AuthorDec([105])
  @ResCode(201, "Success update a pg", [])
  async update(@Param('kode') kode: string, @Body() updatePgDto: UpdatePgDto, @Req() req: Request) {
    const jwts = await this.decrypt(req)
    const existingTask = await this.db.collection("pg").findOne({
        title:updatePgDto.title,
        student_class:updatePgDto.student_class,
        mapel:updatePgDto.mapel,
        deleted_at:null,
        kode:{$ne:kode}
    });
    console.log(existingTask)
    if(existingTask) throw new BadRequestException("data already exist")
    const data = await this.db.collection("pg").find({kode,deleted_at:null}).toArray()
    if(data.length <= 0) throw new BadRequestException("Task not found") 
    const mapel = await this.ds.getRepository(Mapel).findBy({id:+updatePgDto.mapel})
    if(mapel.length <= 0) throw new BadRequestException("mapel not found")
    const studentClass = await this.ds.getRepository(StudentClass).findBy({id:+updatePgDto.student_class})
    if(studentClass.length <= 0) throw new BadRequestException("student class not found")

    updatePgDto["updated_by"] = jwts.name
    updatePgDto["updated_at"] = newDateLocal()
    return this.pgService.update(kode, updatePgDto);
  }
  
  @Delete(':kode')
  @AuthorDec([105])
  @ResCode(201, "Success delete a pg", [])
  async remove(@Param('kode') kode: string) {
    return await this.pgService.remove(kode);
  }
}
