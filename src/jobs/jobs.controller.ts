import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Req, SetMetadata, HttpException, UseInterceptors } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { DataSource } from 'typeorm';
import { Job } from './entities/job.entity';
import { JwtAuth } from 'guards/jwt-auth.guard';
import { Request } from 'express';
import { decryptJwt } from 'functions/decrypt-jwt';
import * as crypto from "crypto-js"
import * as jwt from 'jsonwebtoken'
import { ResCode } from 'decarators/response-code.decarator';
import { ResponseIntercept } from 'intercept/response.intercept';
import { Reflector } from '@nestjs/core';

@Controller('jobs')
@UseGuards(JwtAuth)
@UseInterceptors(new ResponseIntercept(new Reflector()))
export class JobsController {
  constructor(private readonly jobsService: JobsService,private readonly ds:DataSource) {}
  
  @Post()
  @ResCode(201,"Success add a job","super_admin")
  async create(@Body() createJobDto: CreateJobDto,@Req() req:Request) {

    const cekNameJob = await this.ds.getRepository(Job).findBy({
      name:createJobDto.name
    })
    if(cekNameJob.length > 0) throw new BadRequestException("Job already exist")
    const authorization = req.headers["authorization"] ?? null
    const jwts = decryptJwt(authorization)
    await this.jobsService.create(createJobDto,jwts.name)
    return true
  }

  @Get("")
  @ResCode(200,"Success get all job","super_admin")
  async findAll() {
    return await this.jobsService.findAll();
  }

  @Get(':id')
  @ResCode(200,"Success get a job","super_admin")
  async findOne(@Param('id') id: string) {
    return await this.jobsService.findOne("id",+id);
  }

  @Patch(':id')
  @ResCode(200,"Success delete a job","super_admin")
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto,@Req() req:Request) {
      const cekJob = await this.ds.getRepository(Job).find({
        where:{
          id:+id
        }
      })
  
      if(cekJob.length <= 0) throw new BadRequestException("Job not found")
      const cekDelete = await this.ds.getRepository(Job).find({
        where:{
          name:updateJobDto.name
        },
        withDeleted:false
      })
      if(cekDelete.length > 0){
        for (const i of cekDelete) {
          if(i.id != cekJob[0].id){
            throw new BadRequestException("Job already exist")
          }
        }
      }
      const authorization = req.headers["authorization"] ?? null
      const decrypt = decryptJwt(authorization)
  
      await this.jobsService.update(+id, updateJobDto,decrypt.name);
      return true 
  }

  @Delete(':id')
  @ResCode(200,"Success add a job","super_admin")
  async remove(@Param('id') id: string) {
    const job = await this.ds.getRepository(Job).find({
      where:{id:+id}
    })
    console.log(job)
    if(job.length <= 0) throw new BadRequestException("Job not found")
    await this.jobsService.remove(+id);
    return true
  }
}
