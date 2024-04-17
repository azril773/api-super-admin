import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UnauthorizedException, UseGuards, UseInterceptors, Req, BadRequestException, Headers } from '@nestjs/common';
import { PgService } from './pg.service';
import { Db, ObjectId } from 'mongodb';
import { decryptJwt } from 'functions/decrypt-jwt';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { AuthorJob } from 'guards/author-job.guard';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { CreatePgDto } from './dto/create-pg.dto';
import AuthorDec from 'decarators/author.decarator';
import { ResCode } from 'decarators/response-code.decarator';
import { Pg } from './entities/pg.entity';

@Controller('pg')
@UseInterceptors(new ResponseIntercept(new Reflector()))
@UseGuards(JwtAuth)
@UseGuards(AuthorJob)
export class PgController {
  constructor(private readonly ds: DataSource, private readonly pgService: PgService, @Inject("Database") private readonly db: Db) { }

  private async decrypt(jwt: string): Promise<any> {
    try {
      const result = await decryptJwt(jwt)
      return result
    } catch (error) {
      throw new UnauthorizedException("something went wrong")
    }
  }

  private async checkTitle(title:string){
    const result = await this.ds.getRepository(Pg).find({where:{title}})
    if(result.length > 0) throw new BadRequestException("task already exist")
      return result
  }


  @Post()
  @AuthorDec([105])
  @ResCode(201, "Success get all task", [])
  async create(@Body() createPgDto:CreatePgDto,@Headers("authorization") authorization:string){
    const {a,b,c,d,deadline,e,mapel,student_class,title,type} = createPgDto
    await this.decrypt(authorization)
    const data = await this.checkTitle(title)
  }

}
